import React, { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Alert, Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Container, Row, Spinner
} from 'reactstrap'
import { ComposicaoItemConfigModel, ComposicaoParteConfigView } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { LookupItem } from 'interfaces/Produtos/ProdutosInterface'
import { ComposicaoProdutosService } from 'services/ComposicaoProdutos/ComposicaoProdutosService'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import ComposicaoParteItensCores, { CampoCoresItem } from '../ComposicaoParteItensCores/ComposicaoParteItensCores'
import ComposicaoVariacoesItemTable from '../ComposicaoVariacoesItemTable/ComposicaoVariacoesItemTable'
import {
    atualizarFilamentoVariacaoItem,
    extrairDataRespostaApi,
    extrairVariacoesRespostaApi,
    itemTemCoresConfiguradas,
    mapConfiguracaoParteToItens,
    mapVariacoesApiLista,
    prepararPayloadSalvarCoresParte,
    prepararPayloadSalvarFilamentosParte,
    validarCoresItensParte,
} from '../hooks/useComposicaoProdutos'
import {
    anexarContextoFluxo,
    lerContextoFluxo,
    montarParamsFluxo,
} from 'pages/Pages/FluxoProducao/fluxoProducaoContext'

const ComposicaoParteConfig = () => {
    const { id, idParte } = useParams()
    const [searchParams] = useSearchParams()
    const contextoFluxo = useMemo(() => lerContextoFluxo(searchParams), [searchParams])
    const navigate = useNavigate()
    const { voltarParaRotaAnterior } = useNavegacao()

    const composicaoService = new ComposicaoProdutosService()

    const [loading, setLoading] = useState(true)
    const [preparando, setPreparando] = useState(false)
    const [salvando, setSalvando] = useState(false)
    const [nomeParte, setNomeParte] = useState('')
    const [itensParte, setItensParte] = useState<ComposicaoItemConfigModel[]>([])
    const [variacoesParte, setVariacoesParte] = useState<ReturnType<typeof mapVariacoesApiLista>>([])
    const [coresLookup, setCoresLookup] = useState<LookupItem[]>([])
    const [variacoesGeradas, setVariacoesGeradas] = useState(false)
    const [erro, setErro] = useState('')

    const aplicarConfiguracaoParte = (configParte: ComposicaoParteConfigView) => {
        const itensInicial = mapConfiguracaoParteToItens(configParte)
        const variacoesExistentes = (configParte.itens || []).flatMap((item) => (
            mapVariacoesApiLista(item.variacoes || [], itensInicial)
        ))

        const temVariacoes = variacoesExistentes.length > 0

        setNomeParte(configParte.parte.nome_parte || 'Parte')
        setItensParte(itensInicial)
        setVariacoesParte(temVariacoes ? variacoesExistentes : [])
        setCoresLookup((configParte.cores_disponiveis || []).map((cor) => ({
            id: cor.id,
            descricao: cor.descricao,
            codigo: cor.codigo,
        })))
        setVariacoesGeradas(temVariacoes)
    }

    const loadDados = async () => {
        if (!id || !idParte) return

        const composicaoId = Number(id)
        const parteId = Number(idParte)
        if (Number.isNaN(composicaoId) || Number.isNaN(parteId)) return

        setLoading(true)
        try {
            const configParte = await composicaoService.getConfigurarParte({
                id: composicaoId,
                idParte: parteId,
            })

            if (!configParte) {
                toast.error('Configuração da parte não encontrada.')
                return
            }

            aplicarConfiguracaoParte(configParte)
        } catch (error) {
            console.error('Erro ao carregar configuração da parte:', error)
            toast.error('Erro ao carregar dados.')
        } finally {
            setLoading(false)
        }
    }

    const handleCoresChange = (itemIndex: number, campo: CampoCoresItem, ids: number[]) => {
        setVariacoesGeradas(false)
        setVariacoesParte([])
        setItensParte((prev) => prev.map((item, idx) => (
            idx === itemIndex ? { ...item, [campo]: ids } : item
        )))
    }

    /** Salva cores + gera variações em um único passo do usuário. */
    const prepararConfiguracoes = async () => {
        setErro('')
        const erroValidacao = validarCoresItensParte(itensParte)
        if (erroValidacao) {
            toast.warning(erroValidacao)
            return
        }

        if (!id || !idParte) return

        setPreparando(true)
        try {
            const payloadCores = prepararPayloadSalvarCoresParte(
                Number(id),
                idParte,
                itensParte
            )

            const responseCores = await composicaoService.salvarCoresParte(payloadCores)
            const configParte = extrairDataRespostaApi<ComposicaoParteConfigView>(responseCores)
            if (configParte) {
                aplicarConfiguracaoParte(configParte)
            }

            const responseVariacoes = await composicaoService.gerarVariacoesParte({
                id: Number(id),
                idParte,
            })

            const preview = extrairVariacoesRespostaApi(responseVariacoes, itensParte)

            if (preview.length === 0) {
                toast.warning('Nenhuma configuração gerada. Selecione cores para os itens.')
                setVariacoesGeradas(false)
                setVariacoesParte([])
                return
            }

            setVariacoesParte(preview)
            setVariacoesGeradas(true)
            toast.success('Configurações geradas. Selecione o filamento de cada uma e salve.')
        } catch (error) {
            console.error('Erro ao preparar configurações da parte:', error)
            toast.error('Erro ao gerar configurações da parte.')
        } finally {
            setPreparando(false)
        }
    }

    const handleFilamentoChange = (
        chave: string,
        filamento: {
            id?: string | number | null
            value?: string | number | null
            label?: string
            cor_filamento?: string | null
            preco_medio_grama?: number | string | null
        } | null
    ) => {
        setVariacoesParte((prev) => atualizarFilamentoVariacaoItem(prev, chave, filamento))
    }

    const salvarConfiguracaoParte = async () => {
        setErro('')

        if (!variacoesGeradas || variacoesParte.length === 0) {
            setErro('Gere as configurações antes de salvar os filamentos.')
            return
        }

        const semFilamento = variacoesParte.some((v) => !v.id_filamento)
        if (semFilamento) {
            setErro('Selecione o filamento para todas as configurações.')
            return
        }

        if (!id || !idParte) return

        setSalvando(true)
        try {
            const confirmResponse = await composicaoService.confirmarVariacoes({
                id_composicao: Number(id),
                id_parte: Number(idParte),
            })

            const variacoesConfirmadas = extrairVariacoesRespostaApi(confirmResponse, itensParte)
            const selecoesPorChave = new Map(
                variacoesParte
                    .filter((v) => v.chave)
                    .map((v) => [v.chave!, v])
            )

            const variacoesParaSalvar = variacoesConfirmadas.map((confirmada) => {
                const selecao = confirmada.chave
                    ? selecoesPorChave.get(confirmada.chave)
                    : undefined

                if (!selecao) return confirmada

                return {
                    ...confirmada,
                    id_filamento: selecao.id_filamento,
                    descricao_filamento: selecao.descricao_filamento,
                    cor_filamento: selecao.cor_filamento,
                    preco_medio_grama: selecao.preco_medio_grama,
                    peso: confirmada.peso != null ? confirmada.peso : selecao.peso,
                    custo: selecao.custo,
                }
            })

            const payload = prepararPayloadSalvarFilamentosParte(
                Number(id),
                idParte,
                variacoesParaSalvar
            )

            await composicaoService.salvarFilamentosParte(payload)
            toast.success('Parte salva. Configure as demais ou continue para montagem.')

            const params = montarParamsFluxo(contextoFluxo, {
                composicao: id ? String(id) : contextoFluxo.composicao,
                fluxo: contextoFluxo.fluxo || '1',
            })
            const query = params.toString()
            navigate(query
                ? `/composicao-produtos/view/${id}?${query}`
                : `/composicao-produtos/view/${id}`)
        } catch (error) {
            console.error('Erro ao salvar filamentos:', error)
            setErro('Erro ao salvar configuração. Tente novamente.')
        } finally {
            setSalvando(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/composicao-produtos')
    }, [])

    useEffect(() => {
        loadDados()
    }, [id, idParte])

    const temCoresSelecionadas = itensParte.length > 0
        && itensParte.every((item) => itemTemCoresConfiguradas(item))

    const hrefVoltarView = id
        ? anexarContextoFluxo(
            `/composicao-produtos/view/${id}`,
            { ...contextoFluxo, composicao: String(id) },
            { forcarFluxo: Boolean(contextoFluxo.fluxo || contextoFluxo.produto) }
        )
        : '/composicao-produtos'

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to={hrefVoltarView}>
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-sm-0 ms-3">Configurar Parte — {nomeParte}</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>
                                        <Link to="/composicao-produtos">{DominioProducaoLabels.vinculo}</Link>
                                    </BreadcrumbItem>
                                    {id && (
                                        <BreadcrumbItem>
                                            <Link to={hrefVoltarView}>Visualizar</Link>
                                        </BreadcrumbItem>
                                    )}
                                    <BreadcrumbItem active>Configurar Parte</BreadcrumbItem>
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
                                    ) : (
                                        <>
                                            <p className="text-muted mb-4">
                                                Escolha as cores de cada {DominioProducaoLabels.configuracaoImpressao.toLowerCase()},
                                                gere as opções e selecione o filamento. Tudo em dois passos.
                                            </p>

                                            <h5 className="mb-3">1. Cores por item</h5>
                                            <ComposicaoParteItensCores
                                                nomeParte={nomeParte}
                                                itens={itensParte}
                                                cores={coresLookup}
                                                onCoresChange={handleCoresChange}
                                            />

                                            <div className="d-flex justify-content-end gap-2 mt-3 mb-4">
                                                <Button
                                                    color="primary"
                                                    type="button"
                                                    onClick={prepararConfiguracoes}
                                                    disabled={preparando || !temCoresSelecionadas}
                                                >
                                                    {preparando
                                                        ? 'Gerando...'
                                                        : (variacoesGeradas
                                                            ? 'Atualizar configurações'
                                                            : 'Gerar configurações')}
                                                </Button>
                                            </div>

                                            {variacoesGeradas && (
                                                <>
                                                    <hr />
                                                    <h5 className="mb-3">
                                                        2. Filamento por {DominioProducaoLabels.configuracaoImpressao.toLowerCase()}
                                                    </h5>
                                                    <ComposicaoVariacoesItemTable
                                                        variacoes={variacoesParte}
                                                        onFilamentoChange={handleFilamentoChange}
                                                    />
                                                    <div className="text-muted mt-2 mb-5">
                                                        <strong>Total:</strong> {variacoesParte.length} configuração(ões)
                                                    </div>
                                                </>
                                            )}

                                            {erro && (
                                                <Alert color="danger" className="mt-3">{erro}</Alert>
                                            )}

                                            <hr />
                                            <Row className="mt-4 mb-2">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        {variacoesGeradas && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={salvarConfiguracaoParte}
                                                                disabled={salvando}
                                                            >
                                                                {salvando ? 'Salvando...' : 'Salvar configuração'}
                                                            </button>
                                                        )}
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

export default ComposicaoParteConfig
