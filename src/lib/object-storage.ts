import {
 S3Client,HeadBucketCommand,CreateBucketCommand,PutObjectCommand,GetObjectCommand,DeleteObjectCommand
} from '@aws-sdk/client-s3';

const globalS3=globalThis as unknown as {studioS3Client?:S3Client};
function transport(){
 if(globalS3.studioS3Client)return globalS3.studioS3Client;
 const host=process.env.MINIO_ENDPOINT||'127.0.0.1';
 const port=Number(process.env.MINIO_PORT||9000);
 return globalS3.studioS3Client=new S3Client({
  region:'us-east-1',
  endpoint:'http://'+host+':'+port,
  forcePathStyle:true,
  credentials:{accessKeyId:process.env.MINIO_ACCESS_KEY||'',secretAccessKey:process.env.MINIO_SECRET_KEY||''},
  maxAttempts:2
 });
}
/** Narrow S3-compatible storage adapter, matching the Studio's historical MinIO client operations. */
export function createObjectStore(){
 const client=transport();
 return {
  async bucketExists(name:string):Promise<boolean>{
   try{await client.send(new HeadBucketCommand({Bucket:name}));return true;}
   catch(e){const status=(e as {$metadata?:{httpStatusCode?:number}}).$metadata?.httpStatusCode;if(status===404)return false;throw e;}
  },
  async makeBucket(name:string):Promise<void>{await client.send(new CreateBucketCommand({Bucket:name}));},
  async putObject(name:string,key:string,content:Buffer,_size:number,metadata:{'Content-Type'?:string}={}):Promise<void>{
   await client.send(new PutObjectCommand({Bucket:name,Key:key,Body:content,ContentType:metadata['Content-Type']||'application/octet-stream',ContentLength:content.length}));
  },
  async getObject(name:string,key:string):Promise<AsyncIterable<Uint8Array>>{
   const response=await client.send(new GetObjectCommand({Bucket:name,Key:key}));
   if(!response.Body)throw Error('Object storage returned an empty response body');
   return response.Body as unknown as AsyncIterable<Uint8Array>;
  },
  async removeObject(name:string,key:string):Promise<void>{await client.send(new DeleteObjectCommand({Bucket:name,Key:key}));}
 };
}
export type StorageClient=ReturnType<typeof createObjectStore>;
