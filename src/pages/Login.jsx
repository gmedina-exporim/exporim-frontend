import{useState}from'react';import{useNavigate}from'react-router-dom';import{login}from'../lib/api';
export default function Login(){const[e,setE]=useState('');const[p,setP]=useState('');const[l,setL]=useState(false);const[err,setErr]=useState('');const nav=useNavigate();
async function sub(ev){ev.preventDefault();setL(true);setErr('');try{await login(e,p);nav('/');}catch(ex){setErr(ex.message);}setL(false);}
return(<div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f8f9fa'}}>
<div style={{background:'#fff',borderRadius:12,padding:40,width:360,boxShadow:'0 4px 20px rgba(0,0,0,0.08)'}}>
<h1 style={{fontSize:24,fontWeight:700,color:'#1a1a2e',marginBottom:6}}>Exporim</h1>
<p style={{color:'#888',marginBottom:28,fontSize:14}}>Panel de gestin comercial</p>
<form onSubmit={sub}>
<label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:5}}>Correo</label>
<input type="email" value={e} onChange={x=>setE(x.target.value)} required style={{width:'100%',padding:'10px 12px',border:'1px solid #ddd',borderRadius:8,fontSize:14,marginBottom:14,boxSizing:'border-box'}}/>
<label style={{display:'block',fontSize:13,fontWeight:500,marginBottom:5}}>Contrasea</label>
<input type="password" value={p} onChange={x=>setP(x.target.value)} required style={{width:'100%',padding:'10px 12px',border:'1px solid #ddd',borderRadius:8,fontSize:14,marginBottom:16,boxSizing:'border-box'}}/>
{err&&<div style={{background:'#fef2f2',color:'#dc2626',padding:'9px 12px',borderRadius:7,fontSize:13,marginBottom:14}}>{err}</div>}
<button type="submit" disabled={l} style={{width:'100%',padding:12,background:'#1a1a2e',color:'#fff',border:'none',borderRadius:8,fontSize:15,fontWeight:500,cursor:l?'not-allowed':'pointer',opacity:l?0.7:1}}>
{l?'Ingresando...':'Ingresar'}</button>
</form></div></div>);}
