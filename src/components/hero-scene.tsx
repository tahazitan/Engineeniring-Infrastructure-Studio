'use client';
import {Canvas,useFrame} from '@react-three/fiber';
import {Float,Line,OrbitControls,Stars} from '@react-three/drei';
import {Suspense,useRef} from 'react';
import * as THREE from 'three';
const positions:[number,number,number][]=[[-3.1,0.85,-0.3],[-1.15,-.55,0.8],[1.1,.45,0],[3.25,-.7,-.4],[-.5,2.15,-.6],[2.1,2.1,-1.1]];
const links:[number,number][]=[[0,1],[1,2],[2,3],[0,4],[4,5],[5,2],[1,5]];
function Unit({position,index}:{position:[number,number,number];index:number}){
 const ref=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(ref.current)ref.current.rotation.y=Math.sin(clock.elapsedTime*.32+index)*.14});
 const accent=index%3===0?'#fbbf71':index%3===1?'#82f2e1':'#9faeff';
 return <Float speed={1.3+index*.1} rotationIntensity={.13} floatIntensity={.26}>
 <group position={position} ref={ref}>
 <mesh><boxGeometry args={[1.05,.32,.72]}/><meshStandardMaterial color="#12263b" metalness={.83} roughness={.24}/></mesh>
 <mesh position={[0,.175,0]}><boxGeometry args={[.92,.025,.6]}/><meshStandardMaterial color="#31516e" metalness={.9} roughness={.2}/></mesh>
 {[-.38,-.18,.02,.22].map((x,k)=><mesh key={k} position={[x,.015,.368]}><boxGeometry args={[.09,.055,.022]}/><meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={1.6}/></mesh>)}
 <mesh position={[-.4,-.27,0]}><boxGeometry args={[.07,.23,.07]}/><meshStandardMaterial color="#2d5a79"/></mesh>
 <mesh position={[.4,-.27,0]}><boxGeometry args={[.07,.23,.07]}/><meshStandardMaterial color="#2d5a79"/></mesh>
 </group></Float>
}
function Infrastructure(){
 const group=useRef<THREE.Group>(null);
 useFrame(({clock})=>{if(group.current)group.current.rotation.y=Math.sin(clock.elapsedTime*.13)*.085});
 return <group ref={group} rotation={[.14,-.26,0]}>
 {links.map(([a,b],i)=><Line key={i} points={[positions[a],positions[b]]} color={i%2?'#8ce4dd':'#8ea8f9'} lineWidth={1.25} transparent opacity={.4}/>)}
 {positions.map((p,i)=><Unit key={i} position={p} index={i}/>)}
 {positions.map((p,i)=><mesh key={'p'+i} position={p}><sphereGeometry args={[.048,12,12]}/><meshBasicMaterial color="#eefbff"/></mesh>)}
 </group>
}
export default function HeroScene(){return <div className="hero-canvas" aria-label="Animated three-dimensional enterprise network topology"><Canvas camera={{position:[0,1.45,9.4],fov:45}} dpr={[1,1.7]} gl={{antialias:true,alpha:true}}>
 <ambientLight intensity={1.2}/><directionalLight position={[4,6,5]} intensity={2.8} color="#a3c8ff"/><pointLight position={[-4,0,3]} intensity={25} color="#4db6ac"/>
 <Suspense fallback={null}><Stars radius={80} depth={20} count={360} factor={1.5} fade speed={.3}/><Infrastructure/></Suspense>
 <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI*.73} minPolarAngle={Math.PI*.25}/>
 </Canvas></div>}
