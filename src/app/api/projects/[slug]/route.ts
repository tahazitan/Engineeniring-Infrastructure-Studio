import {NextResponse} from 'next/server';
import {findProject,isPrivate,isSameOrigin,pool,storeProject} from '@/lib/server';
import {projectSchema} from '@/lib/schema';
export const runtime='nodejs';export const dynamic='force-dynamic';
type Ctx={params:Promise<{slug:string}>};
const denied=()=>NextResponse.json({error:'Private studio only'},{status:403});
export async function GET(_req:Request,ctx:Ctx){
 const {slug}=await ctx.params;
 if(!/^[a-z0-9-]{2,80}$/.test(slug))return NextResponse.json({error:'Invalid project slug'},{status:400});
 const p=await findProject(slug);
 if(!p||(!isPrivate()&&!(p.public_visible&&p.status==='verified')))return NextResponse.json({error:'Not found'},{status:404});
 return NextResponse.json({project:p});
}
export async function PUT(req:Request,ctx:Ctx){
 if(!isPrivate())return denied();
 if(!isSameOrigin(req))return NextResponse.json({error:'Origin verification failed'},{status:403});
 const {slug}=await ctx.params;
 if(!/^[a-z0-9-]{2,80}$/.test(slug))return NextResponse.json({error:'Invalid project slug'},{status:400});
 let input:unknown;try{input=await req.json()}catch{return NextResponse.json({error:'Invalid JSON'},{status:400})}
 const parsed=projectSchema.safeParse(input);
 if(!parsed.success)return NextResponse.json({error:'Invalid project data',issues:parsed.error.flatten()},{status:400});
 const project=parsed.data;
 if(project.slug!==slug)return NextResponse.json({error:'Project slug mismatch'},{status:400});
 if(project.status==='verified'){
 const testsDone=project.test_plan.length>0&&project.test_plan.every(t=>t.status==='passed');
 const checklistDone=project.checklist.length>0&&project.checklist.every(x=>x.done);
 if(!testsDone||!checklistDone)return NextResponse.json({error:'Complete all acceptance tests and checklist items before verification.'},{status:422});
 try{const n=await pool().query('SELECT count(*)::int AS n FROM evidence WHERE project_slug=$1',[slug]);
 if(!n.rows[0]?.n)return NextResponse.json({error:'Upload real evidence before verification.'},{status:422});
 }catch{return NextResponse.json({error:'Evidence database unavailable'},{status:503})}
 }
 try{await storeProject(project);return NextResponse.json({ok:true,project});}
 catch(e){return NextResponse.json({error:'Database unavailable. Start Docker services and check DATABASE_URL.'},{status:503})}
}
