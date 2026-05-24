import { Navigate } from "react-router-dom";

//Dashboard
import DashboardEcommerce from "../pages/DashboardEcommerce";
import DashboardNFT from "../pages/DashboardNFT";
import DashboardJob from "../pages/DashboardJob/";

// //pages
import SimplePage from '../pages/Pages/Profile/SimplePage/SimplePage';
import Settings from '../pages/Pages/Profile/Settings/Settings';

// //login
import Login from "../pages/Authentication/Login";
import ForgetPasswordPage from "../pages/Authentication/ForgetPassword";
import Logout from "../pages/Authentication/Logout";
import Register from "../pages/Authentication/Register";


// // Usuários
import UsuarioPage from "pages/Pages/Usuario/UsuarioPage";
import UsuarioForm from "pages/Pages/Usuario/UsuarioForm/UsuarioForm";

import VendasForm from "pages/Pages/Vendas/VendasForm/VendasForm";
import Vendas from "pages/Pages/Vendas/VendasPage";
import FluxoCaixa from "pages/Pages/FluxoCaixa/FluxoCaixaPage";
import MovimentoCaixa from "pages/Pages/MovimentoCaixa/MovimentoCaixaPage";

import Servicos from "pages/Pages/Servicos/ServicosPage";
import ServicosForm from "pages/Pages/Servicos/ServicosForm/ServicosForm";
import MovimentoCaixaForm from "pages/Pages/MovimentoCaixa/MovimentoCaixaForm/MovimentoCaixaForm";

import DashboardsHome from "pages/Pages/Dashboards/DashboardHome/DashboardsHome";
import FluxoCaixaView from "pages/Pages/FluxoCaixa/FluxoCaixaView/FluxoCaixaView";


import CoresPage from "../pages/Pages/Cores/CoresPage";
import CoresForm from "../pages/Pages/Cores/CoresForm/CoresForm";
import MarcasPage from "../pages/Pages/Marcas/MarcasPage";
import MarcasForm from "../pages/Pages/Marcas/MarcasForm/MarcasForm";
import LinhasMarcasPage from "../pages/Pages/LinhasMarcas/LinhasMarcasPage";
import LinhasMarcasForm from "../pages/Pages/LinhasMarcas/LinhasMarcasForm/LinhasMarcasForm";
import TipoMaterialPage from "../pages/Pages/TipoMaterial/TipoMaterialPage";
import TipoMaterialForm from "../pages/Pages/TipoMaterial/TipoMaterialForm/TipoMaterialForm";
import FilamentosPage from "../pages/Pages/Filamentos/FilamentosPage";
import FilamentosForm from "../pages/Pages/Filamentos/FilamentosForm/FilamentosForm";
import CategoriasPage from "../pages/Pages/Categorias/CategoriasPage";
import CategoriasForm from "../pages/Pages/Categorias/CategoriasForm/CategoriasForm";
import ItensPage from "../pages/Pages/Itens/ItensPage";
import ItensForm from "../pages/Pages/Itens/ItensForm/ItensForm";
import PlataformasCompraPage from "../pages/Pages/PlataformasCompra/PlataformasCompraPage";
import PlataformasCompraForm from "../pages/Pages/PlataformasCompra/PlataformasCompraForm/PlataformasCompraForm";
import ComprasPage from "../pages/Pages/Compras/ComprasPage";
import ComprasForm from "../pages/Pages/Compras/ComprasForm/ComprasForm";
import LotesPage from "../pages/Pages/Lotes/LotesPage";
import MovimentacoesEstoquePage from "../pages/Pages/MovimentacoesEstoque/MovimentacoesEstoquePage";



const authProtectedRoutes = [
  { path: "/dashboard", component: <DashboardsHome /> },
  { path: " /index", component: <DashboardsHome /> },
  { path: "/dashboard-nft", component: <DashboardNFT /> },
  { path: "/dashboard-job", component: <DashboardJob /> },

  // // Usuários
  { path: "/usuarios", component: <UsuarioPage /> },
  { path: "/usuarios/add", component: <UsuarioForm /> },
  { path: "/usuarios/edit/:idUsuario", component: <UsuarioForm /> },


  { path: "/profile", component: <SimplePage /> },
  { path: "/pages-profile-settings", component: <Settings /> },



  // Serviços
  { path: "/servicos", component: <Servicos /> },
  { path: "/servicos/add", component: <ServicosForm /> },
  { path: "/servicos/edit/:idServico", component: <ServicosForm /> },


  // // Orgão

  { path: "/vendas", component: <Vendas /> },
  { path: "/vendas/add", component: <VendasForm /> },
  { path: "/vendas/edit/:idLicitacao", component: <VendasForm /> },


  { path: "/movimento-caixa", component: <MovimentoCaixa /> },
  { path: "/movimento-caixa/add", component: <MovimentoCaixaForm /> },

  { path: "/fluxo-caixa", component: <FluxoCaixa /> },
  { path: "/fluxo-caixa/caixa/:dataInicio/:dataFim?", component: <FluxoCaixaView /> },



  // Cores
  { path: "/cores", component: <CoresPage /> },

  { path: "/cores/add", component: <CoresForm /> },
  { path: "/cores/edit/:idCor", component: <CoresForm /> },

  

  // Marcas
  { path: "/marcas", component: <MarcasPage /> },
  { path: "/marcas/add", component: <MarcasForm /> },
  { path: "/marcas/edit/:id", component: <MarcasForm /> },

  // Linhas Marcas
  { path: "/linhas-marcas", component: <LinhasMarcasPage /> },
  { path: "/linhas-marcas/add", component: <LinhasMarcasForm /> },
  { path: "/linhas-marcas/edit/:id", component: <LinhasMarcasForm /> },
  
  // Tipo Material
  { path: "/tipo-material", component: <TipoMaterialPage /> },
  { path: "/tipo-material/add", component: <TipoMaterialForm /> },
  { path: "/tipo-material/edit/:id", component: <TipoMaterialForm /> },
  
  // Filamentos
  { path: "/filamentos", component: <FilamentosPage /> },
  { path: "/filamentos/add", component: <FilamentosForm /> },
  { path: "/filamentos/edit/:id", component: <FilamentosForm /> },

  // Categorias
  { path: "/categorias-itens", component: <CategoriasPage /> },
  { path: "/categorias-itens/add", component: <CategoriasForm /> },
  { path: "/categorias-itens/edit/:id", component: <CategoriasForm /> },

  // Itens
  { path: "/itens", component: <ItensPage /> },
  { path: "/itens/add", component: <ItensForm /> },
  { path: "/itens/edit/:id", component: <ItensForm /> },

  // Plataformas de Compra
  { path: "/plataformas-compra", component: <PlataformasCompraPage /> },
  { path: "/plataformas-compra/add", component: <PlataformasCompraForm /> },
  { path: "/plataformas-compra/edit/:id", component: <PlataformasCompraForm /> },

  // Compras
  { path: "/compras", component: <ComprasPage /> },
  { path: "/compras/add", component: <ComprasForm /> },
  { path: "/compras/edit/:id", component: <ComprasForm /> },

  // Estoque
  { path: "/lotes", component: <LotesPage /> },
  { path: "/movimentacoes-estoque", component: <MovimentacoesEstoquePage /> },
  // // // ContasBancarias
  // { path: "/linha-produto", component: <LinhasProdutos /> },
  // { path: "/linha-produto/add", component: <LinhasProdutosForm /> },
  // { path: "/linha-produto/edit/:idContaBancaria", component: <LinhasProdutosForm /> },

  // // // ContasBancarias
  // { path: "/produtos", component: <Produtos /> },
  // { path: "/produtos/add", component: <ProdutosForm /> },
  // { path: "/produtos/edit/:idContaBancaria", component: <ProdutosForm /> },

  // // // ContasBancarias
  // { path: "/grade-produtos", component: <GradesProdutos /> },
  // { path: "/grade-produtos/add", component: <GradesProdutosForm /> },
  // { path: "/grade-produtos/edit/:idContaBancaria", component: <GradesProdutosForm /> },

  // // // ContasBancarias
  // { path: "/contas-bancarias", component: <ContasBancarias /> },
  // { path: "/contas-bancarias/add", component: <ContasBancariasForm /> },
  // { path: "/contas-bancarias/edit/:idContaBancaria", component: <ContasBancariasForm /> },

  // // // Despesas
  // { path: "/despesas", component: <Despesas /> },
  // { path: "/despesas/add", component: <DespesasForm /> },
  // { path: "/despesas/edit/:idDespesas", component: <DespesasForm /> },

  // // // Contas A pagar
  // { path: "contas-a-pagar", component: <ContasPagar /> },
  // { path: "contas-a-pagar/add", component: <ContasPagarForm /> },
  // { path: "contas-a-pagar/edit/:idContasPagar", component: <ContasPagarForm /> },

  // // // Contas A pagar
  // { path: "lancamentos", component: <Lancamentos /> },
  // { path: "lancamentos/add", component: <LancamentosForm /> },
  // { path: "lancamentos/edit/:idLancamentos", component: <LancamentosForm /> },

  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  // Authentication Page
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },


];


export { authProtectedRoutes, publicRoutes };