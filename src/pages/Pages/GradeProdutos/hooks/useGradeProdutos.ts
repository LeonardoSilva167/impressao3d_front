import {
    GradeCombinacao,
    GradeCombinacaoParte,
    GradeItemDisponivel,
    GradeParteDisponivel,
    GradeProdutoGeradoList,
    GradeProdutosCarregarDados,
    GradeProdutosStatus,
    GradeProdutosView,
    GradeVariacaoDisponivel,
} from 'interfaces/GradeProdutos/GradeProdutosInterface'

interface GradeCarregarDadosParteApi {
    id?: number
    nome_parte?: string
    selecionada?: boolean
    itens?: GradeCarregarDadosItemApi[]
}

interface GradeCarregarDadosItemApi {
    id?: number
    nome_item?: string
    peso_total?: number | string
    tempo_impressao?: string
    variacoes?: GradeCarregarDadosVariacaoApi[]
}

interface GradeCarregarDadosVariacaoApi {
    id?: number
    id_parte?: number
    nome_parte?: string
    nome_item?: string
    descricao_variacao?: string
    cor?: { descricao?: string }
    custo_filamento?: number | string | null
    custo_energia?: number | string | null
    custo_desgaste?: number | string | null
    custo_total?: number | string | null
    filamento?: {
        resumo?: string
        custo_item?: number | string | null
        custo_filamento?: number | string | null
    }
}

interface GradeCarregarDadosApiResponse extends GradeProdutosCarregarDados {
    produto?: {
        id?: number
        descricao_produto?: string
        sku_base?: string
        codigo_base?: string
    }
    composicao?: {
        id?: number
        id_produto?: number
        partes?: GradeCarregarDadosParteApi[]
    }
}
import { formatarParaMoedaReal } from 'helpers/functions_helpers'
import {
    calcularCustoDesgaste,
    calcularCustoEnergia,
    calcularCustoTotalProducao,
    CUSTOS_PRODUCAO_DEFAULT,
    CustosProducaoConfig,
} from 'helpers/custosProducao_helpers'
import { obterValorNumerico } from 'pages/Pages/ProjetosImpressao/hooks/useProjetosImpressao'

const obterCustoFilamentoProdutoApi = (produto: Record<string, unknown>): number | string | null | undefined => {
    if (produto.custo_filamento != null) return produto.custo_filamento as number | string
    if (produto.custo != null) return produto.custo as number | string

    const filamento = produto.filamento
    if (filamento && typeof filamento === 'object') {
        const filamentoRaw = filamento as Record<string, unknown>
        if (filamentoRaw.custo_filamento != null) return filamentoRaw.custo_filamento as number | string
        if (filamentoRaw.custo_item != null) return filamentoRaw.custo_item as number | string
    }

    return null
}

export const mapProdutoGeradoListApi = (
    produto: Record<string, unknown>,
    config: CustosProducaoConfig = CUSTOS_PRODUCAO_DEFAULT
): GradeProdutoGeradoList => {
    const custoFilamento = obterValorNumerico(obterCustoFilamentoProdutoApi(produto))
    const tempoTotal = produto.tempo_total as string | null | undefined

    const custoEnergiaApi = obterValorNumerico(produto.custo_energia as number | string | null | undefined)
    const custoDesgasteApi = obterValorNumerico(produto.custo_desgaste as number | string | null | undefined)

    let custoEnergia = custoEnergiaApi
    let custoDesgaste = custoDesgasteApi
    let custosComplementados = false

    if (custoEnergia <= 0 && tempoTotal) {
        custoEnergia = calcularCustoEnergia(tempoTotal, config.custo_energia_kwh)
        custosComplementados = true
    }
    if (custoDesgaste <= 0 && tempoTotal) {
        custoDesgaste = calcularCustoDesgaste(tempoTotal, config.custo_desgaste_hora)
        custosComplementados = true
    }

    const custoTotalInformado = obterValorNumerico(produto.custo_total as number | string | null | undefined)
    const custoTotalCalculado = calcularCustoTotalProducao(custoFilamento, custoEnergia, custoDesgaste)
    const custoTotal = custosComplementados || custoTotalInformado <= custoFilamento
        ? custoTotalCalculado
        : custoTotalInformado

    return {
        id: produto.id as number | undefined,
        nome_produto: produto.nome_produto as string | undefined,
        sku: produto.sku as string | undefined,
        peso_total: produto.peso_total as number | string | null | undefined,
        tempo_total: tempoTotal || null,
        status: produto.status != null ? String(produto.status) : null,
        custo_filamento: custoFilamento,
        custo_energia: custoEnergia,
        custo_desgaste: custoDesgaste,
        custo_total: custoTotal,
    }
}

export const resolverProdutosGeradosGrade = (
    view: GradeProdutosView | Record<string, unknown> | null | undefined,
    config: CustosProducaoConfig = CUSTOS_PRODUCAO_DEFAULT
): GradeProdutoGeradoList[] => {
    if (!view || typeof view !== 'object') return []

    const raw = view as Record<string, unknown>
    const produtosRaw = raw.produtos_gerados
    if (!Array.isArray(produtosRaw)) return []

    return produtosRaw.map((produto) => mapProdutoGeradoListApi(produto as Record<string, unknown>, config))
}

const mapCombinacoesApi = (combinacoes: unknown): GradeCombinacao[] => {
    if (!Array.isArray(combinacoes)) return []

    return combinacoes.map((comb) => {
        const combinacao = comb as GradeCombinacao & {
            partes?: Array<GradeCombinacaoParte & { id_parte_projeto?: number | string }>
        }

        return {
            id: combinacao.id,
            descricao: combinacao.descricao || '',
            partes: (combinacao.partes || []).map((parte) => {
                const idParte = parte.id_parte != null
                    ? parte.id_parte
                    : parte.id_parte_projeto

                return {
                    id_parte: idParte != null ? idParte : '',
                    quantidade: Number(parte.quantidade) || 1,
                    nome_parte: parte.nome_parte || (idParte != null ? String(idParte) : ''),
                }
            }),
        }
    })
}

export const normalizarViewGradeProdutos = (
    view: GradeProdutosView | Record<string, unknown>
): GradeProdutosView => {
    let raw = view as Record<string, unknown>
    if (raw.id == null && raw.produtos_gerados == null && raw.data != null && typeof raw.data === 'object') {
        raw = raw.data as Record<string, unknown>
    }

    const produtoInfo = raw.produto as {
        descricao_produto?: string
        sku_base?: string
    } | undefined

    return {
        id: raw.id as number | undefined,
        descricao: raw.descricao as string | undefined,
        id_produto_base: raw.id_produto_base as number | undefined,
        produto_descricao: (raw.produto_descricao as string | undefined)
            || (produtoInfo && produtoInfo.descricao_produto),
        sku_base: (raw.sku_base as string | undefined)
            || (produtoInfo && produtoInfo.sku_base),
        quantidade_produtos: raw.quantidade_produtos as number | undefined,
        status: raw.status as GradeProdutosStatus | undefined,
        data_criacao: (raw.data_criacao as string | undefined) || (raw.created_at as string | undefined),
        combinacoes: mapCombinacoesApi(raw.combinacoes),
        produtos_gerados: resolverProdutosGeradosGrade(raw),
    }
}

export const obterLabelStatusGrade = (status?: GradeProdutosStatus | null): string => {
    switch (status) {
        case 'CONCLUIDA': return 'Concluída'
        case 'GERADA': return 'Gerada'
        case 'EM_ANDAMENTO': return 'Em andamento'
        case 'PENDENTE': return 'Pendente'
        default: return status || 'Pendente'
    }
}

export const obterClasseBadgeStatusGrade = (status?: GradeProdutosStatus | null): string => {
    switch (status) {
        case 'CONCLUIDA': return 'bg-success'
        case 'GERADA': return 'bg-info'
        case 'EM_ANDAMENTO': return 'bg-warning text-dark'
        default: return 'bg-secondary'
    }
}

export const mapCarregarDadosGrade = (
    response: GradeCarregarDadosApiResponse | undefined
): GradeProdutosCarregarDados | undefined => {
    if (!response) return undefined

    if (response.partes && !response.composicao) {
        return response
    }

    const produto = response.produto
    const composicao = response.composicao
    const partesRaw = (composicao && composicao.partes) || []

    const partes: GradeParteDisponivel[] = partesRaw.map((parte) => ({
        id: parte.id,
        id_parte: parte.id,
        nome_parte: parte.nome_parte,
        selecionada: parte.selecionada,
    }))

    const itens: GradeItemDisponivel[] = partesRaw.flatMap((parte) =>
        (parte.itens || []).map((item) => ({
            id: item.id,
            id_parte: parte.id,
            nome_parte: parte.nome_parte,
            nome_item: item.nome_item,
            peso: item.peso_total,
            tempo: item.tempo_impressao,
        }))
    )

    const variacoes: GradeVariacaoDisponivel[] = partesRaw.flatMap((parte) =>
        (parte.itens || []).flatMap((item) =>
            (item.variacoes || []).map((variacao) => ({
                id: variacao.id,
                id_parte: variacao.id_parte ?? parte.id,
                nome_parte: variacao.nome_parte ?? parte.nome_parte,
                nome_item: variacao.nome_item ?? item.nome_item,
                descricao: variacao.descricao_variacao,
                cor_descricao: variacao.cor?.descricao,
                descricao_filamento: variacao.filamento?.resumo,
            }))
        )
    )

    return {
        id_composicao: composicao?.id,
        id_produto_base: produto?.id ?? composicao?.id_produto,
        produto_descricao: produto?.descricao_produto,
        sku_base: produto?.sku_base,
        partes,
        itens,
        variacoes,
    }
}

export const obterIdParte = (parte: {
    id?: number | string
    id_parte?: number | string
    id_projeto_impressao_parte?: number | string
}): string => {
    const id = parte.id_parte ?? parte.id_projeto_impressao_parte ?? parte.id
    return id != null ? String(id) : ''
}

export const formatarPesoGrade = (peso: number | string | null | undefined): string => {
    const valor = obterValorNumerico(peso)
    if (valor <= 0) return '—'
    return `${Math.round(valor)}g`
}

export const formatarCustoGrade = (custo: number | string | null | undefined): string => {
    const valor = obterValorNumerico(custo)
    if (valor <= 0) return '—'
    return formatarParaMoedaReal(valor)
}

export const formatarTempoGrade = (tempo: string | null | undefined): string => {
    if (!tempo || !String(tempo).trim()) return '—'
    return String(tempo).trim()
}

export const obterNomeProdutoBase = (row: {
    produto_base?: string
    produto_descricao?: string
    sku_base?: string
}): string => {
    if (row.produto_base) return row.produto_base
    if (row.sku_base && row.produto_descricao) {
        return `${row.sku_base} - ${row.produto_descricao}`
    }
    return row.produto_descricao || row.sku_base || '—'
}

export const obterQuantidadeProdutosGerados = (row: {
    produtos_gerados?: number
    quantidade_produtos?: number
}): number => {
    if (row.produtos_gerados != null) return Number(row.produtos_gerados)
    if (row.quantidade_produtos != null) return Number(row.quantidade_produtos)
    return 0
}

export const formatarPartesCombinacao = (partes: GradeCombinacaoParte[]): string => {
    if (!partes.length) return '—'
    return partes
        .map((parte) => {
            const nome = parte.nome_parte || String(parte.id_parte)
            return parte.quantidade > 1 ? `${nome} x${parte.quantidade}` : nome
        })
        .join(', ')
}

export const obterQuantidadePartesCombinacao = (partes: GradeCombinacaoParte[]): number => {
    return partes.length
}

export const gerarIdLocalCombinacao = (): string => {
    return `comb-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const mapPartesDisponiveisParaOptions = (
    partes: GradeParteDisponivel[]
): Array<{ value: string; label: string }> => {
    return partes.map((parte) => {
        const parteId = obterIdParte(parte)
        return {
            value: parteId,
            label: parte.nome_parte || parteId,
        }
    })
}

export const obterNomePartePorId = (
    partesDisponiveis: GradeParteDisponivel[],
    idParte: number | string
): string => {
    const idStr = String(idParte)
    const parte = partesDisponiveis.find((p) => obterIdParte(p) === idStr)
    return (parte && parte.nome_parte) || idStr
}

export const mapCombinacoesView = (
    combinacoes: GradeCombinacao[] | undefined,
    partesDisponiveis: GradeParteDisponivel[] = []
): GradeCombinacao[] => {
    if (!combinacoes || !combinacoes.length) return []

    return combinacoes.map((comb) => ({
        id: comb.id,
        descricao: comb.descricao || '',
        partes: (comb.partes || []).map((parte) => ({
            id_parte: parte.id_parte,
            quantidade: Number(parte.quantidade) || 1,
            nome_parte: parte.nome_parte
                || obterNomePartePorId(partesDisponiveis, parte.id_parte),
        })),
    }))
}
