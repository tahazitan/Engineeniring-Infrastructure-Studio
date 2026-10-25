import {Pool} from 'pg';
import {createObjectStore,type StorageClient} from './object-storage';
import type {Project} from './types';
import {projects} from './catalog';
import {showReferenceDesign} from './reference-topologies';
const globalDb=globalThis as unknown as {studioPool?:Pool};
export function pool():Pool {if(!process.env.DATABASE_URL)throw new Error('DATABASE_URL not configured');return globalDb.studioPool??=new Pool({connectionString:process.env.DATABASE_URL,max:4,connectionTimeoutMillis:2200});}
export const isPrivate=()=>process.env.STUDIO_MODE==='private';
export function isSameOrigin(req:Request):boolean {
 const origin=req.headers.get('origin');if(!origin)return false;
 try{
  const supplied=new URL(origin),internal=new URL(req.url);
  if(supplied.protocol!==internal.protocol)return false;
  if(supplied.host===internal.host)return true;
  const loopback=new Set(['localhost','127.0.0.1','[::1]']);
  return process.env.STUDIO_MODE==='private'&&supplied.protocol==='http:'&&loopback.has(supplied.hostname)&&loopback.has(internal.hostname)&&supplied.port===internal.port;
 }catch{return false;}
}
export async function listProjects():Promise<Project[]>{const result=await pool().query('SELECT * FROM projects ORDER BY updated_at DESC');if(!result.rowCount)return projects;const stored=(result.rows as Project[]).map(showReferenceDesign);const slugs=new Set(stored.map(x=>x.slug));return [...stored,...projects.filter(x=>!slugs.has(x.slug))];}
export async function findProject(slug:string):Promise<Project|undefined>{try{const result=await pool().query('SELECT * FROM projects WHERE slug=$1',[slug]);if(result.rows[0])return showReferenceDesign(result.rows[0] as Project);}catch{}return projects.find(x=>x.slug===slug);}
export async function storeProject(p:Project){await pool().query(`INSERT INTO projects (slug,title,domain,summary,stack,objectives,checklist,test_plan,topology,configuration,status,public_visible)
VALUES ($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb,$8::jsonb,$9::jsonb,$10,$11,$12)
ON CONFLICT(slug) DO UPDATE SET title=EXCLUDED.title,domain=EXCLUDED.domain,summary=EXCLUDED.summary,stack=EXCLUDED.stack,objectives=EXCLUDED.objectives,checklist=EXCLUDED.checklist,test_plan=EXCLUDED.test_plan,topology=EXCLUDED.topology,configuration=EXCLUDED.configuration,status=EXCLUDED.status,public_visible=EXCLUDED.public_visible,updated_at=now()`,[p.slug,p.title,p.domain,p.summary,JSON.stringify(p.stack),JSON.stringify(p.objectives),JSON.stringify(p.checklist),JSON.stringify(p.test_plan),JSON.stringify(p.topology),p.configuration,p.status,p.public_visible]);}
export function minio(){return createObjectStore();}
export async function bucket(client:StorageClient){const name=process.env.MINIO_BUCKET||'studio-evidence';if(!(await client.bucketExists(name)))await client.makeBucket(name);return name;}

/** Idempotent catalog seed for evidence and lab job records. */
export async function ensureProjectRow(slug:string){
 const p=projects.find(x=>x.slug===slug);
 if(!p)throw new Error('Unknown project');
 await pool().query(`INSERT INTO projects(slug,title,domain,summary,stack,objectives,checklist,test_plan,topology,configuration,status,public_visible)
 VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7::jsonb,$8::jsonb,$9::jsonb,$10,$11,$12)
 ON CONFLICT(slug) DO NOTHING`,[p.slug,p.title,p.domain,p.summary,JSON.stringify(p.stack),JSON.stringify(p.objectives),JSON.stringify(p.checklist),JSON.stringify(p.test_plan),JSON.stringify(p.topology),p.configuration,p.status,p.public_visible]);
}
