import{useState}from'react';import{Link,useLocation,useNavigate}from'react-router-dom';import{logout,getUser}from'../lib/api';
const nav=[{to:'/',label:'Dashboard'},{to:'/catalogo',label:'Catalogos'},{to:'/cotizaciones',label:'Cotizaciones'},{to:'/clientes',label:'Clientes'},{to:'/tipo-cambio',label:'Tipo de cambio'}];
export default function Layout({children}){const[open,setOpen]=useState(false);const loc=useLocation();const nav2=useNavigate();const user=getUser();
return(<div style={{display:'flex',minHeight:'100vh'}}>
<aside style={{width:open?200:52,transition:'width 0.2s',background:'#1a1a2e',color:'#fff',display:'flex',flexDirection:'column',position:'fixed',height:'100vh',zIndex:100,overflow:'hidden'}}>
<div style={{padding:'14px 10px',borderBottom:'1px solid rgba(255,255,255,0.1)',display:'flex',alignItems:'center',gap:8}}>
{open&&<span style={{fontWeight:600,fontSize:14,whiteSpace:'nowrap'}}>Exporim</span>}
</div>
<nav style={{flex:1,padding:'10px 6px',display:'flex',flexDirection:'column',gap:3}}>
{nav.map(({to,label})=>{const a=loc.pathname===to;return(<Link key={to} to={to} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',borderRadius:7,color:a?'#fff':'rgba(255,255,255,0.6)',background:a?'rgba(255,255,255,0.15)':'transparent',whiteSpace:'nowrap',fontSize:13,overflow:'hidden'}}><span style={{flexShrink:0,fontSize:16}}>{to==='/'?'':to==='/catalogo'?'':to==='/cotizaciones'?'':to==='/clientes'?'':''}</span>{open&&label}</Link>);})}
</nav>
<div style={{padding:'10px 6px',borderTop:'1px solid rgba(255,255,255,0.1)'}}>
{open&&<div style={{fontSize:11,color:'rgba(255,255,255,0.4)',padding:'0 10px 6px',overflow:'hidden',textOverflow:'ellipsis'}}>{user?.email}</div>}
<button onClick={()=>{logout();nav2('/login');}} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 10px',width:'100%',background:'none',border:'none',color:'rgba(255,255,255,0.6)',cursor:'pointer',borderRadius:7,fontSize:13}}>
<span style={{fontSize:16,flexShrink:0}}></span>{open&&'Salir'}
</button>
</div>
</aside>
<main style={{flex:1,marginLeft:open?200:52,transition:'margin-left 0.2s',padding:24,minHeight:'100vh'}}>{children}</main>
</div>);}
