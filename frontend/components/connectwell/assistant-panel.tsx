'use client';
import {FormEvent,useState} from 'react';
import {Send,X} from 'lucide-react';
export type AssistantMessage={text:string;role:'user'|'assistant';mode?:string};
export function AssistantPanel({open,onClose,messages,onSend,busy=false}:{open:boolean;onClose:()=>void;messages:AssistantMessage[];onSend:(text:string)=>Promise<void>|void;busy?:boolean}) {
 const [draft,setDraft]=useState('');
 if(!open)return null;
 async function submit(e:FormEvent){e.preventDefault();const text=draft.trim();if(!text||busy)return;setDraft('');await onSend(text)}
 return <section className="chatpanel" aria-label="ConnectWell assistant">
 <div className="chathead"><div><b>ConnectWell assistant</b><small>Demo concierge · AI only when configured</small></div>
 <button type="button" aria-label="Close assistant" onClick={onClose}><X size={18}/></button></div>
 <div className="messages" role="log" aria-live="polite" aria-relevant="additions text">
 {messages.map((m,i)=><div key={i} className={m.role==='user'?'message user':'message'}><p>{m.text}</p>{m.mode&&<small>{m.mode}</small>}</div>)}</div>
 <form onSubmit={submit}><label htmlFor="cw-assistant-message" className="sr-only">Ask the assistant</label>
 <input id="cw-assistant-message" value={draft} onChange={e=>setDraft(e.target.value)} maxLength={500} placeholder="Ask about activities or connections"/>
 <button type="submit" disabled={busy||!draft.trim()} aria-label="Send message"><Send size={18}/></button></form>
 </section>;
}
