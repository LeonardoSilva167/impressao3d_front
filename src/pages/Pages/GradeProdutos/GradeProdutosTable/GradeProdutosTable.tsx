import UiContent from 'Components/Common/UiContent'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
    Badge, Card, CardBody, Col, Label, Row
} from 'reactstrap'
import { PaginateInterface, PaginateSearch, PerPageProps } from 'interfaces/SystemInterfaces/PaginateInterface'
import { GradeProdutoGeradoList, GradeProdutosSearch } from 'interfaces/GradeProdutos/GradeProdutosInterface'
import {
    formatarCustoGrade,
    formatarPesoGrade,
    formatarTempoGrade,
    obterClasseBadgeStatusProdutoGerado,
    obterLabelStatusProdutoGerado,
    obterPartesProdutoGerado,
} from '../hooks/useGradeProdutos'

export interface GradeProdutosTableProps {
    data: PaginateInterface<GradeProdutoGeradoList> | undefined
    getData: (data: PaginateSearch & GradeProdutosSearch) => void
    setPerPage: (perPage: number) => void
    setPage: (page: number) => void
    page: number
    perPage: number
    filters: GradeProdutosSearch
}

export const GradeProdutosTable = ({ data, getData, setPerPage, perPage, filters }: GradeProdutosTableProps) => {
    const [optPerPage] = useState<PerPageProps[]>([
        { value: 5, label: '5' },
        { value: 10, label: '10' },
        { value: 20, label: '20' },
        { value: 50, label: '50' },
        { value: 100, label: '100' },
    ])

    const handleThisRoute = async (url: string) => {
        try {
            const new_url = new URL(url)
            await getData({
                page: Number(new_url.searchParams.get('page')),
                sku: new_url.searchParams.get('sku') || filters.sku,
                nome_produto: new_url.searchParams.get('nome_produto') || filters.nome_produto,
                codigo_base: new_url.searchParams.get('codigo_base') || filters.codigo_base,
                parte: new_url.searchParams.get('parte') || filters.parte,
                status: new_url.searchParams.get('status') || filters.status,
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
                                                            style={{ width: '100px' }}
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
                                                                <th scope="col" className="text-start">SKU</th>
                                                                <th scope="col" className="text-start">Combinação</th>
                                                                <th scope="col" className="text-start">Nome Produto</th>
                                                                <th scope="col" className="text-start">Código Base</th>
                                                                <th scope="col" className="text-start">Partes</th>
                                                                <th scope="col">Peso</th>
                                                                <th scope="col">Tempo</th>
                                                                <th scope="col">Custo Filamento</th>
                                                                <th scope="col">Custo Energia</th>
                                                                <th scope="col">Custo Desgaste</th>
                                                                <th scope="col">Custo Total</th>
                                                                <th scope="col">Status</th>
                                                                <th scope="col" style={{ width: '120px' }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {data.data.map((row: GradeProdutoGeradoList, index: number) => (
                                                                <tr key={row.id != null ? row.id : index}>
                                                                    <td className="text-start">{row.sku || '—'}</td>
                                                                    <td className="text-start">{row.descricao_combinacao || '—'}</td>
                                                                    <td className="text-start">{row.nome_produto || '—'}</td>
                                                                    <td className="text-start">{row.codigo_base != null ? row.codigo_base : '—'}</td>
                                                                    <td className="text-start">{obterPartesProdutoGerado(row)}</td>
                                                                    <td>{formatarPesoGrade(row.peso_total)}</td>
                                                                    <td>{formatarTempoGrade(row.tempo_total)}</td>
                                                                    <td>{formatarCustoGrade(row.custo_filamento)}</td>
                                                                    <td>{formatarCustoGrade(row.custo_energia)}</td>
                                                                    <td>{formatarCustoGrade(row.custo_desgaste)}</td>
                                                                    <td>{formatarCustoGrade(row.custo_total)}</td>
                                                                    <td>
                                                                        <Badge className={obterClasseBadgeStatusProdutoGerado(row.status)}>
                                                                            {obterLabelStatusProdutoGerado(row.status)}
                                                                        </Badge>
                                                                    </td>
                                                                    <td>
                                                                        {row.id != null ? (
                                                                            <Link
                                                                                to={`/grade-produtos/produto/${row.id}`}
                                                                                className="btn btn-sm btn-soft-primary"
                                                                            >
                                                                                Visualizar
                                                                            </Link>
                                                                        ) : (
                                                                            '—'
                                                                        )}
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
                                                    <li className={data.current_page === 1 ? 'page-item disabled' : 'page-item'}>
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
                                                    <li className={data.current_page === data.last_page ? 'page-item disabled' : 'page-item'}>
                                                        <Link to="#" className="page-link" onClick={() => handleThisRoute(data.links[data.links.length - 1].url)}>Próximo</Link>
                                                    </li>
                                                </ul>
                                            </Col>
                                            <Col xs="12" className="d-block d-sm-none">
                                                <ul className="pagination pagination-md justify-content-center mb-2">
                                                    <li className={data.current_page === 1 ? 'page-item disabled' : 'page-item'}>
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
                                                    <li className={data.current_page === data.last_page ? 'page-item disabled' : 'page-item'}>
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
        </React.Fragment>
    )
}

export default GradeProdutosTable
