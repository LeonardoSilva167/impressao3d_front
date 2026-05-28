import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { formatarParaMoedaSemSimbolo, useNavegacao } from 'helpers/functions_helpers'
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Label,
    Row,
    Spinner,
} from 'reactstrap'
import { CorProjetoModel } from 'interfaces/ProjetosImpressao/CorProjetoInterface'
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'
import { ProjetosImpressaoView } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import {
    calcularCustoTotalFilamentos,
    formatarNumeroDecimal,
    normalizarCoresProjeto,
    obterValorNumerico,
} from '../hooks/useProjetosImpressao'
import FilamentosProjetoTable from '../FilamentosProjetoTable/FilamentosProjetoTable'
import PartesProjetoTable from '../PartesProjetoTable/PartesProjetoTable'

const ProjetosImpressaoViewPage = () => {
    const { id } = useParams()
    const { voltarParaRotaAnterior } = useNavegacao()
    const projetosImpressaoService = new ProjetosImpressaoService()

    const [projeto, setProjeto] = useState<ProjetosImpressaoView>()
    const [partes, setPartes] = useState<ParteProjetoImpressaoModel[]>([])
    const [filamentos, setFilamentos] = useState<CorProjetoModel[]>([])
    const [loading, setLoading] = useState(true)
    const [savingPartes, setSavingPartes] = useState(false)

    const loadProjeto = async () => {
        if (!id) return

        setLoading(true)
        try {
            const view = await projetosImpressaoService.getViewProjetosImpressao({ id: Number(id) })
            if (view) {
                setProjeto(view)
                setFilamentos(normalizarCoresProjeto(view.cores ? view.cores : []))
                setPartes(view.partes ? view.partes : [])
            }
        } catch (error) {
            console.error('Erro ao carregar projeto:', error)
            toast.error('Erro ao carregar projeto de impressão.')
        } finally {
            setLoading(false)
        }
    }

    const salvarPartes = async () => {
        if (!projeto || !projeto.id) return

        setSavingPartes(true)
        try {
            await projetosImpressaoService.editProjetosImpressao({
                id: projeto.id,
                projeto_impressao_id: projeto.id,
                url_projeto: projeto.url_projeto,
                nome_original_projeto: projeto.nome_original_projeto,
                codigo_projeto: projeto.codigo_projeto,
                descricao_projeto: projeto.descricao_projeto,
                bico_padrao: projeto.bico_padrao,
                tempo_total_projeto: projeto.tempo_total_projeto,
                peso_total_projeto: projeto.peso_total_projeto,
                cores: filamentos.map(({ id_cor, id_filamento, peso_gramas }) => ({
                    id_cor,
                    id_filamento,
                    peso_gramas,
                })),
                partes,
            })
            toast.success('Partes salvas com sucesso.')
            await loadProjeto()
        } catch (error) {
            console.error('Erro ao salvar partes:', error)
            toast.error('Erro ao salvar partes do projeto.')
        } finally {
            setSavingPartes(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/projetos-impressao')
    }, [])

    useEffect(() => {
        loadProjeto()
    }, [id])

    const custoFilamentos = calcularCustoTotalFilamentos(filamentos)
    const custoEstimado = projeto && projeto.custo_estimado != null
        ? obterValorNumerico(projeto.custo_estimado)
        : custoFilamentos

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
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Bico Padrão</Label>
                                                    <div>{projeto.bico_padrao || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Tempo Total</Label>
                                                    <div>{projeto.tempo_total_projeto || '—'}</div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Peso Total</Label>
                                                    <div>
                                                        {projeto.peso_total_projeto != null
                                                            ? `${formatarNumeroDecimal(obterValorNumerico(projeto.peso_total_projeto))}g`
                                                            : '—'}
                                                    </div>
                                                </Col>
                                                <Col md={4} className="mb-3">
                                                    <Label className="form-label fw-semibold">Custo Estimado</Label>
                                                    <div>R$ {formatarParaMoedaSemSimbolo(custoEstimado)}</div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <FilamentosProjetoTable
                                                filamentos={filamentos}
                                                onChange={setFilamentos}
                                                pesoTotalProjeto={projeto.peso_total_projeto}
                                                readOnly
                                            />

                                            <hr />
                                            <PartesProjetoTable
                                                partes={partes}
                                                onChange={setPartes}
                                                bicoPadrao={projeto.bico_padrao}
                                                modoView
                                            />

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <Button
                                                            color="primary"
                                                            type="button"
                                                            disabled={savingPartes}
                                                            onClick={salvarPartes}
                                                        >
                                                            {savingPartes ? (
                                                                <>
                                                                    <Spinner size="sm" className="me-2" />
                                                                    Salvando...
                                                                </>
                                                            ) : (
                                                                'Salvar Partes'
                                                            )}
                                                        </Button>
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
