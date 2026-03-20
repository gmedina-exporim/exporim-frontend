import{useState,useRef}from'react';import{api}from'../lib/api';
const DEPTO={A:'Alta rotacin',B:'Media rotacin',C:'Baja rotacin','POR SALIR':'Por salir',SPCD:'En CD',SPF:'Bajo pedido'};
const dColor={A:'#d1fae5',B:'#dbeafe',C:'#fef3c7','POR SALIR':'#fee2e2',SPCD:'#ede9fe',SPF:'#f3f4f6'};
const dText={A:'#065f46',B:'#1d4ed8',C:'#92400e','POR SALIR':'#991b1b',SPCD:'#5b21b6',SPF:'#374151'};
export default function Catalogo(){
  const[q,setQ]=useState('');const[marca,setMarca]=useState('');const[results,setResults]=useState(null);
  const[loading,setLoading]=useState(false);const[err,setErr]=useState('');const[sel,setSel]=useState(null);
  const timer=useRef(null);
  async function search(qv,mv){
    if(!qv&&!mv)return;
    setLoading(true);setErr('');
    try{
      const p=new URLSearchParams();
      if(qv)p.set('q',qv);if(mv)p.set('marca',mv);
      p.set('tipo','1');p.set('depto','1');p.set('promos','1');
      const d=await api.get('/api/cva/search?'+p.toString());
      setResults(d);
    }catch(e){setErr(e.message);}
    setLoading(false);
  }
  function onQ(v){setQ(v);clearTimeout(timer.current);if(v.length>=3)timer.current=setTimeout(()=>search(v,marca),800);}
  function onM(v){setMarca(v);clearTimeout(timer.current);if(v.length>=2)timer.current=setTimeout(()=>search(q,v),800);}
  const prods=results?.productos||[];
  return(
<div>
<div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
  <div><h1 style={{fontSize:22,fontWeight:600,margin:0}}>Catlogo CVA</h1>
  <p style={{fontSize:13,color:'#888',margin:'2px 0 0'}}>Consulta en tiempo real  {results?`${results.total} resultados${results.total>100?', mostrando 100':''}`:''}</p></div>
</div>
<div style={{background:'#fff',borderRadius:12,padding:16,marginBottom:16,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',display:'flex',gap:10,flexWrap:'wrap',alignItems:'center'}}>
  <input value={q} onChange={e=>onQ(e.target.value)} placeholder=" Descripcin (ej: LAPTOP, IMPRESORA...)"
    style={{flex:2,minWidth:200,padding:'9px 12px',border:'1px solid #e0e0e0',borderRadius:8,fontSize:14}}/>
  <input value={marca} onChange={e=>onM(e.target.value)} placeholder="Marca (ej: HP, DELL, EPSON)"
    style={{flex:1,minWidth:130,padding:'9px 12px',border:'1px solid #e0e0e0',borderRadius:8,fontSize:14}}/>
  <button onClick={()=>search(q,marca)} disabled={loading||(!q&&!marca)}
    style={{padding:'9px 20px',background:'#1a1a2e',color:'#fff',border:'none',borderRadius:8,fontSize:14,cursor:'pointer',whiteSpace:'nowrap'}}>
    {loading?'Buscando...':'Buscar'}</button>
</div>
{err&&<div style={{background:'#fef2f2',color:'#dc2626',padding:'10px 14px',borderRadius:8,fontSize:13,marginBottom:12}}>{err}</div>}
{results&&<div style={{background:'#fff',borderRadius:12,boxShadow:'0 1px 4px rgba(0,0,0,0.06)',overflow:'hidden'}}>
  {prods.length===0?<div style={{padding:40,textAlign:'center',color:'#888'}}>Sin resultados</div>:
  <div style={{overflowX:'auto'}}>
  <table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}>
    <thead><tr style={{background:'#f8f9fa'}}>
      {['CVE','Cdigo','Descripcin','Marca','Precio','Exist.','Depto',''].map(h=>(
        <th key={h} style={{padding:'10px 12px',textAlign:'left',fontSize:11,fontWeight:600,color:'#666',textTransform:'uppercase',whiteSpace:'nowrap'}}>{h}</th>
      ))}
    </tr></thead>
    <tbody>{prods.map((p,i)=>(
      <tr key={i} style={{borderTop:'1px solid #f0f0f0',background:sel===i?'#f0f4ff':i%2===0?'#fff':'#fafafa',cursor:'pointer'}}
        onClick={()=>setSel(sel===i?null:i)}>
        <td style={{padding:'8px 12px',fontFamily:'monospace',fontSize:11,color:'#888'}}>{p.clave}</td>
        <td style={{padding:'8px 12px',fontFamily:'monospace',fontSize:11}}>{p.codigo}</td>
        <td style={{padding:'8px 12px',maxWidth:300,fontWeight:500}}>{p.descripcion}
          {p.promos&&<span style={{marginLeft:6,background:'#fef3c7',color:'#92400e',fontSize:10,padding:'1px 5px',borderRadius:3}}>PROMO</span>}
        </td>
        <td style={{padding:'8px 12px',color:'#555'}}>{p.marca}</td>
        <td style={{padding:'8px 12px',fontWeight:600,color:p.moneda==='USD'?'#1d4ed8':'#065f46',whiteSpace:'nowrap'}}>
          {p.moneda==='USD'?'$':'$'}{p.precio?.toLocaleString('es-MX',{minimumFractionDigits:2})} {p.moneda}
        </td>
        <td style={{padding:'8px 12px',textAlign:'center',fontWeight:600,color:p.existencia>0?'#065f46':'#dc2626'}}>{p.existencia}</td>
        <td style={{padding:'8px 12px'}}>
          {p.depto&&<span style={{padding:'2px 6px',borderRadius:4,fontSize:11,background:dColor[p.depto]||'#f3f4f6',color:dText[p.depto]||'#374151'}}>{p.depto}</span>}
        </td>
        <td style={{padding:'8px 12px'}}>
          <span style={{padding:'3px 8px',borderRadius:5,background:'#ede9fe',color:'#5b21b6',fontSize:11,cursor:'pointer'}}>Ver</span>
        </td>
      </tr>
    ))}</tbody>
  </table>
  </div>}
</div>}
{sel!==null&&prods[sel]&&<div style={{position:'fixed',top:0,right:0,bottom:0,width:360,background:'#fff',boxShadow:'-4px 0 20px rgba(0,0,0,0.12)',padding:20,overflowY:'auto',zIndex:200}}>
  <div style={{display:'flex',justifyContent:'space-between',marginBottom:16}}>
    <h3 style={{fontSize:15,fontWeight:600,margin:0}}>Detalle del producto</h3>
    <button onClick={()=>setSel(null)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'#888'}}></button>
  </div>
  {[['Clave CVA',prods[sel].clave],['Cdigo fabricante',prods[sel].codigo],['Descripcin',prods[sel].descripcion],
    ['Marca',prods[sel].marca],['Grupo',prods[sel].grupo],['Subgrupo',prods[sel].subgrupo],
    ['Precio',`${prods[sel].precio?.toLocaleString('es-MX',{minimumFractionDigits:2})} ${prods[sel].moneda}`],
    ['Existencia',prods[sel].existencia],['Clasificacin',prods[sel].depto],['Tipo',prods[sel].tipo_producto]
  ].map(([l,v])=>v&&<div key={l} style={{marginBottom:10}}>
    <div style={{fontSize:11,color:'#888',marginBottom:2}}>{l}</div>
    <div style={{fontSize:13,fontWeight:500}}>{v}</div>
  </div>)}
  {prods[sel].promos&&<div style={{background:'#fef3c7',borderRadius:8,padding:12,marginTop:12}}>
    <div style={{fontSize:12,fontWeight:600,color:'#92400e',marginBottom:4}}> PROMOCIN ACTIVA</div>
    <div style={{fontSize:12}}>{JSON.stringify(prods[sel].promos)}</div>
  </div>}
</div>}
</div>);}
