import {createHash} from 'node:crypto';
import {S3Client,DeleteObjectCommand} from '@aws-sdk/client-s3';
import pg from 'pg';

process.loadEnvFile('.env');
const base='http://127.0.0.1:3000';
if(process.env.STUDIO_MODE!=='private')throw Error('Run integration audit only on private local Studio');
const db=new pg.Pool({connectionString:process.env.DATABASE_URL,connectionTimeoutMillis:2500});
const s3=new S3Client({region:'us-east-1',endpoint:'http://'+(process.env.MINIO_ENDPOINT||'127.0.0.1')+':'+(process.env.MINIO_PORT||'9000'),forcePathStyle:true,credentials:{accessKeyId:process.env.MINIO_ACCESS_KEY,secretAccessKey:process.env.MINIO_SECRET_KEY}});
let testProject=null,uploadedId=null;
const check=(ok,label)=>{if(!ok)throw Error('FAIL '+label);console.log('PASS  '+label)};
async function get(path){const response=await fetch(base+path,{signal:AbortSignal.timeout(15000)});return {response,body:await response.json()};}
try{
 let {response,body}=await get('/_system/status');
 check(response.ok&&body.server==='express','Express and Next.js custom server');
 ({response,body}=await get('/api/health'));
 check(response.ok&&body.database==='ok','PostgreSQL API health');
 ({response,body}=await get('/api/storage'));
 check(response.ok&&body.connected&&body.bucketReady,'S3-compatible Evidence Vault health');
 ({response,body}=await get('/api/projects'));
 check(response.ok&&Array.isArray(body.projects)&&body.projects.length>=12,'Project catalog and database');
 const project=body.projects.find(p=>p.slug==='enterprise-multisite');
 check(Boolean(project),'Existing enterprise project blueprint');
 check(body.projects.filter(p=>p.status==='planned').every(p=>p.topology.nodes.length===0||p.topology.nodes.some(n=>n.data.platform||n.data.ip)),'Planned projects do not display fake device graphs');
 check(body.projects.every(p=>p.topology.nodes.length===0||p.topology.edges.every(e=>p.topology.nodes.some(n=>n.id===e.source)&&p.topology.nodes.some(n=>n.id===e.target))),'Project references contain only valid connections');
 check(body.projects.every(p=>{const ids=new Set(p.topology.nodes.map(n=>n.id));return p.topology.edges.every(e=>ids.has(e.source)&&ids.has(e.target))}),'Every topology link resolves to existing device nodes');
 const forged=await fetch(base+'/api/projects/'+project.slug,{method:'PUT',headers:{Origin:'https://untrusted.example','Content-Type':'application/json'},body:JSON.stringify(project)});
 check(forged.status===403,'Cross-origin write rejected');
 testProject={...structuredClone(project),slug:'audit-e2e-temporary',title:'Temporary Automated Audit Project',status:'planned',public_visible:false};
 testProject.checklist=testProject.checklist.map(t=>({...t,done:false}));
 testProject.test_plan=testProject.test_plan.map(t=>({...t,status:'pending'}));
 testProject.topology={nodes:[{id:'a',position:{x:0,y:0},data:{label:'HQ Router',kind:'router',platform:'Cisco',ip:'10.33.0.1/30',zone:'HQ',vlan:'99',role:'BGP border gateway'}},{id:'b',position:{x:250,y:0},data:{label:'Branch Switch',kind:'switch',platform:'ethernet_switch'}}],edges:[{id:'test-link',source:'a',target:'b',sourcePort:'0/0',targetPort:'0/1',linkRole:'802.1Q trunk'}]};
 let saved=await fetch(base+'/api/projects/'+testProject.slug,{method:'PUT',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify(testProject)});
 check(saved.ok,'Project save via API');
 ({response,body}=await get('/api/projects/'+testProject.slug));
 check(response.ok&&body.project.slug===testProject.slug,'Project persistent read via API');
 check(body.project.topology.nodes[0].data.kind==='router'&&body.project.topology.edges[0].targetPort==='0/1','GNS3 device roles and interface labels persisted');
 check(body.project.topology.nodes[0].data.ip==='10.33.0.1/30'&&body.project.topology.nodes[0].data.zone==='HQ'&&body.project.topology.nodes[0].data.vlan==='99'&&body.project.topology.edges[0].linkRole==='802.1Q trunk','Full engineering topology device/link properties persisted');
 const form=new FormData();
 form.set('file',new File([Buffer.from('Audit test payload')],'studio-integration-test.txt',{type:'text/plain'}));
 form.set('caption','Temporary automated test - to be deleted');
 let upload=await fetch(base+'/api/evidence/enterprise-multisite',{method:'POST',headers:{Origin:base},body:form});
 const uploaded=await upload.json();
 check(upload.status===201&&Boolean(uploaded.id),'Evidence file upload to object storage');
 check(uploaded.sha256===createHash('sha256').update('Audit test payload').digest('hex'),'Evidence SHA-256 content checksum');
 uploadedId=uploaded.id;
 const download=await fetch(base+'/api/evidence/enterprise-multisite/'+uploadedId);
 check(download.ok&&(await download.text())==='Audit test payload','Evidence download and integrity');
 ({response,body}=await get('/api/evidence/enterprise-multisite'));
 check(response.ok&&body.evidence.some(e=>e.id===uploadedId),'Evidence register listing');
 ({response,body}=await get('/api/gns3'));
 console.log(response.ok&&body.connected?'PASS  GNS3 local API connected':'WARN  GNS3 local API offline (optional)');
 if(response.ok&&body.connected){
  const t=await get('/api/gns3?action=templates');check(t.response.ok&&Array.isArray(t.body.templates),'Live GNS3 local templates API');
  const x=await get('/api/gns3?action=projects');check(x.response.ok&&Array.isArray(x.body.projects),'Live GNS3 native projects API');
  const blocked=await fetch(base+'/api/gns3',{method:'POST',headers:{Origin:'https://evil.example','Content-Type':'application/json'},body:JSON.stringify({action:'create_project',name:'Never-Create-This'})});
  check(blocked.status===403,'GNS3 native writes reject forged Origin');
  const invalid=await fetch(base+'/api/gns3',{method:'POST',headers:{Origin:base,'Content-Type':'application/json'},body:JSON.stringify({action:'invalid'})});
  check(invalid.status===400,'GNS3 actions reject invalid operations');
 }
 const preview=await fetch(base+'/api/studio/design-assets?asset=preview');
 check(preview.ok&&preview.headers.get('content-type')?.includes('image/jpeg'),'Original template confined to private Studio source endpoint');
 const unknownAsset=await fetch(base+'/api/studio/design-assets?asset=other');
 check(unknownAsset.status===400,'Private source route rejects unknown asset names');
 const noPublicDemo=await fetch(base+'/examples/taha-network-demo.gns3');
 check(noPublicDemo.status===404,'Synthetic GNS3 demo removed from public assets');
 const staticLogo=await fetch(base+'/tech/cisco.svg');
 check(staticLogo.ok,'Locally served technology brand assets');
 console.log('Local integration audit PASSED.');
}catch(e){console.error('Local integration audit FAILED:',e.message);process.exitCode=1;}
finally{
 try{
  if(uploadedId){
   const removed=await db.query('DELETE FROM evidence WHERE id=$1 RETURNING object_key',[uploadedId]);
   if(removed.rows[0])await s3.send(new DeleteObjectCommand({Bucket:process.env.MINIO_BUCKET||'studio-evidence',Key:removed.rows[0].object_key}));
  }
  if(testProject)await db.query('DELETE FROM projects WHERE slug=$1',[testProject.slug]);
  console.log('Temporary audit data cleaned.');
 }catch(e){console.error('Audit cleanup error:',e.message);process.exitCode=1;}
 await db.end();s3.destroy();
}
