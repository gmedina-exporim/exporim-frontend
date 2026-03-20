import{useState,useEffect}from'react';import{api}from'../lib/api';
export default function TipoCambio(){
  const[rate,setRate]=useState(null);const[syncing,setSyncing]=useState(false);const[msg,setMsg]=useState('');
  const[margen,setMargen]=useState(()=>parseFloat(localStorage.getItem('tc_margen')||'0'));
  const[editando,setEditando]=useState(false);const[tmpMargen,setTmpMargen]=useState('0');
  useEffect(()=>{api.get('/api/exchange-rates/current').then(setRate).catch(()=>{});},[]);
  const base=rate?parseFloat(rate.rate_mxn_usd):0;
  const ajustado=base?(base*(1+margen/100)).toFixed(4):null;
  async function sync(){setSyncing(true);setMsg('');
    try{const r=await api.post('/api/exchange-rates/sync');setRate(r);setMsg('Actualizado correctamente');}
    catch(e){setMsg('Error: '+e.message);}setSyncing(false);}
  function saveMargen(){const v=parseFloat(tmpMargen)||0;setMargen(v);localStorage.setItem('tc_margen',v);setEditando(false);setMsg('Margen guardado: '+v+'%');}
  return(
<div>
  <h1 style={{fontSize:22,fontWeight:600,marginBottom:20}}>Tipo de cambio</h1>
  <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
    <div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
      <p style={{fontSize:12,color:'#888',margin:'0 0 4px'}}>Tipo de cambio oficial</p>
      <p style={{fontSize:13,color:'#555',margin:'0 0 12px'}}>Banxico FIX  {rate?.date||''}</p>
      <p style={{fontSize:44,fontWeight:700,color:'#1a1a2e',margin:'0 0 4px'}}>${base?base.toFixed(4):''}</p>
      <p style={{color:'#888',fontSize:13,margin:'0 0 16px'}}>MXN por 1 USD</p>
      <button onClick={sync} disabled={syncing}
        style={{display:'flex',alignItems:'center',gap:8,padding:'8px 18px',background:'#1a1a2e',color:'#fff',border:'none',borderRadius:8,fontSize:13,cursor:syncing?'not-allowed':'pointer',opacity:syncing?.7:1}}>
        {syncing?'Sincronizando...':' Actualizar Banxico'}
      </button>
    </div>
    <div style={{background:'#fff',borderRadius:12,padding:24,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
      <p style={{fontSize:12,color:'#888',margin:'0 0 4px'}}>Tipo de cambio para cotizaciones</p>
      <p style={{fontSize:13,color:'#555',margin:'0 0 12px'}}>Base Banxico + margen comercial</p>
      <p style={{fontSize:44,fontWeight:700,color:'#059669',margin:'0 0 4px'}}>${ajustado||''}</p>
      <p style={{color:'#888',fontSize:13,margin:'0 0 16px'}}>MXN por 1 USD  Margen: <strong style={{color:'#1a1a2e'}}>{margen}%</strong></p>
      {!editando?
        <button onClick={()=>{setTmpMargen(margen.toString());setEditando(true);}}
          style={{padding:'8px 18px',background:'#f3f4f6',border:'none',borderRadius:8,fontSize:13,cursor:'pointer'}}>
           Ajustar margen
        </button>:
        <div style={{display:'flex',gap:8,alignItems:'center'}}>
          <div style={{position:'relative'}}>
            <input type="number" value={tmpMargen} onChange={e=>setTmpMargen(e.target.value)} step="0.1" min="-20" max="50"
              style={{width:90,padding:'8px 28px 8px 10px',border:'1px solid #6366f1',borderRadius:8,fontSize:14,fontWeight:600}}/>
            <span style={{position:'absolute',right:8,top:'50%',transform:'translateY(-50%)',color:'#888',fontSize:13}}>%</span>
          </div>
          <button onClick={saveMargen} style={{padding:'8px 14px',background:'#059669',color:'#fff',border:'none',borderRadius:8,fontSize:13,cursor:'pointer'}}>Guardar</button>
          <button onClick={()=>setEditando(false)} style={{padding:'8px 14px',background:'#f3f4f6',border:'none',borderRadius:8,fontSize:13,cursor:'pointer'}}>Cancelar</button>
        </div>}
    </div>
  </div>
  <div style={{background:'#fff',borderRadius:12,padding:20,boxShadow:'0 1px 4px rgba(0,0,0,0.06)'}}>
    <h3 style={{fontSize:14,fontWeight:600,margin:'0 0 12px'}}>Cmo funciona el tipo de cambio para cotizaciones?</h3>
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
      {[['Fuente oficial',`$${base?base.toFixed(4):''} MXN/USD`,'Banxico FIX  actualizacin automtica diaria'],
        ['Tu margen',`${margen}%`,`+${ajustado&&base?((parseFloat(ajustado)-base)).toFixed(4):0} MXN por dlar`],
        ['TC para cotizar',`$${ajustado||''} MXN/USD`,'Este es el tipo que vern tus clientes en las cotizaciones']
      ].map(([t,v,d])=>(
        <div key={t} style={{background:'#f8f9fa',borderRadius:8,padding:14}}>
          <p style={{fontSize:11,color:'#888',margin:'0 0 4px'}}>{t}</p>
          <p style={{fontSize:20,fontWeight:700,margin:'0 0 2px'}}>{v}</p>
          <p style={{fontSize:11,color:'#666',margin:0}}>{d}</p>
        </div>
      ))}
    </div>
  </div>
  {msg&&<div style={{marginTop:14,padding:'10px 14px',borderRadius:8,background:msg.startsWith('Error')?'#fef2f2':'#f0fdf4',color:msg.startsWith('Error')?'#dc2626':'#16a34a',fontSize:13}}>{msg}</div>}
</div>);}
