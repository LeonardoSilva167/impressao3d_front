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
import ComprasViewPage from "../pages/Pages/Compras/ComprasView/ComprasView";
import LotesPage from "../pages/Pages/Lotes/LotesPage";
import MovimentacoesEstoquePage from "../pages/Pages/MovimentacoesEstoque/MovimentacoesEstoquePage";
import CarreteisFinalizadosPage from "../pages/Pages/CarreteisFinalizados/CarreteisFinalizadosPage";
import CarreteisFinalizadosForm from "../pages/Pages/CarreteisFinalizados/CarreteisFinalizadosForm/CarreteisFinalizadosForm";
import ProjetosImpressaoPage from "../pages/Pages/ProjetosImpressao/ProjetosImpressaoPage";
import ProjetosImpressaoForm from "../pages/Pages/ProjetosImpressao/ProjetosImpressaoForm/ProjetosImpressaoForm";
import ProjetosImpressaoViewPage from "../pages/Pages/ProjetosImpressao/ProjetosImpressaoView/ProjetosImpressaoView";
import ProdutosPage from "../pages/Pages/Produtos/ProdutosPage";
import ProdutosForm from "../pages/Pages/Produtos/ProdutosForm/ProdutosForm";
import ProdutosViewPage from "../pages/Pages/Produtos/ProdutosView/ProdutosView";
import CategoriasProdutosPage from "../pages/Pages/CategoriasProdutos/CategoriasProdutosPage";
import CategoriasProdutosForm from "../pages/Pages/CategoriasProdutos/CategoriasProdutosForm/CategoriasProdutosForm";
import CategoriasProdutosViewPage from "../pages/Pages/CategoriasProdutos/CategoriasProdutosView/CategoriasProdutosView";
import ModelosProdutosPage from "../pages/Pages/ModelosProdutos/ModelosProdutosPage";
import ModelosProdutosForm from "../pages/Pages/ModelosProdutos/ModelosProdutosForm/ModelosProdutosForm";
import ModelosProdutosViewPage from "../pages/Pages/ModelosProdutos/ModelosProdutosView/ModelosProdutosView";
import LinhasProdutosPage from "../pages/Pages/LinhasProdutos/LinhasProdutosPage";
import LinhasProdutosForm from "../pages/Pages/LinhasProdutos/LinhasProdutosForm/LinhasProdutosForm";
import LinhasProdutosViewPage from "../pages/Pages/LinhasProdutos/LinhasProdutosView/LinhasProdutosView";
import PartesBaseProdutosPage from "../pages/Pages/PartesBaseProdutos/PartesBaseProdutosPage";
import PartesBaseProdutosForm from "../pages/Pages/PartesBaseProdutos/PartesBaseProdutosForm/PartesBaseProdutosForm";
import PartesBaseProdutosViewPage from "../pages/Pages/PartesBaseProdutos/PartesBaseProdutosView/PartesBaseProdutosView";
import ComposicaoProdutosPage from "../pages/Pages/ComposicaoProdutos/ComposicaoProdutosPage";
import ComposicaoProdutosForm from "../pages/Pages/ComposicaoProdutos/ComposicaoProdutosForm/ComposicaoProdutosForm";
import ComposicaoProdutosViewPage from "../pages/Pages/ComposicaoProdutos/ComposicaoProdutosView/ComposicaoProdutosView";
import ComposicaoParteConfig from "../pages/Pages/ComposicaoProdutos/ComposicaoParteConfig/ComposicaoParteConfig";
import GradeProdutosPage from "../pages/Pages/GradeProdutos/GradeProdutosPage";
import GradeProdutosForm from "../pages/Pages/GradeProdutos/GradeProdutosForm/GradeProdutosForm";
import GradeProdutosViewPage from "../pages/Pages/GradeProdutos/GradeProdutosView/GradeProdutosView";
import GradeProdutoGeradoViewPage from "../pages/Pages/GradeProdutos/GradeProdutoGeradoView/GradeProdutoGeradoView";
import ConfiguracoesPage from "../pages/Pages/Configuracoes/ConfiguracoesPage";



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

  // Carretéis Finalizados
  { path: "/carreteis-finalizados", component: <CarreteisFinalizadosPage /> },
  { path: "/carreteis-finalizados/add", component: <CarreteisFinalizadosForm /> },
  { path: "/carreteis-finalizados/edit/:id", component: <CarreteisFinalizadosForm /> },

  // Projetos de Impressão
  { path: "/projetos-impressao", component: <ProjetosImpressaoPage /> },
  { path: "/projetos-impressao/add", component: <ProjetosImpressaoForm /> },
  { path: "/projetos-impressao/edit/:id", component: <ProjetosImpressaoForm /> },
  { path: "/projetos-impressao/view/:id", component: <ProjetosImpressaoViewPage /> },

  // Produtos
  { path: "/produtos", component: <ProdutosPage /> },
  { path: "/produtos/add", component: <ProdutosForm /> },
  { path: "/produtos/edit/:id", component: <ProdutosForm /> },
  { path: "/produtos/view/:id", component: <ProdutosViewPage /> },

  // Categorias de Produtos
  { path: "/categorias-produtos", component: <CategoriasProdutosPage /> },
  { path: "/categorias-produtos/add", component: <CategoriasProdutosForm /> },
  { path: "/categorias-produtos/edit/:id", component: <CategoriasProdutosForm /> },
  { path: "/categorias-produtos/view/:id", component: <CategoriasProdutosViewPage /> },

  // Modelos de Produtos
  { path: "/modelos-produtos", component: <ModelosProdutosPage /> },
  { path: "/modelos-produtos/add", component: <ModelosProdutosForm /> },
  { path: "/modelos-produtos/edit/:id", component: <ModelosProdutosForm /> },
  { path: "/modelos-produtos/view/:id", component: <ModelosProdutosViewPage /> },

  // Linhas de Produtos
  { path: "/linhas-produtos", component: <LinhasProdutosPage /> },
  { path: "/linhas-produtos/add", component: <LinhasProdutosForm /> },
  { path: "/linhas-produtos/edit/:id", component: <LinhasProdutosForm /> },
  { path: "/linhas-produtos/view/:id", component: <LinhasProdutosViewPage /> },

  // Partes Base de Produtos
  { path: "/partes-base-produtos", component: <PartesBaseProdutosPage /> },
  { path: "/partes-base-produtos/add", component: <PartesBaseProdutosForm /> },
  { path: "/partes-base-produtos/edit/:id", component: <PartesBaseProdutosForm /> },
  { path: "/partes-base-produtos/view/:id", component: <PartesBaseProdutosViewPage /> },

  // Composição do Produto
  { path: "/composicao-produtos", component: <ComposicaoProdutosPage /> },
  { path: "/composicao-produtos/add", component: <ComposicaoProdutosForm /> },
  { path: "/composicao-produtos/edit/:id", component: <ComposicaoProdutosForm /> },
  { path: "/composicao-produtos/view/:id", component: <ComposicaoProdutosViewPage /> },
  { path: "/composicao-produtos/:id/parte/:idParte/configurar", component: <ComposicaoParteConfig /> },

  // Grade de Produtos
  { path: "/grade-produtos", component: <GradeProdutosPage /> },
  { path: "/grade-produtos/add", component: <GradeProdutosForm /> },
  { path: "/grade-produtos/edit/:id", component: <GradeProdutosForm /> },
  { path: "/grade-produtos/view/:id", component: <GradeProdutosViewPage /> },
  { path: "/grade-produtos/produto/:id", component: <GradeProdutoGeradoViewPage /> },

  // Configurações
  { path: "/configuracoes", component: <ConfiguracoesPage /> },

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
  { path: "/compras/view/:id", component: <ComprasViewPage /> },

  // Estoque
  { path: "/lotes", component: <LotesPage /> },
  { path: "/movimentacoes-estoque", component: <MovimentacoesEstoquePage /> },

  {
    path: "/",
    exact: true,
    component: <Navigate to="/dashboard" />,
  },
  { path: "*", component: <Navigate to="/dashboard" /> },
];

const publicRoutes = [
  { path: "/logout", component: <Logout /> },
  { path: "/login", component: <Login /> },
  { path: "/forgot-password", component: <ForgetPasswordPage /> },
  { path: "/register", component: <Register /> },
];

export { authProtectedRoutes, publicRoutes };