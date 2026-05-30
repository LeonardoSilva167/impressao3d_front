import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Col,
    Container,
    Label,
    Row,
    Spinner,
} from 'reactstrap'
import { ModelosProdutosView } from 'interfaces/ModelosProdutos/ModelosProdutosInterface'
import { ModelosProdutosService } from 'services/ModelosProdutos/ModelosProdutosService'

const ModelosProdutosViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const modelosProdutosService = new ModelosProdutosService()

    const [registro, setRegistro] = useState<ModelosProdutosView>()
    const [loading, setLoading] = useState(true)

    const loadRegistro = async () => {
        if (!id) return

        const registroId = Number(id)
        if (Number.isNaN(registroId)) return

        setLoading(true)
        try {
            const view = await modelosProdutosService.getViewModelosProdutos({ id: registroId })
            if (view) setRegistro(view)
        } catch (error) {
            console.error('Erro ao carregar modelo:', error)
            toast.error('Erro ao carregar modelo de produto.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/modelos-produtos')
    }, [])

    useEffect(() => {
        loadRegistro()
    }, [id])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/modelos-produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar Modelo de Produto</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/modelos-produtos">Modelos</Link></BreadcrumbItem>
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
                                        <div className="text-center py-5 text-muted">Modelo de produto não encontrado.</div>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-end gap-2 mb-4">
                                                <Link
                                                    to={`/modelos-produtos/edit/${registro.id}`}
                                                    className="btn btn-soft-primary"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Editar
                                                </Link>
                                            </div>

                                            <h5 className="mb-3">Dados do Modelo</h5>
                                            <Row>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Código</Label>
                                                    <div>{registro.codigo || '—'}</div>
                                                </Col>
                                                <Col md={8} className="mb-3">
                                                    <Label className="form-label fw-semibold">Descrição</Label>
                                                    <div>{registro.descricao || '—'}</div>
                                                </Col>
                                            </Row>

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

export default ModelosProdutosViewPage
