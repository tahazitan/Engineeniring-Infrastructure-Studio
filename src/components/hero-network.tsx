/** Illustrative infrastructure link map. Animation represents packet paths, not live network telemetry. */
export default function HeroNetwork(){
 return <div className="hero-network" aria-label="Animated illustrative four-node network topology">
  <div className="hero-network-title"><span className="hero-network-led"/> INFRASTRUCTURE MAP <span>TOPOLOGY / 01</span></div>
  <svg viewBox="0 0 314 134" role="img" aria-label="Firewall connected to core switch, Linux server and monitoring">
   <defs><marker id="network-arrow" markerWidth="7" markerHeight="7" refX="3.5" refY="3.5" orient="auto"><path d="M1 1 L6 3.5 L1 6" fill="none" stroke="#53c9f0" strokeWidth="1"/></marker></defs>
   <path className="hero-wire" d="M65 35 L156 35 L156 94 L254 94"/>
   <path className="hero-wire" d="M156 35 L254 35 L254 94"/>
   <path className="hero-packet-line" d="M65 35 L156 35 L156 94 L254 94"/>
   <path className="hero-packet-line secondary" d="M156 35 L254 35 L254 94"/>
   <g className="hero-net-node"><rect x="6" y="14" width="74" height="43" rx="3"/><text x="15" y="30">FIREWALL</text><text className="hero-net-value" x="15" y="44">FW-01</text><circle cx="69" cy="22" r="3"/></g>
   <g className="hero-net-node"><rect x="119" y="14" width="74" height="43" rx="3"/><text x="128" y="30">CORE SW</text><text className="hero-net-value" x="128" y="44">SW-01</text><circle cx="182" cy="22" r="3"/></g>
   <g className="hero-net-node"><rect x="217" y="14" width="91" height="43" rx="3"/><text x="226" y="30">LINUX / AD</text><text className="hero-net-value" x="226" y="44">SRV-01</text><circle cx="297" cy="22" r="3"/></g>
   <g className="hero-net-node"><rect x="210" y="74" width="98" height="43" rx="3"/><text x="220" y="90">MONITORING</text><text className="hero-net-value" x="220" y="104">ZABBIX / SIEM</text><circle cx="298" cy="82" r="3"/></g>
   <text className="hero-net-footnote" x="9" y="127">ARCHITECTURE VIEW • CONCEPTUAL</text>
  </svg>
 </div>;
}
