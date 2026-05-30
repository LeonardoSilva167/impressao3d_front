import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Badge, Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row, Spinner, Table
} from 'reactstrap'
import { ComposicaoProdutosView } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { ProjetosImpressaoView } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ComposicaoProdutosService } from 'services/ComposicaoProdutos/ComposicaoProdutosService'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import {
    montarPartesResumo,
    normalizarComposicaoView,
    obterClasseBadgeStatus,
    obterLabelStatus,
} from '../hooks/useComposicaoProdutos'

const ComposicaoProdutosViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const composicaoService = new ComposicaoProdutosService()
    const projetosService = new ProjetosImpressaoService()

    const [registro, setRegistro] = useState<ComposicaoProdutosView>()
    const [projeto, setProjeto] = useState<ProjetosImpressaoView>()
    const [loading, setLoading] = useState(true)

    const partesResumo = registro && projeto
        ? montarPartesResumo(
            projeto,
            registro.configuracao_itens || [],
            registro.variacoes_itens || []
        )
        : []

    const loadRegistro = async () => {
        if (!id) return

        const registroId = Number(id)
        if (Number.isNaN(registroId)) return

        setLoading(true)
        try {
            const view = await composicaoService.getViewComposicaoProdutos({ id: registroId })
            if (!view) {
                toast.error('Composição não encontrada.')
                return
            }

            let projetoView: ProjetosImpressaoView | undefined
            if (view.id_projeto_impressao) {
                projetoView = await projetosService.getViewProjetosImpressao({
                    id: Number(view.id_projeto_impressao),
                })
            }

            if (projetoView) setProjeto(projetoView)
            setRegistro(normalizarComposicaoView(view, projetoView))
        } catch (error) {
            console.error('Erro ao carregar composição:', error)
            toast.error('Erro ao carregar composição.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/composicao-produtos')
    }, [])

    useEffect(() => {
        loadRegistro()
    }, [id])

    const obterNomeProjeto = (): string => {
        if (!registro) return '—'
        const partes = [
            registro.codigo_projeto,
            registro.nome_projeto,
            registro.descricao_projeto,
        ].filter(Boolean)
        return partes.length > 0 ? partes.join(' - ') : '—'
    }

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/composicao-produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar Composição do Produto</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/composicao-produtos">Composição do Produto</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>Visualizar</BreadcrumbItem>
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
                                    ) : !registro ? (
                                        <div className="text-center py-5 text-muted">Composição não encontrada.</div>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-end gap-2 mb-4">
                                                <Link
                                                    to={`/composicao-produtos/edit/${registro.id}`}
                                                    className="btn btn-soft-primary"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Editar
                                                </Link>
                                            </div>

                                            <h5 className="mb-3">Dados da Composição</h5>
                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Produto</Label>
                                                    <div>{registro.produto_descricao || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Projeto</Label>
                                                    <div>{obterNomeProjeto()}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Status</Label>
                                                    <div>
                                                        <Badge className={obterClasseBadgeStatus(registro.status)}>
                                                            {obterLabelStatus(registro.status)}
                                                        </Badge>
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <h5 className="mb-3">Partes do Projeto</h5>

                                            {partesResumo.length === 0 ? (
                                                <p className="text-muted">Nenhuma parte encontrada no projeto.</p>
                                            ) : (
                                                <div className="table-responsive">
                                                    <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                                        <thead className="table-light">
                                                            <tr>
                                                                <th>Parte</th>
                                                                <th>Quantidade de Itens</th>
                                                                <th style={{ width: '200px' }}>Ação</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {partesResumo.map((parte) => (
                                                                <tr key={String(parte.id_projeto_impressao_parte)}>
                                                                    <td>{parte.nome_parte}</td>
                                                                    <td>{parte.quantidade_itens ?? 0}</td>
                                                                    <td>
                                                                        <Link
                                                                            to={`/composicao-produtos/${registro.id}/parte/${parte.id_projeto_impressao_parte}/configurar`}
                                                                            className="btn btn-sm btn-primary"
                                                                        >
                                                                            <i className="ri-settings-3-line me-1"></i>
                                                                            Configurar Parte
                                                                        </Link>
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

export default ComposicaoProdutosViewPage
