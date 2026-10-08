import express from 'express';
import {randomBytes,randomUUID,scryptSync,timingSafeEqual,createHash} from 'node:crypto';
import {db} from './storage.mjs';
import {initialState,areas,activities,peers,match,peerMatch} from './demo.mjs';
import {GET,POST} from './actions.mjs';
export const app=express();app.disable('x-powered-by');app.use(express.json({limit:'20kb'}));
const hashToken=t=>createHash('sha256').update(t).digest('hex');
function user(req){const token=req.headers.cookie?.match(/cw_session=([a-f0-9]+)/)?.[1];if(!token)return null;return db.prepare('SELECT user_id FROM sessions WHERE token=? AND expires>?').get(hashToken(token),Date.now())?.user_id}
function session(res,id){const token=randomBytes(32).toString('hex');db.prepare('INSERT INTO sessions VALUES(?,?,?)').run(hashToken(token),id,Date.now()+604800000);res.cookie('cw_session',token,{httpOnly:true,sameSite:'lax',secure:process.env.COOKIE_SECURE==='true',maxAge:604800000,path:'/'});}
function state(id){const row=db.prepare('SELECT data FROM demos WHERE id=?').get(id);return row?JSON.parse(row.data):initialState()}
const buckets=new Map();app.use('/api', (req,res,next)=>{if(req.method!=='GET'&&req.headers.origin&&req.headers.origin!==(process.env.FRONTEND_ORIGIN||'http://localhost:3000'))return res.status(403).json({error:'Untrusted origin'});const now=Date.now();if(buckets.size>10000)buckets.clear();let b=buckets.get(req.ip)||{count:0,time:now};if(now-b.time>60000)b={count:0,time:now};b.count++;buckets.set(req.ip,b);if(b.count>100)return res.status(429).json({error:'Too many requests. Try again in a minute.'});next()});
app.get('/health',(req,res)=>res.json({status:'ok',region:'Ibadan',payments:'simulated',ai:process.env.GEMINI_API_KEY?'model configured':'rule-based fallback'}));
app.get('/api/receipts/:id',(req,res)=>{res.set('Cache-Control','no-store');if(!/^[a-f0-9-]{36}$/.test(req.params.id))return res.status(404).json({error:'Receipt not found'});const row=db.prepare("SELECT p.value AS payment FROM demos d, json_each(d.data, '$.payments') p WHERE json_extract(p.value,'$.id')=? LIMIT 1").get(req.params.id);if(!row)return res.status(404).json({error:'Receipt not found or demo was reset'});const p=JSON.parse(row.payment);res.json({id:p.id,amount:p.amount,status:p.status,date:p.date,activityTitle:p.activityTitle||'Demo activity',kind:p.kind||'seat',periodEnd:p.periodEnd,simulation:true});});
app.get('/api/matches',(req,res)=>{const id=user(req);if(!id)return res.status(401).json({error:'Sign in first'});const s=state(id);res.set('Cache-Control','no-store');res.json({region:'Ibadan',engine:'Explainable rule-based matching',activities:[...activities,...s.customActivities].map(a=>({...a,...match(a,s.profile)})).filter(a=>a.eligible).sort((a,b)=>b.score-a.score),peers:peers.map(p=>({...p,...peerMatch(p,s.profile)})).sort((a,b)=>b.score-a.score)});});
app.all('/api/demo',async(req,res)=>{res.set('Cache-Control','no-store');try{
const b=req.body||{};let id=user(req);
if(req.method==='POST'&&b.action==='register'){
 const email=String(b.email||'').trim().toLowerCase(), password=String(b.password||'');const p=b.profile;
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>150||password.length<10||password.length>128||!b.family||String(b.family).length>80||!p||typeof p.name!=='string'||p.name.length<2||p.name.length>80||!Number.isInteger(p.age)||p.age<18||p.age>110||!areas.includes(p.area)||!['Yoruba','English','Igbo','Hausa'].includes(p.language)||!['Limited','Active'].includes(p.mobility)||!Array.isArray(p.interests)||!p.interests.length||p.interests.some(x=>!['Gardening','Arts & Crafts','Movement','Culture','Faith & Social','Skill & Purpose'].includes(x))||p.consent!==true)return res.status(400).json({error:'Enter valid account details, at least one interest, age 18–110 and consent. Password needs 10–128 characters.'});
 if(db.prepare('SELECT id FROM accounts WHERE email=?').get(email))return res.status(409).json({error:'Account already exists. Please sign in.'});
 id=randomUUID();const salt=randomBytes(16).toString('hex');const hash=scryptSync(password,salt,64).toString('hex');const s={...initialState(),registered:true,email,family:String(b.family),profile:{...p,location:'Ibadan'}};
 db.exec('BEGIN');try{db.prepare('INSERT INTO accounts VALUES(?,?,?,?)').run(id,email,hash,salt);db.prepare('INSERT INTO demos VALUES(?,?)').run(id,JSON.stringify(s));db.exec('COMMIT')}catch(e){db.exec('ROLLBACK');throw e}session(res,id);return res.status(201).json(s);
}
if(req.method==='POST'&&b.action==='login'){
 const email=String(b.email||'').trim().toLowerCase();const password=String(b.password||'');if(password.length>128)return res.status(400).json({error:'Invalid credentials'});const row=db.prepare('SELECT * FROM accounts WHERE email=?').get(email);const salt=row?.salt||'00000000000000000000000000000000';const actual=scryptSync(password,salt,64);const expected=Buffer.from(row?.hash||'00'.repeat(64),'hex');if(!timingSafeEqual(actual,expected)||!row)return res.status(401).json({error:'Incorrect email or password'});session(res,row.id);return res.json(state(row.id));
}
if(req.method==='POST'&&b.action==='logout'){const token=req.headers.cookie?.match(/cw_session=([a-f0-9]+)/)?.[1];if(token)db.prepare('DELETE FROM sessions WHERE token=?').run(hashToken(token));res.clearCookie('cw_session',{path:'/'});return res.json(initialState());}
if(!id){if(req.method==='GET')return res.json(initialState());return res.status(401).json({error:'Please register or sign in first'});}
if(req.method==='POST'&&b.action==='reset'){const old=state(id);const s={...initialState(),registered:true,email:old.email,family:old.family,profile:old.profile,subscription:old.subscription};db.prepare('UPDATE demos SET data=? WHERE id=?').run(JSON.stringify(s),id);return res.json(s);}
if(!['GET','POST'].includes(req.method))return res.status(405).json({error:'Method not allowed'});
const request=new Request('http://localhost/api/demo',{method:req.method,headers:{cookie:`cw_demo=${id}`,'Content-Type':'application/json'},...(req.method==='POST'?{body:JSON.stringify(b)}:{})});const r=await(req.method==='GET'?GET(request):POST(request));return res.status(r.status).json(await r.json());
}catch(e){console.error('ConnectWell request failed:',e.message);return res.status(500).json({error:'Unable to complete request. Please try again.'})}});
app.use((err,req,res,next)=>res.status(400).json({error:'Invalid request payload'}));
if(process.env.NODE_ENV!=='test')app.listen(Number(process.env.PORT||4000),process.env.HOST||'0.0.0.0',()=>console.log(`ConnectWell API: http://127.0.0.1:${process.env.PORT||4000}`));
