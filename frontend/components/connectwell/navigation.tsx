'use client';
import {CalendarDays, Compass, Heart, LayoutDashboard, Leaf, Users, Wallet, Building2} from 'lucide-react';
const items = [
  {label:'Overview',icon:LayoutDashboard},
  {label:'Discover',icon:Compass},
  {label:'Connections',icon:Users},
  {label:'My activities',icon:CalendarDays},
  {label:'Loved-one profile',icon:Heart},
  {label:'Wellbeing reflection',icon:Leaf},
  {label:'Our story',icon:Leaf},
  {label:'Provider workspace',icon:Building2},
  {label:'Payments',icon:Wallet},
] as const;
export type WorkspaceView = (typeof items)[number]['label'];
export function WorkspaceNavigation({active,onNavigate}:{active:string;onNavigate:(view:WorkspaceView)=>void}) {
 return <nav aria-label="Workspace navigation">{items.map(({label,icon:Icon})=>
 <button key={label} type="button" aria-current={active===label?'page':undefined}
 className={active===label?'active':''} onClick={()=>onNavigate(label)}>
 <Icon size={19} aria-hidden="true"/><span>{label}</span></button>)}</nav>;
}
