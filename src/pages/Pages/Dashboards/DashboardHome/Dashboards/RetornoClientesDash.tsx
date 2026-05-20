
import { formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, Col, DropdownItem, DropdownMenu, DropdownToggle, Row, UncontrolledDropdown } from 'reactstrap';
import { DashboardsService } from 'services/Dashboards';
// import { bestSellingProducts } from "../../common/data";

export interface WidgetsProps {
    range: Date[]; 
}

const RetornoClientesDash = ({range}: WidgetsProps) => {
    const dashboardsService = new DashboardsService();
    const [data, setData] = useState(null);
    const [page, setPage] = useState(1);


    // useEffect(() => {
    //     if (!range || range.length < 2) return;
        
    //     const [start, end] = range;
    //     const fetchServicos = async () => {
    //         try {
    //             const dadosAPI = await dashboardsService.listRetornoClientesboards({
    //                 start_date: start.toISOString().split('T')[0],
    //                 end_date: end.toISOString().split('T')[0],
    //                 page: page
    //             });
                
    //             setData(dadosAPI);
    //             // const atualizados = defaultWidgets.map(widget => {
    //             //     const dado = dadosAPI.widgetDash.find(d => d.id === widget.id);
    //             //     return dado
    //             //         ? {
    //             //             ...widget,
    //             //             counter: widget.suffix == "k" ? dado.counter / 1000 : dado.counter,
    //             //         }
    //             //         : widget;
    //             // });
    //             // setWidgetsData(atualizados);
    //             // setchartData(dadosAPI.dash);
    //         } catch (error) {
    //             console.error('Erro ao buscar widgets:', error);
    //         }
    //     };
    
    //     fetchServicos();
    // }, [range]);

    const fetchServicos = async (start: Date, end: Date, page: number) => {
        try {
            const dadosAPI = await dashboardsService.listRetornoClientesDashboards({
                start_date: start.toISOString().split('T')[0],
                end_date: end.toISOString().split('T')[0],
                page: page
            });
            
            setData(dadosAPI);
        } catch (error) {
            console.error('Erro ao buscar serviços:', error);
        }
    };


    const handleThisRoute = async (url: string) => {
        try {
            const new_url = new URL(url);
            const newPage = Number(new_url.searchParams.get('page'));
            setPage(newPage);
        } catch (error) {
            console.error('Erro ao interpretar URL da página:', error);
        }
    };
    
    useEffect(() => {
        if (!range || range.length < 2) return;
    
        const [start, end] = range;
        fetchServicos(start, end, page);
    }, [range, page]);

    return (
        <React.Fragment>
            <Col xl={6}>
                <Card>
                {data && 
                <>
                    <CardHeader className="align-items-center d-flex text-center ">
                        <h4 className="card-title mb-0 flex-grow-1 ">Retorno de Clientes</h4>
                        {/* <div className="flex-shrink-0">
                            <UncontrolledDropdown className="card-header-dropdown">
                                <DropdownToggle tag="a" className="text-reset" role="button">
                                    <span className="fw-semibold text-uppercase fs-12">Classificar por: </span><span className="text-muted">Hoje<i className="mdi mdi-chevron-down ms-1"></i></span>
                                </DropdownToggle>
                                <DropdownMenu className="dropdown-menu-end">
                                    <DropdownItem>Hoje</DropdownItem>
                                    <DropdownItem>Yesterday</DropdownItem>
                                    <DropdownItem>Last 7 Days</DropdownItem>
                                    <DropdownItem>Last 30 Days</DropdownItem>
                                    <DropdownItem>This Month</DropdownItem>
                                    <DropdownItem>Last Month</DropdownItem>
                                </DropdownMenu>
                            </UncontrolledDropdown>
                        </div> */}
                    </CardHeader>

                    <CardBody>
                        <div className="table-responsive table-card">
                            <table className="table table-hover table-centered align-middle table-nowrap mb-0">
                                <tbody>
                            {data && data.data.map((row: any, index: number) => {
                                return (    
                                            <tr>
                                                <td className='text-start'>
                                                    <div className="d-flex align-items-center">
                                                        <div>
                                                            <h5 className="fs-14 my-1">
                                                                {/* <Link to="/apps-ecommerce-product-details" className="text-reset">{row.servico_nome}</Link> */}
                                                                {row.cliente_nome}
                                                                </h5>   
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className='text-end'>
                                                    <h5 className="fs-14 my-1 fw-normal">{row.total_servicos}</h5>                                                    
                                                    <span className="text-muted">Serviços</span>
                                                </td>
                                                <td className='text-end'>
                                                    <h5 className="fs-14 my-1 fw-normal">{row.ultima_data_servico_format}</h5>
                                                    <span className="text-muted">Última Visita</span>
                                                </td>
                                                <td className='text-end'>
                                                    <h5 className="fs-14 my-1 fw-normal">{row.dias_desde_ultimo_servico}</h5>
                                                    <span className="text-muted">Dias</span>
                                                </td>
                                        </tr>
                                        )
                                    })} 
                                </tbody>
                            </table>
                        </div>
                        {data &&
                            <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
                                <div className="col-sm">
                                    <div className="text-muted">Exibindo<span className="fw-semibold ms-1">{data && data.per_page}</span> de <span className="fw-semibold">{data && data.total}</span> Resultados</div>
                                </div>
                                <div className="col-sm-auto">
                                    <ul className="pagination pagination-separated pagination-md justify-content-start justify-content-sm-start mb-0  table-responsive">
                                        {
                                            data.links && data.links.map((item: any, key: number) => {
                                                switch (key) {
                                                    case 0:
                                                        return (
                                                            <li key={item.label} className={data.current_page == 1 ? "page-item disabled" : "page-item"}>
                                                                <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>Anterior</Link>
                                                            </li>
                                                        )
                                                    case data.links.length - 1:
                                                        return (
                                                            <li className={data.last_page == data.current_page ? "page-item disabled" : "page-item"}>
                                                                <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>Próximo</Link>
                                                            </li>
                                                        )
                                                    default:
                                                        return (
                                                            <li className={`${item.active ? 'page-item active' : 'page-item'}`}>
                                                                <Link to="#" className={`page-link `} onClick={() => handleThisRoute(item.url)}>{item.active}{item.label}</Link>
                                                            </li>
                                                        )
                                                }
                                            })
                                        }
                                    </ul>
                                </div>
                            </Row>
                        }
                    </CardBody>
                    </>}
                </Card>
            </Col>
        </React.Fragment>
    );
};

export default RetornoClientesDash;