import {NextResponse} from 'next/server';import {pool} from '@/lib/server';
export const runtime='nodejs';export const dynamic='force-dynamic';
export async function GET(){try{await pool().query('SELECT 1');return NextResponse.json({app:'ok',database:'ok',mode:process.env.STUDIO_MODE==='public'?'public':'private'});}catch{return NextResponse.json({app:'ok',database:'offline',mode:process.env.STUDIO_MODE==='public'?'public':'private'},{status:503})}}
