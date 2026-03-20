import{BrowserRouter,Routes,Route,Navigate}from'react-router-dom';
import{getUser}from'./lib/api';
import Layout from'./components/Layout';
import Login from'./pages/Login';
import Dashboard from'./pages/Dashboard';
import Catalogo from'./pages/Catalogo';
import TipoCambio from'./pages/TipoCambio';
function P({c}){return getUser()?c:<Navigate to="/login" replace/>;}
export default function App(){return(
<BrowserRouter><Routes>
  <Route path="/login" element={<Login/>}/>
  <Route path="/*" element={<P c={<Layout><Routes>
    <Route path="/" element={<Dashboard/>}/>
    <Route path="/catalogo" element={<Catalogo/>}/>
    <Route path="/tipo-cambio" element={<TipoCambio/>}/>
  </Routes></Layout>}/>}/>
</Routes></BrowserRouter>);}
