import {z} from 'zod';
const id=z.string().min(1).max(80);
export const projectSchema=z.object({
slug:z.string().regex(/^[a-z0-9-]{2,80}$/),title:z.string().min(1).max(160),domain:z.string().max(80),summary:z.string().max(1500),
stack:z.array(z.string().max(80)).max(40),objectives:z.array(z.string().max(500)).max(50),
checklist:z.array(z.object({id,title:z.string().max(500),done:z.boolean()})).max(120),
test_plan:z.array(z.object({id,title:z.string().max(500),expected:z.string().max(800),status:z.enum(['pending','passed','failed']),notes:z.string().max(3000).optional()})).max(160),
topology:z.object({nodes:z.array(z.object({id,position:z.object({x:z.number().finite(),y:z.number().finite()}),data:z.object({label:z.string().min(1).max(150),kind:z.string().max(32).optional(),platform:z.string().max(64).optional()}),type:z.string().optional()})).max(150),edges:z.array(z.object({id,source:id,target:id,animated:z.boolean().optional(),sourcePort:z.string().max(64).optional(),targetPort:z.string().max(64).optional()})).max(300)}),
configuration:z.string().max(300000),status:z.enum(['planned','in_progress','verified']),public_visible:z.boolean()
});
