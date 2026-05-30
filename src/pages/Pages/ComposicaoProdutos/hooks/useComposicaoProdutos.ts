import {
    ComposicaoItemConfigModel,
    ComposicaoParteResumo,
    ComposicaoProdutosView,
    ComposicaoStatus,
    ComposicaoVariacaoItemModel,
} from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { LookupItem } from 'interfaces/Produtos/ProdutosInterface'
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'
import { ProjetosImpressaoView } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import {
    calcularPesoTotalParte,
    obterValorNumerico,
} from 'pages/Pages/ProjetosImpressao/hooks/useProjetosImpressao'
import {
    chaveCombinacaoCores,
    gerarCombinacoesCores,
    obterDescricaoLookup,
} from 'pages/Pages/Produtos/hooks/useProdutos'

export const calcularCustoItem = (
    peso: number | string | null | undefined,
    precoMedioGrama: number | string | null | undefined
): number => {
    const pesoNum = obterValorNumerico(peso)
    const preco = obterValorNumerico(precoMedioGrama)
    if (pesoNum <= 0 || preco <= 0) return 0
    return pesoNum * preco
}

export const chaveVariacaoItem = (
    idItem: number | string | null | undefined,
    idCorPrimaria: number | null,
    idCorSecundaria: number | null = null,
    idCorTerciaria: number | null = null
): string => {
    const itemKey = idItem != null ? String(idItem) : 'item'
    return `${itemKey}:${chaveCombinacaoCores(idCorPrimaria || 0, idCorSecundaria, idCorTerciaria)}`
}

export const itemTemCoresConfiguradas = (item: ComposicaoItemConfigModel): boolean => {
    const prim = item.cores_primarias || []
    const sec = item.cores_secundarias || []
    const ter = item.cores_terciarias || []
    const legado = item.cores || []
    return prim.length > 0 || sec.length > 0 || ter.length > 0 || legado.length > 0
}

export const montarItensConfigFromProjeto = (
    projeto: ProjetosImpressaoView
): ComposicaoItemConfigModel[] => {
    const itens: ComposicaoItemConfigModel[] = []

    ;(projeto.partes || []).forEach((parte) => {
        ;(parte.itens || []).forEach((item) => {
            const peso = item.peso_total != null
                ? obterValorNumerico(item.peso_total)
                : calcularPesoTotalParte(item)

            itens.push({
                id_projeto_impressao_parte: parte.id,
                id_projeto_impressao_parte_item: item.id,
                nome_parte: parte.nome_parte || '',
                nome_item: item.nome_item || '',
                peso,
                tempo: item.tempo_impressao || null,
                cores_primarias: [],
                cores_secundarias: [],
                cores_terciarias: [],
            })
        })
    })

    return itens
}

export const filtrarItensConfigPorParte = (
    itensConfig: ComposicaoItemConfigModel[],
    idParte: number | string
): ComposicaoItemConfigModel[] => (
    itensConfig.filter((item) => String(item.id_projeto_impressao_parte) === String(idParte))
)

export const montarPartesResumo = (
    projeto: ProjetosImpressaoView,
    itensConfig: ComposicaoItemConfigModel[],
    variacoesItens: ComposicaoVariacaoItemModel[]
): ComposicaoParteResumo[] => (
    (projeto.partes || []).map((parte) => {
        const itensParte = (parte.itens || [])
        const configParte = filtrarItensConfigPorParte(itensConfig, parte.id!)
        const variacoesParte = variacoesItens.filter(
            (v) => String(v.id_projeto_impressao_parte) === String(parte.id)
        )

        const coresDefinidas = configParte.length > 0
            && configParte.every((c) => itemTemCoresConfiguradas(c))
        const variacoesGeradas = variacoesParte.length > 0
        const filamentosOk = variacoesParte.length > 0
            && variacoesParte.every((v) => v.id_filamento != null)

        return {
            id_projeto_impressao_parte: parte.id,
            nome_parte: parte.nome_parte || '—',
            quantidade_itens: itensParte.length,
            configurada: coresDefinidas && variacoesGeradas && filamentosOk,
        }
    })
)

export const calcularStatusComposicao = (
    partes: ComposicaoParteResumo[]
): ComposicaoStatus => {
    if (partes.length === 0) return 'PENDENTE'

    const configuradas = partes.filter((p) => p.configurada).length

    if (configuradas === 0) return 'PENDENTE'
    if (configuradas === partes.length) return 'CONCLUIDA'
    return 'EM_ANDAMENTO'
}

export const obterLabelStatus = (status?: ComposicaoStatus | null): string => {
    switch (status) {
        case 'CONCLUIDA': return 'Concluída'
        case 'EM_ANDAMENTO': return 'Em andamento'
        case 'PENDENTE': return 'Pendente'
        default: return status || 'Pendente'
    }
}

export const obterClasseBadgeStatus = (status?: ComposicaoStatus | null): string => {
    switch (status) {
        case 'CONCLUIDA': return 'bg-success'
        case 'EM_ANDAMENTO': return 'bg-warning text-dark'
        default: return 'bg-secondary'
    }
}

const normalizarIdsCores = (arr: unknown): number[] => {
    if (!Array.isArray(arr)) return []
    return [...new Set(
        arr.map((id) => Number(id)).filter((id) => !Number.isNaN(id) && id > 0)
    )]
}

export const normalizarConfiguracaoItem = (
    raw: Record<string, unknown>
): ComposicaoItemConfigModel => {
    let primarias = normalizarIdsCores(raw.cores_primarias)
    const secundarias = normalizarIdsCores(raw.cores_secundarias)
    const terciarias = normalizarIdsCores(raw.cores_terciarias)

    if (primarias.length === 0 && Array.isArray(raw.cores)) {
        primarias = normalizarIdsCores(raw.cores)
    }

    return {
        id_projeto_impressao_parte: raw.id_projeto_impressao_parte as ComposicaoItemConfigModel['id_projeto_impressao_parte'],
        id_projeto_impressao_parte_item: raw.id_projeto_impressao_parte_item as ComposicaoItemConfigModel['id_projeto_impressao_parte_item'],
        nome_parte: (raw.nome_parte as string) || null,
        nome_item: (raw.nome_item as string) || null,
        peso: raw.peso as ComposicaoItemConfigModel['peso'],
        tempo: raw.tempo as ComposicaoItemConfigModel['tempo'],
        cores_primarias: primarias,
        cores_secundarias: secundarias,
        cores_terciarias: terciarias,
    }
}

export const montarDescricaoVariacaoItem = (
    nomeItem: string,
    combinacao: {
        id_cor_primaria: number
        id_cor_secundaria: number | null
        id_cor_terciaria: number | null
    },
    cores: LookupItem[] | undefined
): string => {
    const corPrimaria = obterDescricaoLookup(cores, combinacao.id_cor_primaria)
    const partes = [nomeItem, corPrimaria || ''].filter(Boolean)

    if (combinacao.id_cor_secundaria != null) {
        const corSec = obterDescricaoLookup(cores, combinacao.id_cor_secundaria)
        if (corSec) partes.push(corSec)
    }
    if (combinacao.id_cor_terciaria != null) {
        const corTer = obterDescricaoLookup(cores, combinacao.id_cor_terciaria)
        if (corTer) partes.push(corTer)
    }

    if (partes.length <= 1) return nomeItem
    return `${partes[0]} - ${partes.slice(1).join(' / ')}`
}

export const montarCorDescricaoVariacao = (
    combinacao: {
        id_cor_primaria: number
        id_cor_secundaria: number | null
        id_cor_terciaria: number | null
    },
    cores: LookupItem[] | undefined
): string => {
    const partes: string[] = []
    const prim = obterDescricaoLookup(cores, combinacao.id_cor_primaria)
    if (prim) partes.push(prim)
    if (combinacao.id_cor_secundaria != null) {
        const sec = obterDescricaoLookup(cores, combinacao.id_cor_secundaria)
        if (sec) partes.push(sec)
    }
    if (combinacao.id_cor_terciaria != null) {
        const ter = obterDescricaoLookup(cores, combinacao.id_cor_terciaria)
        if (ter) partes.push(ter)
    }
    return partes.join(' / ') || '—'
}

export const extrairVariacoesItensFromView = (
    view: ComposicaoProdutosView
): ComposicaoVariacaoItemModel[] => {
    if (view.variacoes_itens && view.variacoes_itens.length) {
        return view.variacoes_itens.map((v) => ({
            ...v,
            chave: v.chave || chaveVariacaoItem(
                v.id_projeto_impressao_parte_item,
                v.id_cor_primaria != null ? Number(v.id_cor_primaria) : (v.id_cor != null ? Number(v.id_cor) : 0),
                v.id_cor_secundaria != null ? Number(v.id_cor_secundaria) : null,
                v.id_cor_terciaria != null ? Number(v.id_cor_terciaria) : null
            ),
        }))
    }

    const variacoesLegado = (view as Record<string, unknown>).variacoes
    if (!Array.isArray(variacoesLegado)) return []

    const resultado: ComposicaoVariacaoItemModel[] = []

    variacoesLegado.forEach((variacao: Record<string, unknown>) => {
        const itens = Array.isArray(variacao.itens) ? variacao.itens : []
        itens.forEach((item: Record<string, unknown>) => {
            const idCor = variacao.id_cor_primaria != null
                ? variacao.id_cor_primaria
                : item.id_cor
            resultado.push({
                id: variacao.id as ComposicaoVariacaoItemModel['id'],
                chave: chaveVariacaoItem(
                    item.id_projeto_impressao_parte_item as number | string,
                    idCor as number | string
                ),
                id_projeto_impressao_parte: item.id_projeto_impressao_parte as number | string,
                id_projeto_impressao_parte_item: item.id_projeto_impressao_parte_item as number | string,
                nome_parte: item.nome_parte as string,
                nome_item: item.nome_item as string,
                id_cor: idCor as number | string,
                cor_descricao: (variacao.cor_primaria_descricao as string)
                    || (item.cor_descricao as string)
                    || null,
                descricao: (variacao.nome_variacao as string) || (item.nome_item as string) || null,
                peso: item.peso as ComposicaoVariacaoItemModel['peso'],
                tempo: item.tempo as ComposicaoVariacaoItemModel['tempo'],
                id_filamento: item.id_filamento as number | string,
                descricao_filamento: item.descricao_filamento as string,
                cor_filamento: item.cor_filamento as string,
                preco_medio_grama: item.preco_medio_grama as number | string,
                custo: item.custo as number | string,
            })
        })
    })

    return resultado
}

export const gerarVariacoesIndividuaisItens = (
    itensConfig: ComposicaoItemConfigModel[],
    cores: LookupItem[] | undefined,
    variacoesExistentes: ComposicaoVariacaoItemModel[] = []
): ComposicaoVariacaoItemModel[] => {
    const mapaFilamentos = new Map<string, ComposicaoVariacaoItemModel>()
    variacoesExistentes.forEach((v) => {
        if (v.chave) mapaFilamentos.set(v.chave, v)
    })

    const preview: ComposicaoVariacaoItemModel[] = []

    itensConfig.forEach((item) => {
        const primarias = item.cores_primarias || item.cores || []
        const secundarias = item.cores_secundarias || []
        const terciarias = item.cores_terciarias || []

        const combinacoes = gerarCombinacoesCores(primarias, secundarias, terciarias)
        const nomeItem = item.nome_item || item.nome_parte || 'Item'

        combinacoes.forEach((combinacao) => {
            const chave = chaveVariacaoItem(
                item.id_projeto_impressao_parte_item,
                combinacao.id_cor_primaria,
                combinacao.id_cor_secundaria,
                combinacao.id_cor_terciaria
            )
            const existente = mapaFilamentos.get(chave)
            const corDescricao = montarCorDescricaoVariacao(combinacao, cores)

            preview.push({
                id: existente && existente.id,
                chave,
                id_projeto_impressao_parte: item.id_projeto_impressao_parte,
                id_projeto_impressao_parte_item: item.id_projeto_impressao_parte_item,
                nome_parte: item.nome_parte,
                nome_item: item.nome_item,
                id_cor: combinacao.id_cor_primaria,
                id_cor_primaria: combinacao.id_cor_primaria,
                id_cor_secundaria: combinacao.id_cor_secundaria,
                id_cor_terciaria: combinacao.id_cor_terciaria,
                cor_descricao: corDescricao,
                cor_primaria_descricao: obterDescricaoLookup(cores, combinacao.id_cor_primaria),
                cor_secundaria_descricao: combinacao.id_cor_secundaria != null
                    ? obterDescricaoLookup(cores, combinacao.id_cor_secundaria)
                    : null,
                cor_terciaria_descricao: combinacao.id_cor_terciaria != null
                    ? obterDescricaoLookup(cores, combinacao.id_cor_terciaria)
                    : null,
                descricao: montarDescricaoVariacaoItem(nomeItem, combinacao, cores),
                peso: item.peso,
                tempo: item.tempo,
                id_filamento: existente && existente.id_filamento != null
                    ? existente.id_filamento
                    : null,
                descricao_filamento: existente && existente.descricao_filamento
                    ? existente.descricao_filamento
                    : null,
                cor_filamento: existente && existente.cor_filamento
                    ? existente.cor_filamento
                    : null,
                preco_medio_grama: existente && existente.preco_medio_grama != null
                    ? existente.preco_medio_grama
                    : null,
                custo: existente
                    ? calcularCustoItem(item.peso, existente.preco_medio_grama)
                    : 0,
            })
        })
    })

    return preview
}

export const validarCoresItensParte = (itensConfig: ComposicaoItemConfigModel[]): string | null => {
    if (itensConfig.length === 0) return 'Nenhum item encontrado nesta parte.'

    for (const item of itensConfig) {
        if (!itemTemCoresConfiguradas(item)) {
            return `Selecione ao menos uma cor (primária, secundária ou terciária) para "${item.nome_item || item.nome_parte}".`
        }
        const primarias = item.cores_primarias || item.cores || []
        if (primarias.length === 0) {
            return `Selecione ao menos uma cor primária para "${item.nome_item || item.nome_parte}".`
        }
    }

    return null
}

export const atualizarFilamentoVariacaoItem = (
    variacoes: ComposicaoVariacaoItemModel[],
    chave: string,
    filamento: {
        id?: string | number | null
        label?: string
        cor_filamento?: string | null
        preco_medio_grama?: number | string | null
    } | null
): ComposicaoVariacaoItemModel[] => (
    variacoes.map((linha) => {
        if (linha.chave !== chave) return linha

        if (!filamento) {
            return {
                ...linha,
                id_filamento: null,
                descricao_filamento: null,
                cor_filamento: null,
                preco_medio_grama: null,
                custo: 0,
            }
        }

        return {
            ...linha,
            id_filamento: filamento.id,
            descricao_filamento: filamento.label || null,
            cor_filamento: filamento.cor_filamento || null,
            preco_medio_grama: filamento.preco_medio_grama,
            custo: calcularCustoItem(linha.peso, filamento.preco_medio_grama),
        }
    })
)

export const mesclarConfiguracaoItens = (
    configuracaoAtual: ComposicaoItemConfigModel[],
    itensParte: ComposicaoItemConfigModel[]
): ComposicaoItemConfigModel[] => {
    const mapa = new Map<string, ComposicaoItemConfigModel>()
    configuracaoAtual.forEach((item) => {
        if (item.id_projeto_impressao_parte_item != null) {
            mapa.set(String(item.id_projeto_impressao_parte_item), item)
        }
    })
    itensParte.forEach((item) => {
        if (item.id_projeto_impressao_parte_item != null) {
            mapa.set(String(item.id_projeto_impressao_parte_item), item)
        }
    })
    return Array.from(mapa.values())
}

export const mesclarVariacoesItens = (
    variacoesAtual: ComposicaoVariacaoItemModel[],
    idParte: number | string,
    variacoesParte: ComposicaoVariacaoItemModel[]
): ComposicaoVariacaoItemModel[] => {
    const outras = variacoesAtual.filter(
        (v) => String(v.id_projeto_impressao_parte) !== String(idParte)
    )
    return [...outras, ...variacoesParte]
}

export const normalizarComposicaoView = (
    view: ComposicaoProdutosView,
    projeto?: ProjetosImpressaoView
): ComposicaoProdutosView => {
    const raw = view as Record<string, unknown>
    const configuracao_itens = (
        (view.configuracao_itens || (raw.configuracao_itens as ComposicaoItemConfigModel[]) || [])
    ).map((item) => normalizarConfiguracaoItem(item as Record<string, unknown>))

    const variacoes_itens = extrairVariacoesItensFromView({
        ...view,
        configuracao_itens,
    })

    let status = view.status
    if (projeto) {
        const partes = montarPartesResumo(projeto, configuracao_itens, variacoes_itens)
        status = calcularStatusComposicao(partes)
    }

    return {
        ...view,
        configuracao_itens,
        variacoes_itens,
        status,
    }
}

export const prepararPayloadSalvar = (model: ComposicaoProdutosModel) => ({
    id: model.id,
    id_produto_base: model.id_produto_base,
    id_projeto_impressao: model.id_projeto_impressao,
    configuracao_itens: (model.configuracao_itens || []).map((item) => ({
        id_projeto_impressao_parte: item.id_projeto_impressao_parte,
        id_projeto_impressao_parte_item: item.id_projeto_impressao_parte_item,
        cores_primarias: item.cores_primarias || item.cores || [],
        cores_secundarias: item.cores_secundarias || [],
        cores_terciarias: item.cores_terciarias || [],
    })),
    variacoes_itens: (model.variacoes_itens || []).map((v) => ({
        id: v.id,
        id_projeto_impressao_parte: v.id_projeto_impressao_parte,
        id_projeto_impressao_parte_item: v.id_projeto_impressao_parte_item,
        id_cor: v.id_cor_primaria != null ? v.id_cor_primaria : v.id_cor,
        id_cor_primaria: v.id_cor_primaria != null ? v.id_cor_primaria : v.id_cor,
        id_cor_secundaria: v.id_cor_secundaria,
        id_cor_terciaria: v.id_cor_terciaria,
        descricao: v.descricao,
        peso: v.peso,
        tempo: v.tempo,
        id_filamento: v.id_filamento,
        preco_medio_grama: v.preco_medio_grama,
        custo: v.custo,
    })),
})

export const obterParteProjeto = (
    projeto: ProjetosImpressaoView,
    idParte: number | string
): ParteProjetoImpressaoModel | undefined => (
    (projeto.partes || []).find((p) => String(p.id) === String(idParte))
)
