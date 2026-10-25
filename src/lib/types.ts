export type NodeRecord={id:string;position:{x:number;y:number};data:{label:string;kind?:string;platform?:string;ip?:string;zone?:string;vlan?:string;role?:string};type?:string};
export type EdgeRecord={id:string;source:string;target:string;animated?:boolean;sourcePort?:string;targetPort?:string;linkRole?:string};
export type Project={
  slug:string;title:string;domain:string;summary:string;stack:string[];objectives:string[];
  checklist:{id:string;title:string;done:boolean}[];
  test_plan:{id:string;title:string;expected:string;status:'pending'|'passed'|'failed';notes?:string}[];
  topology:{nodes:NodeRecord[];edges:EdgeRecord[]};
  configuration:string;status:'planned'|'in_progress'|'verified';public_visible:boolean;
};
