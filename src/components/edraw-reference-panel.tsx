'use client';
import {useEffect,useState} from 'react';
import {Archive,Image as ImageIcon,ZoomIn,ZoomOut} from 'lucide-react';
type Props={slug:string;onSaved:()=>void};
export default function EdrawReferencePanel({slug,onSaved}:Props){
 const [file,setFile]=useState<File|null>(null),[url,setUrl]=useState<string|null>(null),[zoom,setZoom]=useState(100),[caption,setCaption]=useState('EdrawMax design reference'),[message,setMessage]=useState('Export your EdrawMax diagram to SVG, PNG, JPG or WebP. A native .eddx file cannot render directly in this browser.'),[busy,setBusy]=useState(false);
 useEffect(()=>{if(!file){setUrl(null);return;}const next=URL.createObjectURL(file);setUrl(next);return ()=>URL.revokeObjectURL(next)},[file]);
 const choose=(next:File|undefined)=>{
  if(!next){setFile(null);return;}
  const accepted=['image/png','image/jpeg','image/webp','image/svg+xml'].includes(next.type)||/\.(png|jpe?g|webp|svg)$/i.test(next.name);
  if(!accepted){setMessage('Use EdrawMax → Export → SVG, PNG or JPG; .eddx is not a web image.');return;}
  if(next.size>10*1024*1024){setMessage('Maximum reference size is 10 MB. Export a smaller image from EdrawMax.');return;}
  setFile(next);setZoom(100);setMessage('Reference loaded locally. It is not an editable GNS3 topology and has not been uploaded.');
 };
 const archive=async()=>{
  if(!file||file.type==='image/svg+xml'){setMessage('For archiving, export the EdrawMax diagram as PNG/JPG/WebP first. SVG can be previewed locally only.');return;}
  setBusy(true);
  try{
   const form=new FormData();form.append('file',file);form.append('caption',caption+' · EdrawMax exported reference (design only; not test evidence)');
   const response=await fetch('/api/evidence/'+slug,{method:'POST',body:form});
   const body=await response.json();
   if(!response.ok)throw Error(body.error||'Upload failed');
   setMessage('EdrawMax design reference archived with SHA-256. It is a design source, not proof of a running lab.');
   onSaved();
  }catch(e){setMessage(e instanceof Error?e.message:'Could not archive the reference.');}
  finally{setBusy(false);}
 };
 return <section className="edraw-reference" aria-labelledby="edraw-title">
  <div className="edraw-reference-header"><ImageIcon size={18}/><h3 id="edraw-title">EDRAWMAX / DESIGN REFERENCE</h3></div>
  <div className="edraw-template-panel">
   <div><h4>YOUR ORIGINAL WEBSITE TEMPLATE / PRIVATE DESIGN SOURCE</h4><p>Source: supplied Illustrator (.ai), EPS and JPEG preview. Stored locally under .studio-assets and not published with the marketing site.</p><div className="edraw-source-links"><a href="/api/studio/design-assets?asset=ai" download>Download Illustrator source</a><a href="/api/studio/design-assets?asset=eps" download>Download EPS source</a></div></div>
   <img src="/api/studio/design-assets?asset=preview" alt="Original violet and navy landing-page design supplied by the user" loading="lazy"/>
  </div>
  <p>Wondershare EdrawMax is a separate desktop application. Export your diagram there, then load it below for visual review. This is a file workflow, not a claimed EdrawMax API connection.</p>
  <label className="wb-control edraw-reference-upload">Import EdrawMax export<input type="file" hidden accept=".png,.jpg,.jpeg,.webp,.svg,image/*" onChange={e=>choose(e.target.files?.[0])}/></label>
  <p role="status" className="wb-hint">{message}</p>
  {url&&file&&<><div className="edraw-reference-bar"><span>{file.name} · {(file.size/1024).toFixed(0)} KB</span><div><button type="button" onClick={()=>setZoom(z=>Math.max(50,z-25))} aria-label="Zoom out"><ZoomOut size={16}/></button><span>{zoom}%</span><button type="button" onClick={()=>setZoom(z=>Math.min(200,z+25))} aria-label="Zoom in"><ZoomIn size={16}/></button></div></div>
   <div className="edraw-reference-canvas"><img alt={'Imported EdrawMax diagram: '+file.name} src={url} style={{width:zoom+'%',maxWidth:'none'}}/></div>
   <label className="edraw-reference-label">Archive description<input className="wb-input" value={caption} maxLength={180} onChange={e=>setCaption(e.target.value)}/></label>
   <button className="wb-control" type="button" disabled={busy} onClick={archive}><Archive size={15}/>{busy?'Archiving…':'Archive reference in Evidence Vault'}</button>
  </>}
 </section>;
}
