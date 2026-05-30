import React, { useEffect, useMemo, useState } from 'react'
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
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'
import { ProjetosImpressaoView } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import { normalizarPartesProjeto, normalizarProjetoImpressao, calcularResumoPartesItens } from '../hooks/useProjetosImpressao'
import PartesProjetoTable from '../PartesProjetoTable/PartesProjetoTable'
import ResumoCustosProducao from 'Components/Common/ResumoCustosProducao'
import { extrairCustosProducao } from 'helpers/custosProducao_helpers'

const ProjetosImpressaoViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const projetosImpressaoService = new ProjetosImpressaoService()

    const [projeto, setProjeto] = useState<ProjetosImpressaoView>()
    const [partes, setPartes] = useState<ParteProjetoImpressaoModel[]>([])
    const [loading, setLoading] = useState(true)
    const resumoProjeto = useMemo(() => calcularResumoPartesItens(partes), [partes])
    const custosProjeto = useMemo(() => extrairCustosProducao(projeto), [projeto])

    const loadProjeto = async () => {
        if (!id) return

        const projetoId = Number(id)
        if (Number.isNaN(projetoId)) return

        setLoading(true)
        try {
            const view = await projetosImpressaoService.getViewProjetosImpressao({ id: projetoId })
            if (view) {
                const projetoNormalizado = normalizarProjetoImpressao(view)
                setProjeto(projetoNormalizado)
                setPartes(normalizarPartesProjeto(projetoNormalizado.partes || []))
            }
        } catch (error) {
            console.error('Erro ao carregar projeto:', error)
            toast.error('Erro ao carregar projeto de impressão.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/projetos-impressao')
    }, [])

    useEffect(() => {
        loadProjeto()
    }, [id])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/projetos-impressao"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Visualizar Projeto de Impressão</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produção</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/projetos-impressao">Projetos de Impressão</Link></BreadcrumbItem>
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
                                    ) : !projeto ? (
                                        <div className="text-center py-5 text-muted">Projeto não encontrado.</div>
                                    ) : (
                                        <>
                                            <div className="d-flex justify-content-end gap-2 mb-4">
                                                <Link
                                                    to={`/projetos-impressao/edit/${projeto.id}`}
                                                    className="btn btn-soft-primary"
                                                >
                                                    <i className="ri-edit-line me-1"></i> Editar Projeto
                                                </Link>
                                            </div>

                                            <h5 className="mb-3">Dados do Projeto</h5>
                                            <Row>
                                                <Col md={6} className="mb-3">
                                                    <Label className="form-label fw-semibold">URL Projeto</Label>
                                                    <div>
                                                        {projeto.url_projeto ? (
                                                            <a href={projeto.url_projeto} target="_blank" rel="noreferrer">
                                                                {projeto.url_projeto}
                                                            </a>
                                                        ) : '—'}
                                                    </div>
                                                </Col>
                                                <Col md={6} className="mb-3">
                                                    <Label className="form-label fw-semibold">Nome Original</Label>
                                                    <div>{projeto.nome_original_projeto || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Código Projeto</Label>
                                                    <div>{projeto.codigo_projeto || '—'}</div>
                                                </Col>
                                                <Col md={8} className="mb-3">
                                                    <Label className="form-label fw-semibold">Descrição/Apelido</Label>
                                                    <div>{projeto.descricao_projeto || '—'}</div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            {projeto.id && (
                                                <>
                                                    <PartesProjetoTable
                                                        projetoId={projeto.id}
                                                        partes={partes}
                                                        onReload={loadProjeto}
                                                    />

                                                    <div className="mt-4">
                                                        <ResumoCustosProducao
                                                            pesoTotal={resumoProjeto.pesoTotal}
                                                            tempoTotal={resumoProjeto.tempoTotal}
                                                            custos={custosProjeto}
                                                        />
                                                    </div>
                                                </>
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

export default ProjetosImpressaoViewPage
