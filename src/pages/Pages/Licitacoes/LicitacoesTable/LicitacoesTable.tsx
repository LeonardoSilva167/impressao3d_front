import UiContent from "Components/Common/UiContent";
import { buscarMesPorNumero, mesesSelect, numberFormat, useNavegacao } from 'helpers/functions_helpers';
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, Card, CardBody, Col, DropdownItem, DropdownMenu, DropdownToggle, Label, Row, UncontrolledDropdown } from "reactstrap";
import { PaginateInterface, PaginateSearch, PerPageProps } from "interfaces/SystemInterfaces/PaginateInterface";
import CustomModal from "Components/ComponentController/Modal/CustomModal";
import { LicitacoesList, LicitacoesSearch } from "interfaces/Licitacoes";
import { LicitacoesService } from "services/Licitacoes/LicitacoesService";

export interface LicitacoesTableProps {
    data: PaginateInterface<LicitacoesList> | undefined,
    getData: (data: PaginateSearch & LicitacoesSearch) => void,
    setPerPage: (perPage: number) => void
    setPage: (page: number) => void
    page: number
    perPage: number
    filters: any
}

export const LicitacoesTable = ({ data, getData, setPerPage, setPage, perPage, filters }: LicitacoesTableProps) => {
    const [optPerPage, setOptPerPage] = useState<PerPageProps[]>([
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
    ]);
    const licitacoesService = new LicitacoesService();
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    
    
    const colorRowLicitacao = (date: string): any => {     
        const hoje = new Date();
        const amanha = new Date();
        amanha.setDate(hoje.getDate() + 1);
        const dataFormatada = amanha.toLocaleDateString('pt-BR');

        if(date == new Date().toLocaleDateString('pt-BR')){
            return 'bg-success'
        }
        else if(date == dataFormatada){
            return 'bg-warning'
        }
        else{
            return ''
        }
    }
    const colorStatusLicitacao = (status: number): any => { 
        switch (status) {
            case 1:
                return 'warning'
            case 2:
                return 'success'
            case 3:
                return 'primary'
            case 4:
                return 'dark'
            default:
                break;
        }
    }

    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };

    const handleRemoteDelete = async (id: number) => {
        try {
            const response = await licitacoesService.deleteLicitacoes(id);
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
                licitacao_id: new_url.searchParams.get('licitacao_id'),
                cliente_id: new_url.searchParams.get('cliente_id'),
                modalidade_id: new_url.searchParams.get('modalidade_id'),
                status_licitacoes_id: new_url.searchParams.get('status_licitacoes_id'),
                status_compra_id: new_url.searchParams.get('status_compra_id'),
                data_limite_proposta_inicio: new_url.searchParams.get('data_limite_proposta_inicio'),
                data_limite_proposta_final: new_url.searchParams.get('data_limite_proposta_final'),
                uf: new_url.searchParams.get('uf'),
                cidade: new_url.searchParams.get('cidade'),
                page: Number(new_url.searchParams.get('page')),
                palavra_chave: new_url.searchParams.get('palavra_chave')
            })
        } catch (error) {

        }
    }

    useEffect(() => {
        if (data) {
            handleThisRoute(data.first_page_url)
        }
    }, [perPage])

    // Botão Voltar
    const { voltarParaRotaAnterior } = useNavegacao();
    const gotoPage = async (item: any) => {

    };

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
                                                    <div className="table-responsive">
                                                        <table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                                            <thead className="table-light">
                                                                <tr>
                                                                    <th scope="col">Modalidade</th>
                                                                    <th scope="col">Compra</th>
                                                                    <th scope="col">Unidade Compradora</th>
                                                                    <th scope="col">Data Limite</th>
                                                                    <th scope="col">Etapa</th>
                                                                    <th scope="col">Status</th>
                                                                    <th scope="col">PNCP</th>
                                                                    <th scope="col" style={{ width: "150px" }}>Ação</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {data && data.data.map((row: any, index: number) => {
                                                               
                                                                    return (    
                                                                        <tr className={`${colorRowLicitacao(row.data_limite_proposta_format_date)}`}>
                                                                            <td className="text-center">{`${row.modalidade_nome}`}</td>
                                                                            <td className="text-right">{`${row.num_compra}/${row.exercicio}`}</td>
                                                                            <td className="text-start">{`${row.unidade_compradoras_codigo} - ${row.unidade_compradoras_nome} - ${row.unidade_compradoras_cidade}/${row.unidade_compradoras_uf}`}</td>
                                                                            <td>{row.data_limite_proposta_format}</td>
                                                                            <td><span className={`badge fs-12 bg-${colorStatusLicitacao(row.status_licitacoes_id)}`}>{`${row.status_licitacao}`}</span></td>
                                                                            <td>{row.status_compra}</td>
                                                                            <td><a href={row.link_pcnp} className="badge bg-info color-primary" target="_blank">Ir para PNCP</a></td>
                                                                            <td>
                                                                                <ButtonGroup>
                                                                                    <UncontrolledDropdown direction="down">
                                                                                        <DropdownToggle tag="button" className="btn">
                                                                                            <i className="ri-more-2-fill"></i>
                                                                                        </DropdownToggle>
                                                                                        <DropdownMenu style={{ zIndex: '999' }}>
                                                                                            <Link to={`/licitacoes/edit/${row.id}`} state={{ source: row }}>
                                                                                                <DropdownItem>Editar</DropdownItem>
                                                                                            </Link>
                                                                                            <DropdownItem
                                                                                                onClick={() => {
                                                                                                    setSelectedId(row.id);
                                                                                                    toggleModal();
                                                                                                }}
                                                                                            >
                                                                                                Excluir
                                                                                            </DropdownItem>
                                                                                            <CustomModal
                                                                                                isOpen={modalIsOpen}
                                                                                                toggle={toggleModal}
                                                                                                title="Confirmação de Exclusão"
                                                                                                delete={true}
                                                                                                body=""
                                                                                                onConfirmDelete={() => handleRemoteDelete(selectedId!)}
                                                                                            />
                                                                                            <Link to={`/licitacoes/itens/${row.id}`} state={{ source: row }}>
                                                                                                <DropdownItem>Itens</DropdownItem>
                                                                                            </Link>
                                                                                        </DropdownMenu>
                                                                                    </UncontrolledDropdown>
                                                                                </ButtonGroup>
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                })}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </Col>
                                            </Row>
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
export default LicitacoesTable;
