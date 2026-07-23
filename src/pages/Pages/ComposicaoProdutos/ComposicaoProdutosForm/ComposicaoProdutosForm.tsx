import React, { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Alert, Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row, Spinner
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { ComposicaoProdutosModel } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { ProdutosList } from 'interfaces/Produtos/ProdutosInterface'
import { ProjetosImpressaoModel } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ComposicaoProdutosService } from 'services/ComposicaoProdutos/ComposicaoProdutosService'
import { ProdutosService } from 'services/ProdutosService/ProdutosService'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import { prepararPayloadSalvar } from '../hooks/useComposicaoProdutos'
import {
    estaNoFluxoGuiado,
    lerContextoFluxo,
    montarParamsFluxo,
} from 'pages/Pages/FluxoProducao/fluxoProducaoContext'
import { montarHrefEtapaFluxo } from 'pages/Pages/FluxoProducao/fluxoProducaoConfig'

interface ComposicaoFormFields {
    id_produto_base: string | number | null
    id_projeto_impressao: string | number | null
}

const formatarLabelProduto = (produto: {
    id?: number | string
    sku_base?: string | null
    descricao_produto?: string | null
}): string => {
    if (produto.sku_base) {
        return `${produto.sku_base} - ${produto.descricao_produto || ''}`
    }
    return produto.descricao_produto || String(produto.id || '')
}

const formatarLabelProjeto = (projeto: {
    id?: number | string
    codigo_projeto?: string | null
    nome_original_projeto?: string | null
    descricao_projeto?: string | null
}): string => {
    const label = [
        projeto.codigo_projeto,
        projeto.nome_original_projeto,
        projeto.descricao_projeto,
    ].filter(Boolean).join(' - ')

    return label || String(projeto.id || '')
}

const ComposicaoProdutosForm = () => {
    const { id } = useParams()
    const { state } = useLocation()
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { voltarParaRotaAnterior } = useNavegacao()
    const contextoFluxo = useMemo(() => lerContextoFluxo(searchParams), [searchParams])
    const noFluxoGuiado = estaNoFluxoGuiado(contextoFluxo)

    const composicaoService = new ComposicaoProdutosService()
    const produtosService = new ProdutosService()
    const projetosService = new ProjetosImpressaoService()

    const isEditing = Boolean(id)
    const [loading, setLoading] = useState(isEditing)
    const [salvando, setSalvando] = useState(false)
    const [produtoDefaultOption, setProdutoDefaultOption] = useState<SelectOptions | undefined>()
    const [projetoDefaultOption, setProjetoDefaultOption] = useState<SelectOptions | undefined>()
    const [produtoSelectKey, setProdutoSelectKey] = useState(0)
    const [projetoSelectKey, setProjetoSelectKey] = useState(0)

    const { control, setValue, handleSubmit } = useForm<ComposicaoFormFields>({
        defaultValues: {
            id_produto_base: null,
            id_projeto_impressao: null,
        },
    })

    const aplicarProdutoBase = (produtoId: string | number, label?: string) => {
        setValue('id_produto_base', produtoId)
        if (label) {
            setProdutoDefaultOption({ value: produtoId, label })
            setProdutoSelectKey((prev) => prev + 1)
        }
    }

    const aplicarProjetoImpressao = (projetoId: string | number, label?: string) => {
        setValue('id_projeto_impressao', projetoId)
        if (label) {
            setProjetoDefaultOption({ value: projetoId, label })
            setProjetoSelectKey((prev) => prev + 1)
        }
    }

    const getListProdutos = async (inputValue: string): Promise<SelectOptions[]> => {
        const list = await produtosService.AsyncListProdutos({ palavra_chave: inputValue })
        if (!list) return [{ value: '', label: 'Selecione' }]
        return [
            { value: '', label: 'Selecione' },
            ...list.map((item: ProdutosList) => ({
                value: item.id,
                label: formatarLabelProduto(item),
            })),
        ]
    }

    const getListProjetos = async (inputValue: string): Promise<SelectOptions[]> => {
        const list = await projetosService.AsyncListProjetosImpressao({ palavra_chave: inputValue })
        if (!list) return [{ value: '', label: 'Selecione' }]
        return [
            { value: '', label: 'Selecione' },
            ...list.map((item: ProjetosImpressaoModel) => ({
                value: item.id,
                label: formatarLabelProjeto(item),
            })),
        ]
    }

    const loadRecord = async () => {
        if (!id) return

        const registroId = Number(id)
        if (Number.isNaN(registroId)) return

        setLoading(true)
        try {
            const view = await composicaoService.getViewComposicaoProdutos({ id: registroId })
            if (!view) {
                toast.error('Vínculo não encontrado.')
                return
            }
            if (view.id_produto_base) {
                aplicarProdutoBase(
                    view.id_produto_base,
                    formatarLabelProduto({
                        id: view.id_produto_base,
                        sku_base: view.sku_base,
                        descricao_produto: view.produto_descricao,
                    })
                )
            }
            if (view.id_projeto_impressao) {
                aplicarProjetoImpressao(
                    view.id_projeto_impressao,
                    formatarLabelProjeto({
                        id: view.id_projeto_impressao,
                        codigo_projeto: view.codigo_projeto,
                        nome_original_projeto: view.nome_projeto,
                        descricao_projeto: view.descricao_projeto,
                    })
                )
            }
        } catch (error) {
            console.error('Erro ao carregar vínculo:', error)
            toast.error('Erro ao carregar vínculo.')
        } finally {
            setLoading(false)
        }
    }

    const precarregarProdutoDoFluxo = async () => {
        const produtoQuery = searchParams.get('produto')
        const produtoState = state && state.source
            ? (state.source.id_produto_base || state.source.id)
            : null
        const produtoId = produtoQuery || produtoState
        if (!produtoId) return

        const idNumerico = Number(produtoId)
        if (Number.isNaN(idNumerico)) {
            aplicarProdutoBase(produtoId)
            return
        }

        try {
            const view = await produtosService.getViewProdutos({ id: idNumerico })
            if (view) {
                aplicarProdutoBase(
                    view.id || idNumerico,
                    formatarLabelProduto({
                        id: view.id || idNumerico,
                        sku_base: view.sku_base,
                        descricao_produto: view.descricao_produto,
                    })
                )
                return
            }
        } catch (error) {
            console.error('Erro ao pré-carregar produto do fluxo:', error)
        }

        aplicarProdutoBase(idNumerico, `Produto #${idNumerico}`)
    }

    const precarregarProjetoDoFluxo = async () => {
        const projetoQuery = searchParams.get('projeto')
        // location.state: vínculo parcial (id_projeto_impressao) ou o próprio projeto (id)
        const source = state && state.source ? state.source : null
        const projetoState = source
            ? (source.id_projeto_impressao || (
                source.id && !source.id_produto_base ? source.id : null
            ))
            : null
        const projetoId = projetoQuery || projetoState
        if (!projetoId) return

        const idNumerico = Number(projetoId)
        if (Number.isNaN(idNumerico)) {
            aplicarProjetoImpressao(projetoId)
            return
        }

        try {
            const view = await projetosService.getViewProjetosImpressao({ id: idNumerico })
            if (view) {
                aplicarProjetoImpressao(
                    view.id || idNumerico,
                    formatarLabelProjeto({
                        id: view.id || idNumerico,
                        codigo_projeto: view.codigo_projeto,
                        nome_original_projeto: view.nome_original_projeto,
                        descricao_projeto: view.descricao_projeto,
                    })
                )
                return
            }
        } catch (error) {
            console.error('Erro ao pré-carregar projeto do fluxo:', error)
        }

        aplicarProjetoImpressao(idNumerico, `Projeto #${idNumerico}`)
    }

    const navegarParaViewVinculo = (composicaoId: number | string, data: ComposicaoFormFields) => {
        const params = montarParamsFluxo(contextoFluxo, {
            produto: data.id_produto_base != null
                ? String(data.id_produto_base)
                : contextoFluxo.produto,
            projeto: data.id_projeto_impressao != null
                ? String(data.id_projeto_impressao)
                : contextoFluxo.projeto,
            composicao: String(composicaoId),
            fluxo: noFluxoGuiado ? '1' : contextoFluxo.fluxo,
        })
        // No fluxo guiado sempre preserva query; fora do fluxo ainda abre a view (nunca a listagem após create).
        const query = params.toString()
        navigate(query
            ? `/composicao-produtos/view/${composicaoId}?${query}`
            : `/composicao-produtos/view/${composicaoId}`)
    }

    const hrefVoltar = noFluxoGuiado && !isEditing
        ? montarHrefEtapaFluxo(2, contextoFluxo)
        : '/composicao-produtos'

    const onSubmit = async (data: ComposicaoFormFields) => {
        setSalvando(true)
        try {
            const payload = prepararPayloadSalvar({
                id: isEditing ? Number(id) : null,
                id_produto_base: data.id_produto_base,
                id_projeto_impressao: data.id_projeto_impressao,
                configuracao_itens: [],
                variacoes_itens: [],
            } as ComposicaoProdutosModel)

            if (isEditing) {
                await composicaoService.editComposicaoProdutos(payload)
                toast.success('Vínculo atualizado com sucesso.')
                navegarParaViewVinculo(id!, data)
                return
            }

            const newId = await composicaoService.createComposicaoProdutos(payload)
            if (newId == null) {
                console.error(
                    'Contrato de create inválido: id ausente em produtoComposicao.data',
                    { payload, contextoFluxo }
                )
                toast.error('Não foi possível obter o id do vínculo criado. Verifique o contrato da API.')
                if (!noFluxoGuiado) {
                    navigate('/composicao-produtos')
                }
                return
            }

            toast.success(
                noFluxoGuiado
                    ? 'Vínculo criado. Configure as partes e os filamentos.'
                    : 'Vínculo cadastrado com sucesso.'
            )
            navegarParaViewVinculo(newId, data)
        } catch (error) {
            console.error('Erro ao salvar vínculo:', error)
            toast.error('Erro ao salvar vínculo.')
        } finally {
            setSalvando(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/composicao-produtos')
    }, [])

    const produtoQuery = searchParams.get('produto')
    const projetoQuery = searchParams.get('projeto')

    useEffect(() => {
        if (isEditing) {
            loadRecord()
            return
        }

        precarregarProdutoDoFluxo()
        precarregarProjetoDoFluxo()
    }, [id, produtoQuery, projetoQuery])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to={hrefVoltar}><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {isEditing
                                            ? `Editar ${DominioProducaoLabels.vinculo}`
                                            : noFluxoGuiado
                                                ? `Criar ${DominioProducaoLabels.vinculo}`
                                                : `Adicionar ${DominioProducaoLabels.vinculo}`}
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    {noFluxoGuiado ? (
                                        <BreadcrumbItem>
                                            <Link to={montarHrefEtapaFluxo(2, contextoFluxo)}>
                                                Fluxo · Etapa 2
                                            </Link>
                                        </BreadcrumbItem>
                                    ) : (
                                        <BreadcrumbItem>
                                            <Link to="/composicao-produtos">{DominioProducaoLabels.vinculo}</Link>
                                        </BreadcrumbItem>
                                    )}
                                    <BreadcrumbItem active>
                                        {isEditing ? 'Editar' : noFluxoGuiado ? 'Passo 2.2' : 'Adicionar'}
                                    </BreadcrumbItem>
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
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            {noFluxoGuiado && !isEditing && (
                                                <Alert color="info" className="mb-4">
                                                    <strong>Etapa 2 · Passo 2.2</strong>
                                                    {' '}— Criar {DominioProducaoLabels.vinculo}
                                                    <span className="d-block mt-1 small mb-0">
                                                        Produto e projeto já vêm do fluxo quando disponíveis.
                                                        Confirme e salve para abrir a configuração das partes.
                                                    </span>
                                                    {(produtoQuery || projetoQuery) && (
                                                        <span className="d-block mt-2 small text-muted mb-0">
                                                            {produtoQuery ? `Produto #${produtoQuery}` : 'Produto: selecionar'}
                                                            {' · '}
                                                            {projetoQuery ? `Projeto #${projetoQuery}` : 'Projeto: selecionar'}
                                                        </span>
                                                    )}
                                                </Alert>
                                            )}

                                            <p className="text-muted mb-4">
                                                Vincule o produto base ao projeto de impressão.
                                                Depois, configure cores e filamento de cada parte na visualização.
                                            </p>

                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_produto_base" className="form-label">Produto Base</Label>
                                                        <AsyncSelectListControlled<ComposicaoFormFields>
                                                            key={`produto-${produtoSelectKey}`}
                                                            field="id_produto_base"
                                                            control={control}
                                                            callback={getListProdutos}
                                                            required={required}
                                                            defaultValue={produtoDefaultOption}
                                                            defaultOptions={produtoDefaultOption ? [produtoDefaultOption] : undefined}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_projeto_impressao" className="form-label">Projeto de Impressão</Label>
                                                        <AsyncSelectListControlled<ComposicaoFormFields>
                                                            key={`projeto-${projetoSelectKey}`}
                                                            field="id_projeto_impressao"
                                                            control={control}
                                                            callback={getListProjetos}
                                                            required={required}
                                                            defaultValue={projetoDefaultOption}
                                                            defaultOptions={projetoDefaultOption ? [projetoDefaultOption] : undefined}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary"
                                                            disabled={salvando}
                                                        >
                                                            {salvando ? 'Salvando...' : 'Salvar vínculo'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-soft-success"
                                                            onClick={() => {
                                                                if (noFluxoGuiado && !isEditing) {
                                                                    navigate(hrefVoltar)
                                                                    return
                                                                }
                                                                voltarParaRotaAnterior()
                                                            }}
                                                        >
                                                            Voltar
                                                        </button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </form>
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

export default ComposicaoProdutosForm
