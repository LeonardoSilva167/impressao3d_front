import UiContent from "Components/Common/UiContent"
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { toast } from 'react-toastify'
import {
    ButtonGroup, Card, CardBody, Col, DropdownItem,
    DropdownMenu, DropdownToggle, Label, Row, UncontrolledDropdown
} from "reactstrap"
import { PaginateInterface, PaginateSearch, PerPageProps } from "interfaces/SystemInterfaces/PaginateInterface"
import CustomModal from "Components/ComponentController/Modal/CustomModal"
import { formatDateSQLForBR, formatDateTimeBR } from "helpers/functions_helpers"
import { CarreteisFinalizadosList, CarreteisFinalizadosSearch } from "interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface"
import { CarreteisFinalizadosService } from "services/CarreteisFinalizados/CarreteisFinalizadosService"
import CarreteisFinalizadosViewModal from "../CarreteisFinalizadosViewModal/CarreteisFinalizadosViewModal"

export interface CarreteisFinalizadosTableProps {
    data: PaginateInterface<CarreteisFinalizadosList> | undefined
    getData: (data: PaginateSearch & CarreteisFinalizadosSearch) => void
    setPerPage: (perPage: number) => void
    setPage: (page: number) => void
    page: number
    perPage: number
    filters: any
}

const formatGramatura = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '—'
    return `${value}g`
}

const formatQuantidade = (value: number | null | undefined) => {
    if (value == null) return '—'
    return value.toLocaleString('pt-BR')
}

const formatTotalConsumido = (value: number | null | undefined) => {
    if (value == null) return '—'
    return `${value.toLocaleString('pt-BR')}g`
}

const formatDataFinalizacao = (value?: string) => {
    if (!value) return '—'
    if (value.includes('T')) return formatDateTimeBR(value)
    const [datePart, timePart] = value.split(' ')
    if (!datePart) return value
    const formattedDate = formatDateSQLForBR(datePart)
    if (timePart) {
        const [hour, minute] = timePart.split(':')
        return `${formattedDate} ${hour}:${minute}`
    }
    return formattedDate
}

export const CarreteisFinalizadosTable = ({ data, getData, setPerPage, perPage }: CarreteisFinalizadosTableProps) => {
    const navigate = useNavigate()
    const [optPerPage] = useState<PerPageProps[]>([
        { value: 5, label: "5" },
        { value: 10, label: "10" },
        { value: 20, label: "20" },
        { value: 50, label: "50" },
        { value: 100, label: "100" },
    ])
    const [viewModalOpen, setViewModalOpen] = useState(false)
    const [selectedId, setSelectedId] = useState<number | null>(null)
    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const carreteisFinalizadosService = new CarreteisFinalizadosService()

    const toggleViewModal = () => setViewModalOpen(!viewModalOpen)
    const toggleModal = () => setModalIsOpen(!modalIsOpen)

    const handleView = (id: number) => {
        setSelectedId(id)
        setViewModalOpen(true)
    }

    const handleRemoteDelete = async (id: number) => {
        try {
            await carreteisFinalizadosService.deleteCarreteisFinalizados(id)
            toast.success('Registro excluído com sucesso')
            if (data) await handleThisRoute(data.first_page_url)
            toggleModal()
        } catch (error) {
            const err = error as any
            const message = (err && err.errors && err.errors.message)
                || (err && err.message)
                || 'Erro ao excluir registro'
            toast.error(message)
        }
    }

    const handleThisRoute = async (url: string) => {
        try {
            const new_url = new URL(url)
            await getData({
                page: Number(new_url.searchParams.get('page')),
                palavra_chave: new_url.searchParams.get('palavra_chave'),
                id_item: new_url.searchParams.get('id_item'),
                gramatura: new_url.searchParams.get('gramatura'),
                data_inicio: new_url.searchParams.get('data_inicio'),
                data_fim: new_url.searchParams.get('data_fim'),
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
                                                                <th scope="col" className="text-start">Filamento</th>
                                                                <th scope="col">Gramatura</th>
                                                                <th scope="col">Quantidade</th>
                                                                <th scope="col">Total Consumido</th>
                                                                <th scope="col">Data Finalização</th>
                                                                <th scope="col" className="text-start">Usuário</th>
                                                                <th scope="col" className="text-start">Observação</th>
                                                                <th scope="col" style={{ width: "100px" }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.data.map((row: CarreteisFinalizadosList, index: number) => (
                                                                <tr key={row.id || index}>
                                                                    <td className="text-start">{row.item_descricao || '—'}</td>
                                                                    <td>{formatGramatura(row.gramatura)}</td>
                                                                    <td>{formatQuantidade(row.quantidade)}</td>
                                                                    <td>{formatTotalConsumido(row.total_consumido)}</td>
                                                                    <td>
                                                                        {formatDataFinalizacao(row.data_finalizacao)}
                                                                    </td>
                                                                    <td className="text-start">{row.usuario_descricao || '—'}</td>
                                                                    <td className="text-start">{row.observacao || '—'}</td>
                                                                    <td>
                                                                        <ButtonGroup>
                                                                            <UncontrolledDropdown direction="down">
                                                                                <DropdownToggle tag="button" className="btn">
                                                                                    <i className="ri-more-2-fill"></i>
                                                                                </DropdownToggle>
                                                                                <DropdownMenu style={{ zIndex: '999' }}>
                                                                                    <DropdownItem onClick={() => handleView(row.id!)}>
                                                                                        Visualizar
                                                                                    </DropdownItem>
                                                                                    <DropdownItem
                                                                                        onClick={() => navigate(
                                                                                            `/carreteis-finalizados/edit/${row.id}`,
                                                                                            { state: { source: row } }
                                                                                        )}
                                                                                    >
                                                                                        Editar
                                                                                    </DropdownItem>
                                                                                    <DropdownItem
                                                                                        onClick={() => {
                                                                                            setDeleteId(row.id!)
                                                                                            toggleModal()
                                                                                        }}
                                                                                    >
                                                                                        Excluir
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
                                            <Col xs="12" className="d-block d-sm-none">
                                                <ul className="pagination pagination-md justify-content-center mb-2">
                                                    <li className={data.current_page === 1 ? "page-item disabled" : "page-item"}>
                                                        <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[0].url)}>Anterior</Link>
                                                    </li>
                                                </ul>
                                                <ul className="pagination pagination-md justify-content-center mb-2 flex-wrap">
                                                    {data.links.map((item: any, key: number) => {
                                                        if (key === 0 || key === data.links.length - 1) return null
                                                        return (
                                                            <li key={item.label} className={`page-item ${item.active ? 'active' : ''}`}>
                                                                <Link to="#" className="page-link" onClick={() => handleThisRoute(item.url)}>{item.label}</Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>
                                                <ul className="pagination pagination-md justify-content-center mb-0">
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

            <CarreteisFinalizadosViewModal
                isOpen={viewModalOpen}
                toggle={toggleViewModal}
                registroId={selectedId}
            />

            <CustomModal
                isOpen={modalIsOpen}
                toggle={toggleModal}
                title="Confirmação de Exclusão"
                delete={true}
                body=""
                onConfirmDelete={() => deleteId && handleRemoteDelete(deleteId)}
            />
        </React.Fragment>
    )
}

export default CarreteisFinalizadosTable
