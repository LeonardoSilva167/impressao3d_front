import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container,
    Label, Row, Spinner, Table
} from 'reactstrap'
import { GradeProdutoGeradoView } from 'interfaces/GradeProdutos/GradeProdutosInterface'
import { GradeProdutosService } from 'services/GradeProdutos/GradeProdutosService'
import {
    formatarCustoGrade,
    formatarPesoGrade,
} from '../hooks/useGradeProdutos'
import ResumoCustosProducao from 'Components/Common/ResumoCustosProducao'
import { extrairCustosProducao } from 'helpers/custosProducao_helpers'

const GradeProdutoGeradoViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const gradeService = new GradeProdutosService()

    const [produto, setProduto] = useState<GradeProdutoGeradoView>()
    const [loading, setLoading] = useState(true)

    const loadProduto = async () => {
        if (!id) return

        const produtoId = Number(id)
        if (Number.isNaN(produtoId)) return

        setLoading(true)
        try {
            const view = await gradeService.getViewProdutoGerado({ id: produtoId })
            if (!view) {
                toast.error('Produto não encontrado.')
                return
            }
            setProduto(view)
        } catch (error) {
            console.error('Erro ao carregar produto:', error)
            toast.error('Erro ao carregar produto.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/grade-produtos')
    }, [])

    useEffect(() => {
        loadProduto()
    }, [id])

    const partes = produto?.partes_utilizadas || []
    const itens = produto?.itens_utilizados || []
    const filamentos = produto?.filamentos_utilizados || []
    const cores = produto?.cores_utilizadas || []

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/grade-produtos">
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar Produto Gerado</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/grade-produtos">Grade de Produtos</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>Produto Gerado</BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : !produto ? (
                                        <div className="text-center py-5 text-muted">Produto não encontrado.</div>
                                    ) : (
                                        <>
                                            <h5 className="mb-3">{produto.nome_produto || 'Produto'}</h5>
                                            <Row className="mb-4">
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">SKU</Label>
                                                    <div>{produto.sku || '—'}</div>
                                                </Col>
                                            </Row>

                                            <ResumoCustosProducao
                                                pesoTotal={produto.peso_total}
                                                tempoTotal={produto.tempo_total || undefined}
                                                custos={extrairCustosProducao(produto)}
                                                className="mb-4"
                                            />

                                            <hr />
                                            <h5 className="mb-3">Partes utilizadas</h5>
                                            {partes.length === 0 ? (
                                                <p className="text-muted">Nenhuma parte registrada.</p>
                                            ) : (
                                                <div className="table-responsive mb-4">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Parte</th>
                                                                <th>Cor</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {partes.map((parte, index) => (
                                                                <tr key={index}>
                                                                    <td>{parte.nome_parte || '—'}</td>
                                                                    <td>{parte.cor || '—'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}

                                            <h5 className="mb-3">Itens utilizados</h5>
                                            {itens.length === 0 ? (
                                                <p className="text-muted">Nenhum item registrado.</p>
                                            ) : (
                                                <div className="table-responsive mb-4">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Parte</th>
                                                                <th>Item</th>
                                                                <th>Cor</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {itens.map((item, index) => (
                                                                <tr key={index}>
                                                                    <td>{item.nome_parte || '—'}</td>
                                                                    <td>{item.nome_item || '—'}</td>
                                                                    <td>{item.cor || '—'}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}

                                            <h5 className="mb-3">Filamentos utilizados</h5>
                                            {filamentos.length === 0 ? (
                                                <p className="text-muted">Nenhum filamento registrado.</p>
                                            ) : (
                                                <div className="table-responsive mb-4">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Filamento</th>
                                                                <th>Peso</th>
                                                                <th>Custo</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {filamentos.map((filamento, index) => (
                                                                <tr key={index}>
                                                                    <td>{filamento.descricao || '—'}</td>
                                                                    <td>{formatarPesoGrade(filamento.peso)}</td>
                                                                    <td>{formatarCustoGrade(filamento.custo)}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}

                                            <h5 className="mb-3">Cores utilizadas</h5>
                                            {cores.length === 0 ? (
                                                <p className="text-muted">Nenhuma cor registrada.</p>
                                            ) : (
                                                <div className="table-responsive mb-4">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Descrição</th>
                                                                <th>Código</th>
                                                                <th>Cor</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {cores.map((cor, index) => (
                                                                <tr key={index}>
                                                                    <td>{cor.descricao || '—'}</td>
                                                                    <td>{cor.codigo || '—'}</td>
                                                                    <td>
                                                                        {cor.hexadecimal ? (
                                                                            <span className="d-inline-flex align-items-center gap-2">
                                                                                <span
                                                                                    style={{
                                                                                        display: 'inline-block',
                                                                                        width: 20,
                                                                                        height: 20,
                                                                                        borderRadius: 4,
                                                                                        backgroundColor: cor.hexadecimal,
                                                                                        border: '1px solid #dee2e6',
                                                                                    }}
                                                                                />
                                                                                {cor.hexadecimal}
                                                                            </span>
                                                                        ) : '—'}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </Table>
                                                </div>
                                            )}

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            type="button"
                                                            className="btn btn-soft-success"
                                                            onClick={voltarParaRotaAnterior}
                                                        >
                                                            Voltar
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default GradeProdutoGeradoViewPage
