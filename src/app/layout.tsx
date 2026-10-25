import type {Metadata} from 'next';
import './globals.css';
import '@xyflow/react/dist/style.css';
import './studio-ui.css';
import './home-motion.css';
export const metadata:Metadata={
title:{default:'Taha Infrastructure Studio — Design. Deploy. Defend.',template:'%s | Taha Infrastructure Studio'},
description:'An infrastructure engineering studio by Taha Zitane. Network operations, systems engineering, cybersecurity and reproducible labs.',
openGraph:{title:'Taha Infrastructure Studio',description:'Design. Deploy. Defend. — Infrastructure Engineering · Network Operations · Cybersecurity',type:'website'},
robots:{index:process.env.STUDIO_MODE==='public',follow:process.env.STUDIO_MODE==='public'}
};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
