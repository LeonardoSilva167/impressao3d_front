import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Navdata = () => {
    const history = useNavigate();
    //state data
    // const [isUsers, setIsUsers] = useState<boolean>(false);


    const [isDashboard, setIsDashboard] = useState<boolean>(false);
    const [isProdutoConfig, setIsProdutoConfig] = useState<boolean>(false);
    const [isCaixa, setIsCaixa] = useState<boolean>(false);
    const [isProdutos, setIsProdutos] = useState<boolean>(false);
    const [isFilamentos, setIsFilamentos] = useState<boolean>(false);

    // Multi Level
    const [isLevel1, setIsLevel1] = useState<boolean>(false);
    const [isLevel2, setIsLevel2] = useState<boolean>(false);

    const [iscurrentState, setIscurrentState] = useState('Dashboard');

    function updateIconSidebar(e: any) {
        if (e && e.target && e.target.getAttribute("sub-items")) {
            const ul: any = document.getElementById("two-column-menu");
            const iconItems: any = ul.querySelectorAll(".nav-icon.active");
            let activeIconItems = [...iconItems];
            activeIconItems.forEach((item) => {
                item.classList.remove("active");
                var id = item.getAttribute("sub-items");
                const getID = document.getElementById(id) as HTMLElement
                if (getID)
                    getID.classList.remove("show");
            });
        }
    }

    useEffect(() => {
        document.body.classList.remove('twocolumn-panel');
        if (iscurrentState !== 'Dashboard') {
            setIsDashboard(false);
        }
        
    
        if (iscurrentState === 'Usuarios') {
            history("/usuarios");
            document.body.classList.add('twocolumn-panel');
        }
    
        if (iscurrentState === 'Clientes') {
            history("/clientes");
            document.body.classList.add('twocolumn-panel');
        }

        if (iscurrentState === 'Licitacoes') {
            history("/licitacoes");
            document.body.classList.add('twocolumn-panel');
        }

        if (iscurrentState === 'Despesas') {
            history("/contas-bancarias");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState === 'Despesas') {
            history("/despesas");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState === 'ContasApagar') {
            history("/contas-a-pagar");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState === 'ContasApagar') {
            history("/contas-a-pagar");
            document.body.classList.add('twocolumn-panel');
        }
        if (iscurrentState !== 'ProdutoConfig') {
            setIsProdutoConfig(false);
        }

        if (iscurrentState !== 'Vendas') {
            setIsCaixa(false);
        }
        if (iscurrentState !== 'Produtos') {
            setIsProdutos(false);
        }
        if (iscurrentState !== 'Filamentos') {
            setIsFilamentos(false);
        }
        // if (iscurrentState === 'Filamentos') {
        //     history("/cores"); // Redirecionar ao clicar na raiz ou apenas expandir, o comum no template é history e layout
        //     document.body.classList.add('twocolumn-panel');
        // }
    }, [
        history,
        iscurrentState,
        isDashboard,
        isProdutoConfig
    ]);

    const menuItems: any = [
        {
            label: "Menu",
            isHeader: true,
        },
        {
            id: "dashboard",
            label: "Dashboards",
            icon: "ri-dashboard-2-line",
            link: "/#",
            stateVariables: isDashboard,
            click: function (e: any) {
                e.preventDefault();
                setIsDashboard(!isDashboard);
                setIscurrentState('Dashboard');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "nft",
                    label: "NFT",
                    link: "/dashboard-nft",
                    parentId: "dashboard",
                },
                {
                    id: "job",
                    label: "Job",
                    link: "/dashboard-job",
                    parentId: "dashboard",
                    badgeColor: "success",
                    badgeName: "New",
                },
            ],
        },
        {
            id: "usuarios",
            label: "Usuários",
            icon: "ri-user-line",
            link: "/usuarios",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Usuários');
                updateIconSidebar(e);
            }
        },
        {
            id: "Clientes",
            label: "Clientes",
            icon: "ri-user-line",
            link: "/clientes",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Clientes');
                updateIconSidebar(e);
            }
        },
        {
            id: "Serviços",
            label: "Serviços",
            icon: "ri-user-line",
            link: "/servicos",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Serviços');
                updateIconSidebar(e);
            }
        },
        {
            id: "Produtos",
            label: "Orgãos participantes",
            icon: "ri-shopping-bag-line",
            link: "/orgao-participante",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Produtos');
                updateIconSidebar(e);
            }
        },
        {
            id: "Licitacoes",
            label: "Licitacoes",
            icon: "ri-user-line",
            link: "/licitacoes",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Licitacoes');
                updateIconSidebar(e);
            }
        },
        {
            id: "Vendas",
            label: "Vendas",
            icon: "ri-shopping-bag-line",
            link: "/vendas",
            click: function (e: any) {
                e.preventDefault();
                setIscurrentState('Vendas');
                updateIconSidebar(e);
            }
        },
        {
            id: "Caixa",
            label: "Caixa",
            icon: "ri-currency-fill",
            link: "/#",
            stateVariables: isCaixa,
            click: function (e: any) {
                e.preventDefault();
                setIsCaixa(!isCaixa);
                setIscurrentState('Caixa');
                updateIconSidebar(e);
            },
            subItems: [

                {
                    id: "caixa-sangria-suprimento-despesa",
                    label: "Movimentações de Caixa",
                    link: "/movimento-caixa",
                    parentId: "Caixa",
                    badgeColor: "success",
                    // badgeName: "New",
                },
                {
                    id: "caixa-fluxo-caixa",
                    label: "Fluxo de Caixa",
                    link: "/fluxo-caixa",
                    parentId: "Caixa",
                    badgeColor: "success",
                    // badgeName: "New",
                },
            ],
        },  
        {
            id: "Produtos",
            label: "Produtos",
            icon: "ri-currency-fill",
            link: "/#",
            stateVariables: isProdutos,
            click: function (e: any) {
                e.preventDefault();
                setIsProdutos(!isProdutos);
                setIscurrentState('Produtos');
                updateIconSidebar(e);
            },
            subItems: [

                {
                    id: "tipoProduto",
                    label: "Tipo de Produto",
                    link: "/tipo-produto",
                    parentId: "Produtos",
                    badgeColor: "success",
                    // badgeName: "New",
                },
                // {
                //     id: "marcas",
                //     label: "Marcas",
                //     link: "/marcas",
                //     parentId: "Produtos",
                //     badgeColor: "success",
                // },
                {
                    id: "subtipoProduto",
                    label: "Subtipo de Produto",
                    link: "/subtipo-produto",
                    parentId: "Produtos",
                    badgeColor: "success",
                    // badgeName: "New",
                },
                {
                    id: "atributosProduto",
                    label: "Atributos de Produto",
                    link: "/atributos-produto",
                    parentId: "Produtos",
                    badgeColor: "success",
                    // badgeName: "New",
                },
            ],
        },
        {
            id: "Filamentos",
            label: "Filamentos",
            icon: "ri-paint-line",
            link: "/#",
            stateVariables: isFilamentos,
            click: function (e: any) {
                e.preventDefault();
                setIsFilamentos(!isFilamentos);
                setIscurrentState('Filamentos');
                updateIconSidebar(e);
            },
            subItems: [
                {
                    id: "filamentos-lista",
                    label: "Filamentos",
                    link: "/filamentos",
                    parentId: "Filamentos",
                },
                {
                    id: "cores",
                    label: "Cores",
                    link: "/cores",
                    parentId: "Filamentos",
                },
                {
                    id: "marcas",
                    label: "Marcas",
                    link: "/marcas",
                    parentId: "Filamentos",
                    badgeColor: "success",
                },
                {
                    id: "linhas-marcas",
                    label: "Linhas",
                    link: "/linhas-marcas",
                    parentId: "Filamentos",
                },
                {
                    id: "tipo-material",
                    label: "Tipo Material",
                    link: "/tipo-material",
                    parentId: "Filamentos",
                },
            ],
        },

        // {
        //     id: "Filamentos",
        //     label: "Filamentos",
        //     icon: "ri-currency-fill",
        //     link: "/#",
        //     stateVariables: isCaixa,
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIsCaixa(!isCaixa);
        //         setIscurrentState('Caixa');
        //         updateIconSidebar(e);
        //     },
        //     subItems: [

        //         {
        //             id: "caixa-sangria-suprimento-despesa",
        //             label: "Movimentações de Caixa",
        //             link: "/movimento-caixa",
        //             parentId: "Caixa",
        //             badgeColor: "success",
        //             // badgeName: "New",
        //         },
        //         {
        //             id: "caixa-fluxo-caixa",
        //             label: "Fluxo de Caixa",
        //             link: "/fluxo-caixa",
        //             parentId: "Caixa",
        //             badgeColor: "success",
        //             // badgeName: "New",
        //         },
        //     ],
        // },  




        // {
        //     id: "ContasBancarias",
        //     label: "Contas Bancárias",
        //     icon: "ri-user-line",
        //     link: "/contas-bancarias",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIscurrentState('ContasBancarias');
        //         updateIconSidebar(e);
        //     }
        // },
        // {
        //     id: "Despesas",
        //     label: "Despesas",
        //     icon: "ri-user-line",
        //     link: "/despesas",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIscurrentState('Despesas');
        //         updateIconSidebar(e);
        //     }
        // },
        // {
        //     id: "Lancamentos",
        //     label: "Lançamentos",
        //     icon: "ri-user-line",
        //     link: "/lancamentos",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIscurrentState('Lancamentos');
        //         updateIconSidebar(e);
        //     }
        // },
        // {
        //     id: "ContasApagar",
        //     label: "Contas a Pagar",
        //     icon: "ri-user-line",
        //     link: "/contas-a-pagar",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIscurrentState('ContasApagar');
        //         updateIconSidebar(e);
        //     }
        // },

        // {
        //     id: "produtoConfig",
        //     label: "Produtos Config",
        //     icon: "ri-share-line",
        //     link: "/#",
        //     click: function (e: any) {
        //         e.preventDefault();
        //         setIsProdutoConfig(!isProdutoConfig);
        //         setIscurrentState('ProdutoConfig');
        //         updateIconSidebar(e);
        //     },
        //     stateVariables: isProdutoConfig,
        //     subItems: [
        //         { id: "linhaProduto", label: "Linhas Produtos", link: "/linha-produto", parentId: "produtoConfig" },
        //         { id: "produto", label: "Produtos", link: "/produtos", parentId: "produtoConfig" },
        //         { id: "gradeProduto", label: "Grades Produtos", link: "/grade-produtos", parentId: "produtoConfig" },
        //         {
        //             id: "level1.2",
        //             label: "Level 1.2",
        //             link: "/#",
        //             isChildItem: true,
        //             click: function (e: any) {
        //                 e.preventDefault();
        //                 setIsLevel1(!isLevel1);
        //             },
        //             stateVariables: isLevel1,
        //             childItems: [
        //                 { id: 1, label: "Level 2.1", link: "/#" },
        //                 {
        //                     id: "level2.2",
        //                     label: "Level 2.2",
        //                     link: "/#",
        //                     isChildItem: true,
        //                     click: function (e: any) {
        //                         e.preventDefault();
        //                         setIsLevel2(!isLevel2);
        //                     },
        //                     stateVariables: isLevel2,
        //                     childItems: [
        //                         { id: 1, label: "Level 3.1", link: "/#" },
        //                         { id: 2, label: "Level 3.2", link: "/#" },
        //                     ]
        //                 },
        //             ]
        //         },
        //     ],
        // },
    ];
    return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;