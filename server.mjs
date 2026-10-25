import express from 'express';
import next from 'next';

const dev=process.env.NODE_ENV!=='production';
const hostname='127.0.0.1';
const port=Number(process.env.PORT||3000);
if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid local server port');

const nextApp=next({dev,hostname,port});
await nextApp.prepare();
const handler=nextApp.getRequestHandler();
const app=express();
app.disable('x-powered-by');
app.use((_req,res,nextMiddleware)=>{
 res.setHeader('X-Content-Type-Options','nosniff');
 res.setHeader('Referrer-Policy','strict-origin-when-cross-origin');
 nextMiddleware();
});
app.get('/_system/status',(_req,res)=>res.status(200).json({
 application:'Taha Infrastructure Studio',server:'express',runtime:'node',mode:process.env.STUDIO_MODE||'unspecified',status:'ready'
}));
app.use((req,res)=>handler(req,res));
const server=app.listen(port,hostname,()=>console.log(`Studio with Express listening at http://${hostname}:${port}`));
function shutdown(){server.close(()=>process.exit(0));}
process.once('SIGINT',shutdown);
process.once('SIGTERM',shutdown);
