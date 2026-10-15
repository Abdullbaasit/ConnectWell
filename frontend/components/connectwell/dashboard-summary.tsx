import {CalendarDays, Heart, Sparkles, Users} from 'lucide-react';
export function DashboardSummary({bookings,connections,attended,latestMood}:{bookings:number;connections:number;attended:number;latestMood:string}) {
 const stats=[
 {icon:CalendarDays,value:bookings,label:'Upcoming & confirmed activities',description:'Something to look forward to'},
 {icon:Users,value:connections,label:'Peer connections',description:'Growing their circle'},
 {icon:Heart,value:attended,label:'Activities attended',description:'Every moment counts'},
 {icon:Sparkles,value:latestMood,label:'Latest wellbeing check-in',description:'Self-reported, not a health score'},
 ];
 return <section className="stats" aria-label="Community overview">{stats.map(({icon:Icon,value,label,description})=>
 <div className="stat" key={label}><span className="staticon"><Icon size={20} aria-hidden="true"/></span>
 <div><strong>{value}</strong><b>{label}</b><small>{description}</small></div></div>)}</section>;
}
