import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Alert, Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Container, Row, Spinner
} from 'reactstrap'
import { ComposicaoItemConfigModel, ComposicaoProdutosModel } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { LookupItem } from 'interfaces/Produtos/ProdutosInterface'
import { ProjetosImpressaoView } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ComposicaoProdutosService } from 'services/ComposicaoProdutos/ComposicaoProdutosService'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import { CoresService } from 'services/Cores/CoresService'
import ComposicaoParteItensCores, { CampoCoresItem } from '../ComposicaoParteItensCores/ComposicaoParteItensCores'
import ComposicaoVariacoesItemTable from '../ComposicaoVariacoesItemTable/ComposicaoVariacoesItemTable'
import {
    atualizarFilamentoVariacaoItem,
    filtrarItensConfigPorParte,
    gerarVariacoesIndividuaisItens,
    itemTemCoresConfiguradas,
    mesclarConfiguracaoItens,
    mesclarVariacoesItens,
    montarItensConfigFromProjeto,
    normalizarComposicaoView,
    obterParteProjeto,
    prepararPayloadSalvar,
    validarCoresItensParte,
} from '../hooks/useComposicaoProdutos'

const ComposicaoParteConfig = () => {
    const { id, idParte } = useParams()
    const navigate = useNavigate()
    const { voltarParaRotaAnterior } = useNavegacao()

    const composicaoService = new ComposicaoProdutosService()
    const projetosService = new ProjetosImpressaoService()
    const coresService = new CoresService()

    const [loading, setLoading] = useState(true)
    const [salvandoCores, setSalvandoCores] = useState(false)
    const [salvandoFilamentos, setSalvandoFilamentos] = useState(false)
    const [projeto, setProjeto] = useState<ProjetosImpressaoView>()
    const [nomeParte, setNomeParte] = useState('')
    const [configuracaoCompleta, setConfiguracaoCompleta] = useState<ComposicaoItemConfigModel[]>([])
    const [itensParte, setItensParte] = useState<ComposicaoItemConfigModel[]>([])
    const [variacoesParte, setVariacoesParte] = useState<ReturnType<typeof gerarVariacoesIndividuaisItens>>([])
    const [variacoesOutrasPartes, setVariacoesOutrasPartes] = useState<ReturnType<typeof gerarVariacoesIndividuaisItens>>([])
    const [coresLookup, setCoresLookup] = useState<LookupItem[]>([])
    const [coresSalvas, setCoresSalvas] = useState(false)
    const [variacoesGeradas, setVariacoesGeradas] = useState(false)
    const [composicaoBase, setComposicaoBase] = useState<ComposicaoProdutosModel | null>(null)
    const [erro, setErro] = useState('')

    const loadCores = async () => {
        const list = await coresService.AsyncListCores({})
        if (list) {
            setCoresLookup(list.map((cor) => ({
                id: cor.id,
                descricao: cor.descricao,
                codigo: cor.codigo,
            })))
        }
    }

    const loadDados = async () => {
        if (!id || !idParte) return

        const composicaoId = Number(id)
        const parteId = idParte
        if (Number.isNaN(composicaoId)) return

        setLoading(true)
        try {
            const view = await composicaoService.getViewComposicaoProdutos({ id: composicaoId })
            if (!view || !view.id_projeto_impressao) {
                toast.error('Composição não encontrada.')
                return
            }

            const projetoView = await projetosService.getViewProjetosImpressao({
                id: Number(view.id_projeto_impressao),
            })
            if (!projetoView) {
                toast.error('Projeto não encontrado.')
                return
            }

            const parte = obterParteProjeto(projetoView, parteId)
            if (!parte) {
                toast.error('Parte não encontrada no projeto.')
                return
            }

            const normalizada = normalizarComposicaoView(view, projetoView)
            let config = normalizada.configuracao_itens || []

            if (config.length === 0) {
                config = montarItensConfigFromProjeto(projetoView)
            }

            const itensDaParte = filtrarItensConfigPorParte(config, parteId)
            const configMap = new Map<string, ComposicaoItemConfigModel>()
            config.forEach((item) => {
                if (item.id_projeto_impressao_parte_item != null) {
                    configMap.set(String(item.id_projeto_impressao_parte_item), item)
                }
            })

            const itensInicial = (parte.itens || []).map((itemProjeto) => {
                const existente = configMap.get(String(itemProjeto.id))
                const peso = itemProjeto.peso_total != null
                    ? Number(itemProjeto.peso_total)
                    : 0

                return existente || {
                    id_projeto_impressao_parte: parte.id,
                    id_projeto_impressao_parte_item: itemProjeto.id,
                    nome_parte: parte.nome_parte || '',
                    nome_item: itemProjeto.nome_item || '',
                    peso,
                    tempo: itemProjeto.tempo_impressao || null,
                    cores_primarias: [],
                    cores_secundarias: [],
                    cores_terciarias: [],
                }
            })

            const todasVariacoes = normalizada.variacoes_itens || []
            const variacoesDaParte = todasVariacoes.filter(
                (v) => String(v.id_projeto_impressao_parte) === String(parteId)
            )
            const outras = todasVariacoes.filter(
                (v) => String(v.id_projeto_impressao_parte) !== String(parteId)
            )

            const temCores = itensInicial.length > 0
                && itensInicial.every((item) => itemTemCoresConfiguradas(item))

            setProjeto(projetoView)
            setNomeParte(parte.nome_parte || 'Parte')
            setConfiguracaoCompleta(config)
            setItensParte(itensInicial)
            setVariacoesOutrasPartes(outras)
            setVariacoesParte(variacoesDaParte)
            setCoresSalvas(temCores)
            setVariacoesGeradas(variacoesDaParte.length > 0)
            setComposicaoBase({
                id: normalizada.id,
                id_produto_base: normalizada.id_produto_base,
                id_projeto_impressao: normalizada.id_projeto_impressao,
            })
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
        setCoresSalvas(false)
        setItensParte((prev) => prev.map((item, idx) => (
            idx === itemIndex ? { ...item, [campo]: ids } : item
        )))
    }

    const salvarCores = async () => {
        setErro('')
        const erroValidacao = validarCoresItensParte(itensParte)
        if (erroValidacao) {
            toast.warning(erroValidacao)
            return
        }

        if (!composicaoBase) return

        setSalvandoCores(true)
        try {
            const novaConfig = mesclarConfiguracaoItens(configuracaoCompleta, itensParte)
            const payload = prepararPayloadSalvar({
                ...composicaoBase,
                configuracao_itens: novaConfig,
                variacoes_itens: mesclarVariacoesItens(variacoesOutrasPartes, idParte!, variacoesParte),
            })

            await composicaoService.editComposicaoProdutos(payload)
            setConfiguracaoCompleta(novaConfig)
            setCoresSalvas(true)
            toast.success('Cores salvas com sucesso.')
        } catch (error) {
            console.error('Erro ao salvar cores:', error)
            toast.error('Erro ao salvar cores.')
        } finally {
            setSalvandoCores(false)
        }
    }

    const handleGerarVariacoes = () => {
        setErro('')
        if (!coresSalvas) {
            toast.warning('Salve as cores antes de gerar as variações.')
            return
        }

        const erroValidacao = validarCoresItensParte(itensParte)
        if (erroValidacao) {
            toast.warning(erroValidacao)
            return
        }

        const preview = gerarVariacoesIndividuaisItens(
            itensParte,
            coresLookup,
            variacoesParte
        )

        if (preview.length === 0) {
            toast.warning('Nenhuma variação gerada. Selecione cores para os itens.')
            return
        }

        setVariacoesParte(preview)
        setVariacoesGeradas(true)
        toast.info('Variações individuais geradas. Configure os filamentos e salve.')
    }

    const handleFilamentoChange = (
        chave: string,
        filamento: {
            id?: string | number | null
            label?: string
            cor_filamento?: string | null
            preco_medio_grama?: number | string | null
        } | null
    ) => {
        setVariacoesParte((prev) => atualizarFilamentoVariacaoItem(prev, chave, filamento))
    }

    const salvarFilamentos = async () => {
        setErro('')

        if (!variacoesGeradas || variacoesParte.length === 0) {
            setErro('Gere as variações antes de salvar os filamentos.')
            return
        }

        const semFilamento = variacoesParte.some((v) => !v.id_filamento)
        if (semFilamento) {
            setErro('Selecione o filamento para todas as variações.')
            return
        }

        if (!composicaoBase || !idParte) return

        setSalvandoFilamentos(true)
        try {
            const novaConfig = mesclarConfiguracaoItens(configuracaoCompleta, itensParte)
            const todasVariacoes = mesclarVariacoesItens(
                variacoesOutrasPartes,
                idParte,
                variacoesParte
            )

            const payload = prepararPayloadSalvar({
                ...composicaoBase,
                configuracao_itens: novaConfig,
                variacoes_itens: todasVariacoes,
            })

            await composicaoService.editComposicaoProdutos(payload)
            toast.success('Configuração da parte salva com sucesso.')
            navigate(`/composicao-produtos/view/${id}`)
        } catch (error) {
            console.error('Erro ao salvar filamentos:', error)
            setErro('Erro ao salvar configuração. Tente novamente.')
        } finally {
            setSalvandoFilamentos(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/composicao-produtos')
    }, [])

    useEffect(() => {
        loadCores()
        loadDados()
    }, [id, idParte])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to={id ? `/composicao-produtos/view/${id}` : '/composicao-produtos'}>
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-sm-0 ms-3">Configurar Parte — {nomeParte}</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/composicao-produtos">Composição do Produto</Link></BreadcrumbItem>
                                    {id && (
                                        <BreadcrumbItem>
                                            <Link to={`/composicao-produtos/view/${id}`}>Visualizar</Link>
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
                                                Configure as cores de cada item desta parte, gere as variações
                                                individuais e selecione o filamento de cada uma.
                                            </p>

                                            <h5 className="mb-3">Itens da Parte</h5>
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
                                                    onClick={salvarCores}
                                                    disabled={salvandoCores}
                                                >
                                                    {salvandoCores ? 'Salvando...' : 'Salvar Cores'}
                                                </Button>
                                            </div>

                                            {coresSalvas && (
                                                <>
                                                    <hr />
                                                    <div className="d-flex justify-content-end mb-3">
                                                        <Button
                                                            color="info"
                                                            type="button"
                                                            onClick={handleGerarVariacoes}
                                                        >
                                                            <i className="ri-stack-line me-1"></i>
                                                            Gerar Variações
                                                        </Button>
                                                    </div>
                                                </>
                                            )}

                                            {variacoesGeradas && (
                                                <>
                                                    <h5 className="mb-3">Variações Individuais dos Itens</h5>
                                                    <ComposicaoVariacoesItemTable
                                                        variacoes={variacoesParte}
                                                        onFilamentoChange={handleFilamentoChange}
                                                    />
                                                    <div className="text-muted mt-2">
                                                        <strong>Total:</strong> {variacoesParte.length} variação(ões)
                                                    </div>
                                                </>
                                            )}

                                            {erro && (
                                                <Alert color="danger" className="mt-3">{erro}</Alert>
                                            )}

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        {variacoesGeradas && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={salvarFilamentos}
                                                                disabled={salvandoFilamentos}
                                                            >
                                                                {salvandoFilamentos ? 'Salvando...' : 'Salvar Parte'}
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
