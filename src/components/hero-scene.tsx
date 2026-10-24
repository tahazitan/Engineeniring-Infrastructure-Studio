'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {Float,Line,OrbitControls,Stars} from '@react-three/drei';
import {Suspense,useRef} from 'react';
import * as THREE from 'three';
const devices:[number,number,number][]=[[-3.1,.85,-.3],[-1.15,-.55,.8],[1.1,.45,0],[3.25,-.7,-.4],[-.5,2.15,-.6],[2.1,2.1,-1.1]];
const connections:[number,number][]=[[0,1],[1,2],[2,3],[0,4],[4,5],[5,2],[1,5]];
const cool='#8fece1',warm='#efc28d',violet='#a4b8ff';
function Chassis({position,index}:{position:[number,number,number];index:number}){
 const shell=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(shell.current)shell.current.rotation.y=Math.sin(clock.elapsedTime*.25+index)*.1});
 const accent=index%3===0?warm:index%3===1?cool:violet;
 return <Float speed={1.05+index*.06} rotationIntensity={.06} floatIntensity={.17}><group ref={shell} position={position}>
 <mesh castShadow><boxGeometry args={[1.16,.4,.76]}/><meshStandardMaterial color="#183142" metalness={.9} roughness={.23}/></mesh>
 <mesh position={[0,.208,0]}><boxGeometry args={[1.12,.025,.73]}/><meshStandardMaterial color="#314d5e" metalness={.98} roughness={.18}/></mesh>
 <mesh position={[0,-.03,.388]}><boxGeometry args={[1.08,.23,.019]}/><meshStandardMaterial color="#0a1a27" metalness={.85} roughness={.29}/></mesh>
 {Array.from({length:6},(_,i)=><mesh key={'vent'+i} position={[-.44+i*.08,-.065,.404]}><boxGeometry args={[.04,.075,.009]}/><meshStandardMaterial color="#456576" metalness={.7} roughness={.3}/></mesh>)}
 {[0,1,2].map(i=><mesh key={'port'+i} position={[.22+i*.15,-.015,.406]}><boxGeometry args={[.095,.075,.016]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={i===index%3?2.4:.46}/></mesh>)}
 <mesh position={[0,-.237,0]}><boxGeometry args={[1.26,.035,.8]}/><meshStandardMaterial color="#405866" metalness={.85}/></mesh>
 <mesh position={[0,.3,0]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[.22,.242,40]}/><meshBasicMaterial color={accent} transparent opacity={.44} side={THREE.DoubleSide}/></mesh>
 </group></Float>;
}
function Packet({a,b,offset=0}:{a:[number,number,number];b:[number,number,number];offset?:number}){
 const ref=useRef<THREE.Mesh>(null);
 const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);
 useFrame(({clock})=>{const t=((clock.elapsedTime*.18+offset)%1+1)%1;if(ref.current){ref.current.position.lerpVectors(start,end,t);const scalar=.65+Math.sin(Math.PI*t)*.5;ref.current.scale.setScalar(scalar);}});
 return <mesh ref={ref}><sphereGeometry args={[.041,12,12]}/><meshBasicMaterial color="#c6fff7" toneMapped={false}/></mesh>;
}
function ServerCluster(){
 return <group position={[-.5,2.14,-.75]}><mesh position={[0,.36,-.31]}><boxGeometry args={[.95,.88,.18]}/><meshStandardMaterial color="#1d3c4b" metalness={.85} roughness={.3}/></mesh>
 {[0,1,2,3].map(i=><group key={i} position={[0,.06+i*.18,-.22]}><mesh><boxGeometry args={[.78,.12,.26]}/><meshStandardMaterial color="#071c2b" metalness={.8}/></mesh>
 <mesh position={[.3,0,.14]}><boxGeometry args={[.07,.025,.018]}/><meshBasicMaterial color={i%2?cool:warm}/></mesh></group>)}</group>;
}
function World(){
 const root=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(root.current)root.current.rotation.y=Math.sin(clock.elapsedTime*.11)*.07});
 return <group ref={root} rotation={[.15,-.23,0]}>
 <gridHelper args={[11,18,'#315365','#173341']} position={[0,-2.15,-1.4]}/>
 {connections.map(([a,b],i)=><group key={i}><Line points={[devices[a],devices[b]]} color={i%2?cool:violet} lineWidth={1.3} transparent opacity={.55}/><Packet a={devices[a]} b={devices[b]} offset={i*.21}/></group>)}
 {devices.map((position,index)=><Chassis position={position} index={index} key={index}/>)}
 <ServerCluster/>
 {devices.map((position,index)=><mesh key={'node'+index} position={position}><sphereGeometry args={[.054,12,12]}/><meshBasicMaterial color="#e4fff9"/></mesh>)}
 <mesh position={[0,-1.8,-1.1]} rotation={[-Math.PI/2,0,0]}><ringGeometry args={[2.85,2.9,96]}/><meshBasicMaterial side={THREE.DoubleSide} color="#397d87" transparent opacity={.29}/></mesh>
 </group>;
}
export default function HeroScene(){return <div className="hero-canvas" aria-label="Interactive three-dimensional network topology with servers and animated traffic">
 <Canvas camera={{position:[0,1.35,9.6],fov:44}} dpr={[1,1.7]} gl={{antialias:true,alpha:true}}>
 <ambientLight intensity={1.2}/><directionalLight position={[4,6,5]} intensity={2.7} color="#b1d3fa"/><pointLight position={[-4,0,3]} intensity={21} color="#46ada8"/>
 <Suspense fallback={null}><Stars radius={80} depth={20} count={480} factor={1.3} fade speed={.25}/><World/></Suspense>
 <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI*.75} minPolarAngle={Math.PI*.24}/>
 </Canvas></div>}
