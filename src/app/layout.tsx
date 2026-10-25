import type {Metadata} from 'next';
import './globals.css';
import '@xyflow/react/dist/style.css';
import './studio-ui.css';
import './agency.css';
import './roadmap.css';
import './project-roadmap.css';
import './quality-motion.css';
const site=process.env.NEXT_PUBLIC_SITE_URL;
export const metadata:Metadata={
 title:{default:'Taha IT Solutions | Remote IT Support, Networks & Systems',template:'%s | Taha IT Solutions'},
 description:'Taha IT Solutions provides independent remote IT support, network and VPN configuration, Windows Server, Linux/VPS, monitoring and infrastructure services from Morocco.',
 keywords:['remote IT support','support informatique à distance','administration systèmes et réseaux','network configuration','Windows Server','Active Directory','Cisco','VPN','Linux VPS','Fortinet','IT services Morocco','freelance systems administrator','Taha Zitane'],
 ...(site?{metadataBase:new URL(site)}:{}),
 openGraph:{title:'Taha IT Solutions — Infrastructure & Technical Support',description:'Practical remote IT support, network and systems solutions for businesses and professionals.',type:'website',...(site?{images:[{url:'/template/taha-portrait.webp',alt:'Taha Zitane — IT Infrastructure Specialist'}]}:{})},
 twitter:{card:'summary_large_image'},
 robots:{index:process.env.STUDIO_MODE==='public',follow:process.env.STUDIO_MODE==='public'}
};
export default function RootLayout({children}:{children:React.ReactNode}){
 const structured={'@context':'https://schema.org','@graph':[{'@type':'Person',name:'Taha Zitane',jobTitle:'Network & Systems Infrastructure Specialist',sameAs:['https://github.com/tahazitan','https://www.linkedin.com/in/taha-zitane/fr'],knowsAbout:['Computer Networking','Windows Server','Linux System Administration','IT Support','VPN','Network Monitoring']},{'@type':'ProfessionalService',name:'Taha IT Solutions',description:'Independent remote technical support and infrastructure engineering services.',areaServed:['Morocco','Remote / International'],founder:{'@type':'Person',name:'Taha Zitane'},serviceType:['Remote IT Support','Network Configuration','Systems Administration','Infrastructure Monitoring']}]};
 return <html lang="en"><body>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(structured).replace(/</g,'\u003c')}}/></body></html>;
}
