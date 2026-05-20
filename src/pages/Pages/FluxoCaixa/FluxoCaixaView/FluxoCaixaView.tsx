import UiContent from "Components/Common/UiContent";
import { borderColorCategory, formatarParaMoedaSemSimbolo, formatDateSQLForBR, FormatToDayFormateDate, useNavegacao } from 'helpers/functions_helpers';
import { FluxoCaixaList } from "interfaces/FluxoCaixa";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, ButtonGroup, Card, CardBody, Col, Container, DropdownToggle, Label, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane, UncontrolledDropdown } from "reactstrap";
import { FluxoCaixaService } from "services/FluxoCaixa";
import classnames from "classnames";
import DashDunut from "Components/Common/Dashboards/DashDunut";
import DynamicDashboard from "pages/Pages/Dashboards/Dashboards/DynamicDashboard";
import DynamicLegendDashboard from "pages/Pages/Dashboards/Dashboards/DynamicLegendDashboard";

export const FluxoCaixaView = () => {

    // const { dataFluxoInicio } = useParams()
    const { dataInicio, dataFim } = useParams<{ dataInicio: string; dataFim?: string }>();
    const dataFluxoInicio = dataInicio
    const dataFluxoFim = dataFim
    const dataFimUsada = dataFim ? dataInicio :  '';

    const [data, setData] = useState<FluxoCaixaList>({} as FluxoCaixaList)

    const [operacaoEntrada, setOperacaoEntrada] = useState<any[]>([
        { title: "Suprimentos", tipo: 4 },
        { title: "Vendas", tipo: 1  },
        { title: "Totais", tipo: 99  }
    ]);
    const [operacaoSaida, setOperacaoSaida] = useState<any[]>([
        { title: "Sangrias", tipo: 5  },
        { title: "Despesas", tipo: 3  },
        { title: "Totais", tipo: 98  }
    ]);

    
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const fluxoCaixaService = new FluxoCaixaService();
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [dataMovimento, setDataMovimento] = useState<string>(FormatToDayFormateDate())
    
    const [totalSuprimento, setTotalSuprimento] = useState<number | null>(0);
    const [topBorderTab, settopBorderTab] = useState<string>("1");

    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };
    const topBordertoggle = (tab : any) => {
        if (topBorderTab !== tab) {
            settopBorderTab(tab);
        }
    };


      
    const getFluxoCaixaDia = async (dataFluxoInicio: string, dataFluxoFim: string) => {
        const listServicos = await fluxoCaixaService.getViewFluxoCaixa({data_inicio: dataFluxoInicio, data_fim: dataFluxoFim});
        setData(listServicos)


    }


    const calculaTotais = (operacao: string): number => {
        let total = 0;
        let venda = 0;
        let despesa = 0;
        let suprimento = 0;
        let sangria = 0;

        if(data.totalizadores){
            venda = data.totalizadores[1]["total"];
            despesa = data.totalizadores[3]["total"];
            suprimento = data.totalizadores[4]["total"];
            sangria = data.totalizadores[5]["total"];
        }

        
        switch (operacao) {
            case "VENDA":
                total = venda;
                break;
            case "DESPESA":
                total =despesa;
                break;
            case "SUPRIMENTO":
                total = suprimento;
                break;
            case "SANGRIA":
                total = sangria;
                break;
            case "SALDO":
                total = (suprimento + venda) - (despesa + sangria);
                break;
            case "LUCRO":
                total = (venda - despesa);
                break;
            case "MARGEM":
                total = venda? ((venda - despesa) / venda) * 100 : 0;
                total = formatarParaMoedaSemSimbolo((total).toFixed(2));
                break;
                
            default:
                break;
        }

        return total;
    
    };

    const handleRemoteDelete = async (id: number) => {
        try {
            const response = await fluxoCaixaService.deleteFluxoCaixa(id);
            if (data) {
                await handleThisRoute(data.first_page_url)
            }

            toggleModal();
        } catch (error) {
            console.error('Failed to delete', error);
        }
    };
    

    const handleThisRoute = async (url: string) => {
        try {
            const new_url = new URL(url);
            await getData({
                id: new_url.searchParams.get('id'),
                cliente_id: new_url.searchParams.get('FluxoCaixa_id'),
                codigo: new_url.searchParams.get('codigo'),
                nome: new_url.searchParams.get('nome'),
                page: Number(new_url.searchParams.get('page')),
                palavra_chave: new_url.searchParams.get('palavra_chave')
            })
        } catch (error) {

        }
    }

    // Botão Voltar
    const { voltarParaRotaAnterior } = useNavegacao();
    const gotoPage = async (item: any) => {

    };

    useEffect(() => {
        if(dataFluxoInicio){
            getFluxoCaixaDia(dataFluxoInicio, dataFluxoFim);
        }
    }, [dataFluxoInicio])
    
    return (
        
        <React.Fragment>
            <UiContent />
            <div className="page-content">
                <Container fluid>
                    {/* <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Link to="/fluxo-caixa" className="me-2">
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-0">Fluxo de Caixa</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/fluxo-caixa"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Fluxo de Caixa </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Link to="/fluxo-caixa" className="me-2">
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-sm-0 ms-3"> Fluxo de Caixa</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Contas Bancarias" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/fluxo-caixa"> Fluxo de Caixa </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Fluxo de Caixa </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    {/* Filter */}
                    <Row>
                        <Col xl={12}>
                            <Card>
                                <CardBody>
                                    <div >
                                        <Row className="">
                                            <Col xl={12}  className="mb-3 mt-3">
                                                <h4 className="text-center mb-3">
                                                    <span className="d-block d-md-inline">Movimentações do Dia</span>
                                                    <span className="d-block d-md-inline ms-3">{`${formatDateSQLForBR(dataFluxoInicio)}  ${dataFluxoFim ? 'à '+formatDateSQLForBR(dataFluxoFim) : ''}`}</span>
                                                    
                                                    
                                                </h4>
                                            </Col>
                                            {/* <Nav tabs className="nav nav-tabs nav-justified nav-border-top nav-border-top-primary mb-3"> */}
                                            <Nav pills className="nav-justified nav-success  mb-3">
                                                <NavItem>
                                                    <NavLink
                                                        style={{ cursor: "pointer" }}
                                                        className={`${classnames({ active: topBorderTab === "1" })} fs-4`}
                                                        onClick={() => topBordertoggle("1")}
                                                    >
                                                        <span className="d-block d-md-inline"><i className="ri-arrow-up-down-line align-middle me-1"></i></span>
                                                        <span className="d-block d-md-inline">Movimentações</span>
                                                    </NavLink>
                                                    </NavItem>

                                                    <NavItem>
                                                    <NavLink
                                                        style={{ cursor: "pointer" }}
                                                        className={`${classnames({ active: topBorderTab === "2" })} fs-4`}
                                                        onClick={() => topBordertoggle("2")}
                                                    >
                                                        <span className="d-block d-md-inline"><i className="ri-currency-fill me-1 align-middle"></i></span>
                                                        <span className="d-block d-md-inline">Caixa</span>
                                                    </NavLink>
                                                </NavItem>

                                            </Nav>
                                        </Row>
                                        <Row>
                                        <TabContent activeTab={topBorderTab} className="text-muted">
                                            <TabPane tabId="1" id="nav-border-justified-home">
                                                {(data && data.data && data.data.length > 0) &&
                                                    <Row>
                                                        <Col md={2}></Col>
                                                        <Col md={4}>
                                                            <DynamicDashboard
                                                                type="usersByDeviceCharts"
                                                                series={[calculaTotais("SUPRIMENTO"), calculaTotais("VENDA"), calculaTotais("DESPESA"), calculaTotais("SANGRIA")]}
                                                                dataLabelText={["Suprimento", "Venda", "Despesa", "Sangria"]}
                                                                dataColors='["info", "success", "warning", "danger"]'
                                                                />
                                                        </Col>
                                                        <Col md={2}>
                                                            <DynamicLegendDashboard
                                                                type="usersByDeviceCharts"
                                                                series={[calculaTotais("SUPRIMENTO"), calculaTotais("VENDA"), calculaTotais("DESPESA"), calculaTotais("SANGRIA")]}
                                                                dataLabelText={["Suprimento", "Venda", "Despesa", "Sangria"]}
                                                                dataColors={["info", "success", "warning", "danger"]}
                                                                option={{legenda: true, total: true, percentual: false}}
                                                                />
                                                        </Col>
                                                        <Col md={3}></Col>
                                                    </Row>
                                                }
                                                <Col xl={12}>                                   
                                                    <div className="table-responsive mt-3">
                                                        <table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                                            <thead className="table-light">
                                                                <tr>                                                                	
                                                                    <th scope="col">Operação</th>
                                                                    <th scope="col">Valor (R$)</th>
                                                                    <th scope="col">Forma de Pagamento</th>
                                                                    <th scope="col">Tipo</th>
                                                                    <th scope="col" className="text-start">Cliente</th>
                                                                    <th scope="col">Descrição</th>
                                                                    <th scope="col">Venda ID</th>                                                                    
                                                                    <th scope="col">Data Hora</th>
                                                                    <th scope="col" style={{ width: "150px" }}>Ação</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {(data && data.data && data.data.length > 0) ?
                                                                Object.entries(data.data).map(([key, row]: [string, any], index: number) => (
                                                                    <tr key={index}>
                                                                    <td style={{ padding: 0, textAlign: "left" }}>
                                                                            <div
                                                                                style={{
                                                                                ...borderColorCategory(row.id_tipo_origem_pagamento),
                                                                                display: "inline-block",
                                                                                textAlign: "left"
                                                                                }}

                                                                             
                                                                            >

                                                                            {row.nome_tipo_origem_pagamento}
                                                                            {/* {(row.tipo !== null) ? 
                                                                                row.nome_tipo_origem_pagamento
                                                                                :
                                                                                // <span className={`badge bg-${(row.id_tipo_origem_pagamento == '7')? 'secondary2' : 'danger'}`}>{row.nome_tipo_origem_pagamento}</span> 
                                                                                
                                                                                row.id_tipo_origem_pagamento == '7' ?
                                                                                <span className={`badge `} style={{backgroundColor: '#343a40'}}>{row.nome_tipo_origem_pagamento}</span> 
                                                                                :
                                                                                <span className={`badge `} style={{backgroundColor: '#adb5bd'}}>{row.nome_tipo_origem_pagamento}</span> 
                                                                            } */}
                                                                            </div>
                                                                        </td>
                                                                        <td className="text-end"> {(row.tipo !== null) ? formatarParaMoedaSemSimbolo(row.valor) : '-'}</td>                                                                                                                                                     
                                                                        <td className="">{row.nome_forma_pagamento}</td>
                                                                        <td>{(row.tipo !== null) ? <span className={`badge bg-${row.tipo ? 'success' : 'danger'}`}>{`${row.tipo ? 'Entrada' : 'Saida'}`}</span> : '-'}</td>
                                                                        <td className="text-start">{row.nome_cliente}</td>
                                                                        <td>{row.observacao}</td>
                                                                        <th scope="row">{row.venda_id}</th>
                                                                        <td>{`${row.data_movimentacao_format}`}</td>
                                                                        <td>
                                                                            <ButtonGroup>
                                                                                <UncontrolledDropdown direction="down">
                                                                                    <DropdownToggle tag="button" className="btn">
                                                                                        <i className="ri-more-2-fill"></i>
                                                                                    </DropdownToggle>
                                                                                </UncontrolledDropdown>
                                                                            </ButtonGroup>
                                                                        </td> 
                                                                    </tr>                                                        
                                                                ))
                                                                :
                                                                <tr>
                                                                    <td colSpan={9} className="mt-3 mb-3">
                                                                        <div className="bg-danger text-white border-0 alert alert-danger fade show text-center" >NENHUM RESULTADO ENCONTRADO!</div>
                                                                    </td>
                                                                </tr>
                                                                
                                                                }
                                                                </tbody>
                                                        </table>
                                                    </div>
                                                </Col>
                                            </TabPane>
                                            <TabPane tabId="2" id="nav-border-justified-home">
                        
                                            <Row className="mb-3 mt-3">
                                                    <Col xl={6} className="mb-4">
                                                        <div className="table-responsive">
                                                            <Table className="table table-borderless table-sm align-middle mb-0" style={{ width: "100%" }}>
                                                                <tbody>
                                                                {operacaoEntrada &&
                                                                operacaoEntrada.map((row, index) => (
                                                                    <React.Fragment key={index}>
                                                                        <tr className="table-light">
                                                                            <th colSpan={2} className="text-start text-primary fs-5 mb-3">
                                                                                <i className="ri-arrow-down-circle-line me-2"></i> {row.title}
                                                                            </th>
                                                                        </tr>
                                                                        
                                                                        {(data && data.totalizadores) &&
                                                                        Object.entries(data.totalizadores).map(([tipo, formas]) => {
                                                                            if (row.tipo != tipo) return null;
                                                                            return (
                                                                                <React.Fragment key={tipo}>
                                                                                    {(formas ) &&
                                                                                    Object.entries(formas).map(([idForma, dados]) => {
                                                                                        if (row.tipo === 99 && idForma !== 'total_entrada') {
                                                                                            console.log(dados)
                                                                                            return (
                                                                                                <tr className="border-top border-top-dashed fs-6 fw-semibold" key={idForma}>
                                                                                                    <td className="text-start text-dark">Total {dados.nome_forma_pagamento}</td>
                                                                                                    <td className="text-end text-dark">R$ {formatarParaMoedaSemSimbolo(dados.valor)}</td>
                                                                                                </tr>
                                                                                            );
                                                                                        }
                                                                                        if (row.tipo !== 99 && idForma !== 'total') {
                                                                                            let totalSuprimentos = dados.valor;
                                                                                            return (
                                                                                                <tr key={idForma}>
                                                                                                    <td className="text-start">
                                                                                                        <i className="ri-arrow-down-line me-2 text-success"></i>
                                                                                                        {dados.nome_forma_pagamento}
                                                                                                    </td>
                                                                                                    <td className="text-end">R$ {formatarParaMoedaSemSimbolo(dados.valor)}</td>
                                                                                                </tr>
                                                                                            );
                                                                                        }
                                                                                        if (row.tipo !== 99 && idForma === 'total') {
                                                                                            if(idForma == 4){
                                                                                                setTotalSuprimento(formas.total)
                                                                                            }
                                                                                            return (
                                                                                                <tr className="border-top border-top-dashed fs-6 fw-semibold " key="total">
                                                                                                    <td className="text-start text-primary"></td>
                                                                                                    <td className="text-end text-primary fw-bold">
                                                                                                        R$ {formatarParaMoedaSemSimbolo(formas.total)}
                                                                                                    </td>
                                                                                                </tr>
                                                                                            );
                                                                                        }

                                                                                        return null;
                                                                                    })}
                                                                                    {row.tipo === 99 && formas.total_entrada && (
                                                                                        <tr className="border-top border-top-dashed fs-5 fw-semibold" key="total_entrada">
                                                                                            <td className="text-start text-primary">Total Entradas</td>
                                                                                            <td className="text-end text-primary fs-4">R$ {formatarParaMoedaSemSimbolo(formas.total_entrada.valor)}</td>
                                                                                        </tr>
                                                                                    )}
                                                                                </React.Fragment>
                                                                            );
                                                                            })}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Col>
                                                    <Col xl={6}>
                                                        <div className="table-responsive">
                                                            <Table className="table table-borderless table-sm align-middle mb-0 ms-auto" style={{ width: "100%" }}>
                                                                <tbody>
                                                                    {operacaoSaida &&
                                                                    operacaoSaida.map((row, index) => (
                                                                        <React.Fragment key={index}>
                                                                            <tr className="table-light">
                                                                                <th colSpan={2} className="text-start text-danger fs-5">
                                                                                    <i className="ri-arrow-up-circle-line me-2"></i> {row.title}
                                                                                </th>
                                                                            </tr>
                                                                            {(data && data.totalizadores) &&
                                                                            Object.entries(data.totalizadores).map(([tipo, formas]) => {
                                                                                if (row.tipo != tipo) return null;
                                                                                return (
                                                                                    <React.Fragment key={tipo}>
                                                                                        {(formas) &&
                                                                                        Object.entries(formas).map(([idForma, dados]) => {
                                                                                            if (row.tipo === 98 && idForma !== 'total_saida') {
                                                                                                return (
                                                                                                    <tr className="border-top border-top-dashed fs-6 fw-semibold" key={idForma}>
                                                                                                        <td className="text-start text-dark">Total {dados.nome_forma_pagamento}</td>
                                                                                                        <td className="text-end text-dark">R$ {formatarParaMoedaSemSimbolo(dados.valor)}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            }

                                                                                            if (row.tipo !== 98 && idForma !== 'total') {
                                                                                                return (
                                                                                                    <tr key={idForma}>
                                                                                                        <td className="text-start">
                                                                                                            <i className="ri-arrow-up-line me-2 text-danger"></i>
                                                                                                            {dados.nome_forma_pagamento}
                                                                                                        </td>
                                                                                                        <td className="text-end">R$ {formatarParaMoedaSemSimbolo(dados.valor)}</td>
                                                                                                    </tr>
                                                                                                );
                                                                                            }

                                                                                            if (row.tipo !== 98 && idForma === 'total') {
                                                                                                return (
                                                                                                    <tr className="border-top border-top-dashed fs-6 fw-semibold" key="total">
                                                                                                        <td className="text-start text-danger"></td>
                                                                                                        <td className="text-end text-danger fw-bold">
                                                                                                            R$ {formatarParaMoedaSemSimbolo(formas.total)}
                                                                                                        </td>
                                                                                                    </tr>
                                                                                                );
                                                                                            }

                                                                                            return null;
                                                                                        })}

                                                                                        {row.tipo === 98 && formas.total_saida && (
                                                                                            <tr className="border-top border-top-dashed fs-5 fw-semibold" key="total_saida">
                                                                                                <td className="text-start text-danger">Total Saídas</td>
                                                                                                <td className="text-end text-danger fs-4">R$ {formatarParaMoedaSemSimbolo(formas.total_saida.valor)}</td>
                                                                                            </tr>
                                                                                        )}
                                                                                    </React.Fragment>
                                                                                );
                                                                            })}
                                                                        </React.Fragment>
                                                                    ))}
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <hr />
                                                <Row className="mb-3 mt-4">
                                                    <h4 className="text-center mb-3 mt-4 fs-3">Total Caixa</h4>
                                                    <Col xl={3}></Col>
                                                    <Col xl={6}>
                                                        <div className="table-responsive">
                                                            <Table className="table table-borderless table-sm align-middle mb-0 ms-auto fs-4" style={{ width: "100%" }}>
                                                                <tbody>
                                                                    <tr>
                                                                        <td className="text-start">
                                                                        <i className="ri-add-line me-2 text-success"></i> Suprimento
                                                                        </td>
                                                                        <td className="text-end">R$ {formatarParaMoedaSemSimbolo(calculaTotais("SUPRIMENTO"))}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start">
                                                                        <i className="ri-add-line me-2 text-success"></i> Vendas
                                                                        </td>
                                                                        <td className="text-end">R$ {formatarParaMoedaSemSimbolo(calculaTotais("VENDA"))}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start">
                                                                        <i className="ri-subtract-line me-2 text-warning"></i> Sangrias
                                                                        </td>
                                                                        <td className="text-end">R$ {formatarParaMoedaSemSimbolo(calculaTotais("SANGRIA"))}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <td className="text-start">
                                                                        <i className="ri-subtract-line me-2 text-warning"></i> Despesas
                                                                        </td>
                                                                        <td className="text-end">R$ {formatarParaMoedaSemSimbolo(calculaTotais("DESPESA"))}</td>
                                                                    </tr>
                                                                    <tr className="border-top border-top-2 fs-3 fw-bold">
                                                                        <td className="text-start">
                                                                        <span className="ms-4">Saldo</span>
                                                                        </td>
                                                                        <td className="text-end text-dark">R$ {formatarParaMoedaSemSimbolo(calculaTotais("SALDO"))}</td>
                                                                    </tr>
                                                                    <tr className="border-top border-top-2 fs-6 fw-bold text-success">
                                                                        <td className="text-start">
                                                                        <span className="d-flex flex-column flex-lg-row gap-1">
                                                                            <span>Lucro</span>
                                                                            <span className="text-muted">(Vendas - Despesas)</span>
                                                                            </span>
                                                                        </td>
                                                                        <td className="text-end text-success">R$ {formatarParaMoedaSemSimbolo(calculaTotais("LUCRO"))}</td>
                                                                    </tr>
                                                                    <tr className="border-top border-top-2 fs-6 fw-bold text-success">
                                                                        <td className="text-start">
                                                                        <span className="">Margem de Lucro</span>
                                                                        </td>
                                                                        <td className="text-end text-success">{calculaTotais("MARGEM")}%</td>
                                                                    </tr>
                                                                </tbody>
                                                            </Table>
                                                        </div>
                                                    </Col>
                                                    <Col xl={3}></Col>
                                                </Row>
                                            </TabPane>
                                        </TabContent>
                                        </Row>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row  className="mb-4">
                        <Col md={12}>
                            <div className="hstack gap-2 justify-content-end ">
                                <Link to="/dashboard" type="button"  className={`btn btn-soft-success`}>Voltar</Link>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >

    )
}
export default FluxoCaixaView;
