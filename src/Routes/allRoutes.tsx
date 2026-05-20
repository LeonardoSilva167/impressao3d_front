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
import Clientes from "pages/Pages/Clientes/ClientesPage";
import VendasForm from "pages/Pages/Vendas/VendasForm/VendasForm";
import Vendas from "pages/Pages/Vendas/VendasPage";
import FluxoCaixa from "pages/Pages/FluxoCaixa/FluxoCaixaPage";
import MovimentoCaixa from "pages/Pages/MovimentoCaixa/MovimentoCaixaPage";

import Servicos from "pages/Pages/Servicos/ServicosPage";
import ServicosForm from "pages/Pages/Servicos/ServicosForm/ServicosForm";
import MovimentoCaixaForm from "pages/Pages/MovimentoCaixa/MovimentoCaixaForm/MovimentoCaixaForm";
import ClientesForm from "../pages/Pages/Clientes/ClientesForm/ClientesForm";
import DashboardsHome from "pages/Pages/Dashboards/DashboardHome/DashboardsHome";
import FluxoCaixaView from "pages/Pages/FluxoCaixa/FluxoCaixaView/FluxoCaixaView";
import Licitacoes from "pages/Pages/Licitacoes/LicitacoesPage";
import LicitacoesForm from "pages/Pages/Licitacoes/LicitacoesForm/LicitacoesForm";
import Orgao from "pages/Pages/Orgao/OrgaoPage";
import OrgaoForm from "pages/Pages/Orgao/OrgaoForm/OrgaoForm";
import LicitacoesGetLicitacao from "pages/Pages/Licitacoes/LicitacoesForm/LicitacoesGetLicitacao";
import TipoProduto from "pages/Pages/TipoProduto/TipoProdutoPage";
import TipoProdutoForm from "pages/Pages/TipoProduto/TipoProdutoForm/TipoProdutoForm";
import SubtipoProduto from "pages/Pages/SubtipoProduto/SubtipoProdutoPage";
import SubtipoProdutoForm from "pages/Pages/SubtipoProduto/SubtipoProdutoForm/SubtipoProdutoForm";




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

  // // Clientes
  { path: "/clientes", component: <Clientes /> },
  { path: "/clientes/add", component: <ClientesForm /> },
  { path: "/clientes/edit/:idCliente", component: <ClientesForm /> },

  { path: "/orgao-participante", component: <Orgao /> },
  { path: "/orgao-participante/add", component: <OrgaoForm /> },
  { path: "/orgao-participante/edit/:idOrgao", component: <OrgaoForm /> },

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


  // // Licitacoes
  // { path: "/analise-edital-itens", component: <AnaliseEdital /> },
  // { path: "/analise-edital-itens/add", component: <AnaliseEditalForm /> },
  { path: "/licitacoes", component: <Licitacoes /> },
  { path: "/licitacoes/add", component: <LicitacoesGetLicitacao /> },
  { path: "/licitacoes/edit/:idLicitacao", component: <LicitacoesForm /> },

  // Produtos
  { path: "/tipo-produto", component: <TipoProduto /> },
  { path: "/tipo-produto/add", component: <TipoProdutoForm /> },
  { path: "/tipo-produto/edit/:idTipoProduto", component: <TipoProdutoForm /> },
  
  { path: "/subtipo-produto", component: <SubtipoProduto /> },
  { path: "/subtipo-produto/add", component: <SubtipoProdutoForm /> },
  { path: "/subtipo-produto/edit/:idSubtipoProduto", component: <SubtipoProdutoForm /> },

  
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