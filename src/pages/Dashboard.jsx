import{useState,useEffect}from'react';import{api}from'../lib/api';
export default function Dashboard(){const[rate,setRate]=useState(null);const[sup,setSup]=useState([]);const[s,setS]=useState(false);
useEffect(()=>{api.get('/api/exchange-rates/current').then(setRate).catch(()=>{});api.get('/api/suppliers').then(setSup).catch(()=>{});},[]);
async function sync(){setS(true);try{const r=await api.post('/api/exchange-rates/sync');setRate(r);}catch{}setS(false);}
return(<div><h1 style={{fontSize:22,fontWeight:600,marginBottom:20}}>Dashboard</h1>
<div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
<div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
<h2 style={{fontSize:15,fontWeight:600,margin:0}}>Tipo de cambio</h2>
<button onClick={sync} disabled={s} style={{padding:'6px 14px',background:'#f3f4f6',border:'none',borderRadius:6,fontSize:13,cursor:'pointer'}}>{s?'...':'Actualizar'}</button>
</div>
{rate?<><p style={{fontSize:40,fontWeight:700,margin:'0 0 4px'}}>${parseFloat(rate.rate_mxn_usd).toFixed(4)}<span style={{fontSize:16,fontWeight:400,color:'#888'}}> MXN/USD</span></p>
<p style={{color:'#888',fontSize:13}}>Banxico · {rate.date}</p></>:<p style={{color:'#888'}}>Sin datos</p>}
</div>
<div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
<h2 style={{fontSize:15,fontWeight:600,margin:'0 0 14px'}}>Proveedores</h2>
{sup.map(s=><div key={s.id} style={{display:'flex',justifyContent:'space-between',padding:'8px 0',borderBottom:'1px solid #f0f0f0'}}>
<span style={{fontSize:14}}>{s.name}</span>
<span style={{fontSize:12,padding:'2px 8px',borderRadius:10,background:s.active?'#d1fae5':'#fee2e2',color:s.active?'#065f46':'#991b1b'}}>{s.active?'Activo':'Inactivo'}</span>
</div>)}
</div></div></div>);}
