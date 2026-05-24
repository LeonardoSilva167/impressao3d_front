import UiContent from "Components/Common/UiContent"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
    Badge, ButtonGroup, Card, CardBody, Col, DropdownItem,
    DropdownMenu, DropdownToggle, Label, Row, UncontrolledDropdown
} from "reactstrap"
import { PaginateInterface, PaginateSearch, PerPageProps } from "interfaces/SystemInterfaces/PaginateInterface"
import { formatarParaMoedaSemSimbolo } from "helpers/functions_helpers"
import { LotesList, LotesSearch } from "interfaces/Estoque/EstoqueInterface"
import LotesViewModal from "../LotesViewModal/LotesViewModal"

export interface LotesTableProps {
    data: PaginateInterface<LotesList> | undefined
    getData: (data: PaginateSearch & LotesSearch) => void
    setPerPage: (perPage: number) => void
    setPage: (page: number) => void
    page: number
    perPage: number
    filters: any
}

const formatQuantidade = (value: number | null | undefined) => {
    if (value == null) return '—'
    return `${value.toLocaleString('pt-BR')}g`
}

const formatPercentual = (value: number | null | undefined) => {
    if (value == null) return '—'
    return `${value}%`
}

const renderStatus = (status: string | undefined) => {
    if (!status) return '—'
    if (status === 'ATIVO') {
        return <Badge color="success">ATIVO</Badge>
    }
    if (status === 'ZERADO') {
        return <Badge color="secondary">ZERADO</Badge>
    }
    return status
}

export const LotesTable = ({ data, getData, setPerPage, perPage }: LotesTableProps) => {
    const [optPerPage] = useState<PerPageProps[]>([
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
    ])
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [selectedLoteId, setSelectedLoteId] = useState<number | null>(null)

    const toggleViewModal = () => setViewModalOpen(!viewModalOpen)

    const handleView = (id: number) => {
        setSelectedLoteId(id)
        setViewModalOpen(true)
    }

    const handleThisRoute = async (url: string) => {
        try {
            const new_url = new URL(url)
            await getData({
                page: Number(new_url.searchParams.get('page')),
                palavra_chave: new_url.searchParams.get('palavra_chave'),
                id_item: new_url.searchParams.get('id_item'),
                id_filamento: new_url.searchParams.get('id_filamento'),
                data_compra: new_url.searchParams.get('data_compra'),
                status: new_url.searchParams.get('status'),
            })
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (data) handleThisRoute(data.first_page_url)
    }, [perPage])

    return (
        <React.Fragment>
            <UiContent />
            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody>
                            <div className="live-preview mt-1">
                                {data && data.total === 0 ? (
                                    <div className="bg-primary text-white border-0 alert alert-primary fade show text-center">
                                        INFORME OS FILTROS DESEJADOS E CLIQUE EM BUSCAR!
                                    </div>
                                ) : !data ? (
                                    <div className="bg-danger text-white border-0 alert alert-danger fade show text-center">
                                        NENHUM RESULTADO ENCONTRADO!
                                    </div>
                                ) : (
                                    <>
                                        <Row className="d-flex align-items-center g-3 text-center text-sm-start">
                                            <Col lg={12}>
                                                <Col lg={2}>
                                                    <div className="d-flex flex-row align-items-center">
                                                        <Label className="form-label me-3">Mostrar</Label>
                                                        <select
                                                            className="form-select d-flex ps-3 mb-3"
                                                            style={{ width: "100px" }}
                                                            value={perPage}
                                                            onChange={(e) => setPerPage(Number(e.target.value))}
                                                        >
                                                            {optPerPage.map((item) => (
                                                                <option key={item.value} value={item.value}>{item.label}</option>
                                                            ))}
                                                        </select>
                                                        <Label className="form-label ms-3">resultados</Label>
                                                    </div>
                                                </Col>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col xl={12}>
                                                <div className="table-responsive">
                                                    <table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th scope="col" className="text-start">Item</th>
                                                                <th scope="col">Compra</th>
                                                                <th scope="col">Data Compra</th>
                                                                <th scope="col">Qtd Original</th>
                                                                <th scope="col">Qtd Atual</th>
                                                                <th scope="col">% Utilizado</th>
                                                                <th scope="col">Valor Unitário</th>
                                                                <th scope="col">Valor Total</th>
                                                                <th scope="col">Status</th>
                                                                <th scope="col" style={{ width: "80px" }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.data.map((row: any, index: number) => (
                                                                <tr key={row.id != null ? row.id : index}>
                                                                    <td className="text-start">{row.item_descricao}</td>
                                                                    <td>{row.compra_descricao != null ? row.compra_descricao : '—'}</td>
                                                                    <td>{row.data_compra != null ? row.data_compra : '—'}</td>
                                                                    <td>{formatQuantidade(row.qtd_original)}</td>
                                                                    <td>{formatQuantidade(row.qtd_atual)}</td>
                                                                    <td>{formatPercentual(row.percentual_utilizado)}</td>
                                                                    <td>
                                                                        {row.valor_unitario != null
                                                                            ? formatarParaMoedaSemSimbolo(row.valor_unitario)
                                                                            : '—'}
                                                                    </td>
                                                                    <td>
                                                                        {row.valor_total != null
                                                                            ? formatarParaMoedaSemSimbolo(row.valor_total)
                                                                            : '—'}
                                                                    </td>
                                                                    <td>{renderStatus(row.status)}</td>
                                                                    <td>
                                                                        <ButtonGroup>
                                                                            <UncontrolledDropdown direction="down">
                                                                                <DropdownToggle tag="button" className="btn">
                                                                                    <i className="ri-more-2-fill"></i>
                                                                                </DropdownToggle>
                                                                                <DropdownMenu style={{ zIndex: '999' }}>
                                                                                    <DropdownItem onClick={() => handleView(row.id)}>
                                                                                        Visualizar
                                                                                    </DropdownItem>
                                                                                </DropdownMenu>
                                                                            </UncontrolledDropdown>
                                                                        </ButtonGroup>
                                                                    </td>
                                                                </tr>
                                                            ))}
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
                                            <Col sm="12" className="d-none d-sm-flex justify-content-end gap-2 flex-wrap">
                                                <ul className="pagination pagination-md mb-0">
                                                    <li className={data.current_page === 1 ? "page-item disabled" : "page-item"}>
                                                        <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[0].url)}>Anterior</Link>
                                                    </li>
                                                </ul>
                                                <ul className="pagination pagination-md mb-0 flex-wrap">
                                                    {data.links.map((item: any, key: number) => {
                                                        if (key === 0 || key === data.links.length - 1) return null
                                                        return (
                                                            <li key={item.label} className={`page-item ${item.active ? 'active' : ''}`}>
                                                                <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>{item.label}</Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                                <ul className="pagination pagination-md mb-0">
                                                    <li className={data.current_page === data.last_page ? "page-item disabled" : "page-item"}>
                                                        <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[data.links.length - 1].url)}>Próximo</Link>
                                                    </li>
                                                </ul>
                                            </Col>
                                        </Row>
                                    </>
                                )}
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <div className="hstack gap-2 justify-content-end">
                        <Link to="/dashboard" className="btn btn-soft-success">Voltar</Link>
                    </div>
                </Col>
            </Row>

            <LotesViewModal
                isOpen={viewModalOpen}
                toggle={toggleViewModal}
                loteId={selectedLoteId}
            />
        </React.Fragment>
    )
}

export default LotesTable
