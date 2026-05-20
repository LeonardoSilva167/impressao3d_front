import UiContent from "Components/Common/UiContent";
import { borderColorCategory, buscarMesPorNumero, formatarParaMoedaSemSimbolo, mesesSelect, numberFormat, useNavegacao } from 'helpers/functions_helpers';
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Label, Row, Table, UncontrolledDropdown } from "reactstrap";
import { PaginateInterface, PaginateSearch, PerPageProps } from "interfaces/SystemInterfaces/PaginateInterface";
import CustomModal from "Components/ComponentController/Modal/CustomModal";
import { MovimentoCaixaList, MovimentoCaixaSearch } from "interfaces/MovimentoCaixa";
import { MovimentoCaixaService } from "services/MovimentoCaixa";

export interface MovimentoCaixaTableProps {
    data: PaginateInterface<MovimentoCaixaList> | undefined,
    getData: (data: PaginateSearch & MovimentoCaixaSearch) => void,
    setPerPage: (perPage: number) => void
    setPage: (page: number) => void
    page: number
    perPage: number
    filters: any
}

export const MovimentoCaixaTable = ({ data, getData, setPerPage, setPage, perPage, filters }: MovimentoCaixaTableProps) => {
    const [optPerPage, setOptPerPage] = useState<PerPageProps[]>([
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
    ]);
    const movimentoCaixaService = new MovimentoCaixaService();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);


    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };

    const handleRemoteDelete = async (id: number) => {
        try {
            const response = await movimentoCaixaService.deleteMovimentoCaixa(id);
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
                cliente_id: new_url.searchParams.get('MovimentoCaixa_id'),
                codigo: new_url.searchParams.get('codigo'),
                nome: new_url.searchParams.get('nome'),
                page: Number(new_url.searchParams.get('page')),
                palavra_chave: new_url.searchParams.get('palavra_chave')
            })
        } catch (error) {

        }
    }

    // const hancdleCheckColorProgress = (value: number): any => {
    //     value = Number(value);

    //     if (value < 20) {
    //         return 'danger'
    //     } else if (value >= 20 && value < 80) {
    //         return 'warning'
    //     } else if (value >= 80) {
    //         return 'success'
    //     }
    //     else {
    //         return 'info'
    //     }
    // };

    <i className="ri-checkbox-circle-line fs-17 align-middle"></i>

    useEffect(() => {
        if (data) {
            handleThisRoute(data.first_page_url)
        }
    }, [perPage])

    // Botão Voltar
    const { voltarParaRotaAnterior } = useNavegacao();
    const gotoPage = async (item: any) => {

    };
console.log(data)
    return (
        <React.Fragment>
            <UiContent />
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <div className="live-preview mt-1">
                                {data && data.total == 0 ?
                                    <div className="bg-primary text-white border-0 alert alert-primary fade show text-center" >INFORME OS FILTROS DESEJADOS E CLIQUE EM BUSCAR!</div>
                                    :
                                    !data ?
                                        <div className="bg-danger text-white border-0 alert alert-danger fade show text-center" >NENHUM RESULTADO ENCONTRADO!</div>
                                        :
                                        <>
                                            {/* <h4 className="mb-3 mt-3 text-center">Movimentações do Dia</h4> */}
                                            {/* <hr /> */}

                                            <Row className="d-felx align-items-center g-3 text-center text-sm-start">
                                                <Col lg={12} >
                                                    <div className="col-sm ">
                                                        <Col lg={2}>
                                                            <div className="d-flex flex-row justify-content-betweencenter align-items-center">
                                                                <Label htmlFor="firstNameinput" className="form-label me-3">Mostrar</Label>
                                                                <select className="form-select d-flex ps-3 mb-3" style={{ width: "100px", }} value={perPage} onChange={(e) => setPerPage(Number(e.target.value))} >
                                                                    {optPerPage.map((item: any) => {
                                                                        return (<option key={item.value} value={item.value}>{item.label}</option>);

                                                                    })}
                                                                </select>
                                                                <Label htmlFor="firstNameinput" className="form-label ms-3 ">resultados</Label>
                                                            </div>
                                                        </Col>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col xl={12}>
                                                    
                                                    {/* <hr /> */}
                                                    <div className="table-responsive">
                                                        <table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                                            <thead className="table-light">
                                                                <tr>                                                                	
                                                                    <th scope="col" className="text-start">Operação</th>
                                                                    <th scope="col">Forma de Pagamento</th>
                                                                    <th scope="col" className="text-end">Valor (R$)</th>
                                                                    <th scope="col">Data Hora</th>
                                                                    <th scope="col" className="text-center">Tipo</th>
                                                                    <th scope="col">Observação</th>
                                                                    {/* <th scope="col" style={{ width: "150px" }}>Ação</th> */}
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data && data.data.map((row: any, index: number) => {
                                                                    return (    
                                                                        <tr>
                                                                            <td style={{ padding: 0, textAlign: "left" }}>
                                                                                <div
                                                                                    style={{
                                                                                    ...borderColorCategory(row.id_tipo_origem_pagamento),
                                                                                    display: "inline-block",
                                                                                    textAlign: "left"
                                                                                    }}
                                                                                >
                                                                                    {row.nome_tipo_origem_pagamento}
                                                                                </div>
                                                                            </td>
                                                                            <td>{row.nome_forma_pagamento}</td>
                                                                            <td className="text-end">{formatarParaMoedaSemSimbolo(row.valor)}</td>                                                                                                                                                     
                                                                            <td className="text-center">{row.data_movimentacao_format}</td>
                                                                            <td><span className={`badge bg-${row.tipo_tipo_origem_pagamento ? 'success' : 'danger'}`}>{`${row.tipo_tipo_origem_pagamento ? 'Entrada' : 'Saida'}`}</span></td>
                                                                            <td className="text-start">{row.observacao}</td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                             </tbody>
                                                        </table>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="align-items-center mt-2 g-3 text-center text-sm-start">
                                                <Col sm="12">
                                                    <div className="text-muted">
                                                        Exibindo <span className="fw-semibold ms-1">{data.per_page}</span> de
                                                        <span className="fw-semibold"> {data.total}</span> Resultados
                                                    </div>
                                                </Col>

                                                {/* Paginação em linha única (desktop) alinhada à direita */}
                                                <Col sm="12" className="d-none d-sm-flex justify-content-end gap-2 flex-wrap">
                                                    <ul className="pagination pagination-md mb-0">
                                                        <li className={data.current_page === 1 ? "page-item disabled" : "page-item"}>
                                                            <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[0].url)}>Anterior</Link>
                                                        </li>
                                                    </ul>
                                                    <ul className="pagination pagination-md mb-0 flex-wrap">
                                                    {
                                                        data.links.map((item: any, key: number) => {
                                                        if (key === 0 || key === data.links.length - 1) return null;
                                                        return (
                                                            <li key={item.label} className={`page-item ${item.active ? 'active' : ''}`}>
                                                            <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>{item.label}</Link>
                                                            </li>
                                                        );
                                                        })
                                                    }
                                                    </ul>
                                                    <ul className="pagination pagination-md mb-0">
                                                        <li className={data.current_page === data.last_page ? "page-item disabled" : "page-item"}>
                                                            <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[data.links.length - 1].url)}>Próximo</Link>
                                                        </li>
                                                    </ul>
                                                </Col>

                                                {/* Paginação dividida em 3 linhas no celular */}
                                                <Col xs="12" className="d-block d-sm-none">
                                                    <ul className="pagination pagination-md justify-content-center mb-2">
                                                        <li className={data.current_page === 1 ? "page-item disabled" : "page-item"}>
                                                            <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[0].url)}>Anterior</Link>
                                                        </li>
                                                    </ul>
                                                    <ul className="pagination pagination-md justify-content-center mb-2 flex-wrap">
                                                    {
                                                        data.links.map((item: any, key: number) => {
                                                        if (key === 0 || key === data.links.length - 1) return null;
                                                        return (
                                                            <li key={item.label} className={`page-item ${item.active ? 'active' : ''}`}>
                                                            <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>{item.label}</Link>
                                                            </li>
                                                        );
                                                        })
                                                    }
                                                    </ul>
                                                    <ul className="pagination pagination-md justify-content-center mb-0">
                                                        <li className={data.current_page === data.last_page ? "page-item disabled" : "page-item"}>
                                                            <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[data.links.length - 1].url)}>Próximo</Link>
                                                        </li>
                                                    </ul>
                                                </Col>
                                            </Row>
                                        </>}
                            </div>
                        </CardBody>
                    </Card>
                </Col>

            </Row >
            <Row>
                <Col md={12}>
                    <div className="hstack gap-2 justify-content-end">
                        <Link to="/dashboard" type="button"  className={`btn btn-soft-success`}>Voltar</Link>
                    </div>
                </Col>
            </Row>
        </React.Fragment >

    )
}
export default MovimentoCaixaTable;
