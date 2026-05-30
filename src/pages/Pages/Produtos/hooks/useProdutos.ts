import { PaginateInterface } from 'interfaces/SystemInterfaces/PaginateInterface'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import {
    LookupItem,
    LookupsProdutos,
    ProdutoVariacaoResumo,
    ProdutoVariacaoStatus,
    ProdutosList,
    ProdutosView,
} from 'interfaces/Produtos/ProdutosInterface'
import {
    VariacaoCombinacaoPreview,
    VariacaoPreviewStatus,
} from 'interfaces/Produtos/ProdutoVariacaoInterface'

export const mapLookupToOptions = (items: LookupItem[] | undefined): SelectOptions[] => {
    if (!items) return []
    return items.map((item) => ({
        value: item.id,
        label: item.descricao,
    }))
}

export const obterCodigoLookup = (
    items: LookupItem[] | undefined,
    id: number | string | null | undefined
): string | null => {
    if (id == null || !items) return null
    const item = items.find((i) => String(i.id) === String(id))
    return item && item.codigo ? item.codigo : null
}

export const obterDescricaoLookup = (
    items: LookupItem[] | undefined,
    id: number | string | null | undefined
): string | null => {
    if (id == null || !items) return null
    const item = items.find((i) => String(i.id) === String(id))
    return item && item.descricao ? item.descricao : null
}

export const montarSkuBase = (
    codigoBase: string | number | null | undefined,
    idCategoria: number | string | null | undefined,
    idModelo: number | string | null | undefined,
    idLinha: number | string | null | undefined,
    lookups: LookupsProdutos | undefined
): string => {
    if (codigoBase == null || codigoBase === '' || !lookups) return ''

    const codigoCategoria = obterCodigoLookup(lookups.categoriasProdutos, idCategoria)
    const codigoModelo = obterCodigoLookup(lookups.modelosProdutos, idModelo)

    if (!codigoCategoria || !codigoModelo) return ''

    const partes = [String(codigoBase), codigoCategoria, codigoModelo]

    if (idLinha != null && idLinha !== '') {
        const codigoLinha = obterCodigoLookup(lookups.linhasProdutos, idLinha)
        if (codigoLinha) {
            partes.push(codigoLinha)
        }
    }

    return partes.join('-')
}

export const montarSkuVariacao = (
    skuBase: string | null | undefined,
    idCorPrimaria: number | string | null | undefined,
    idCorSecundaria: number | string | null | undefined,
    idCorTerciaria: number | string | null | undefined,
    lookups: LookupsProdutos | undefined
): string => {
    if (!skuBase || !lookups) return ''

    const codigoPrimaria = obterCodigoLookup(lookups.cores, idCorPrimaria)
    if (!codigoPrimaria) return ''

    const partes = [skuBase, codigoPrimaria]

    if (idCorSecundaria != null && idCorSecundaria !== '') {
        const codigoSecundaria = obterCodigoLookup(lookups.cores, idCorSecundaria)
        if (codigoSecundaria) {
            partes.push(codigoSecundaria)
        }
    }

    if (idCorTerciaria != null && idCorTerciaria !== '') {
        const codigoTerciaria = obterCodigoLookup(lookups.cores, idCorTerciaria)
        if (codigoTerciaria) {
            partes.push(codigoTerciaria)
        }
    }

    return partes.join('-')
}

export const chaveCombinacaoCores = (
    idCorPrimaria: number,
    idCorSecundaria: number | null,
    idCorTerciaria: number | null
): string => `${idCorPrimaria}:${idCorSecundaria != null ? idCorSecundaria : 'null'}:${idCorTerciaria != null ? idCorTerciaria : 'null'}`

export const gerarCombinacoesCores = (
    coresPrimarias: number[],
    coresSecundarias: number[],
    coresTerciarias: number[]
): Array<{
    id_cor_primaria: number
    id_cor_secundaria: number | null
    id_cor_terciaria: number | null
}> => {
    const primarias = [...new Set(coresPrimarias.filter((id) => id > 0))]
    if (primarias.length === 0) return []

    const secundarias: Array<number | null> = coresSecundarias.length > 0
        ? [...new Set(coresSecundarias.filter((id) => id > 0))]
        : [null]
    const terciarias: Array<number | null> = coresTerciarias.length > 0
        ? [...new Set(coresTerciarias.filter((id) => id > 0))]
        : [null]

    const combinacoes: Array<{
        id_cor_primaria: number
        id_cor_secundaria: number | null
        id_cor_terciaria: number | null
    }> = []

    primarias.forEach((primaria) => {
        secundarias.forEach((secundaria) => {
            terciarias.forEach((terciaria) => {
                combinacoes.push({
                    id_cor_primaria: primaria,
                    id_cor_secundaria: secundaria,
                    id_cor_terciaria: terciaria,
                })
            })
        })
    })

    return combinacoes
}

export const montarPreviewVariacoes = (
    skuBase: string,
    coresPrimarias: number[],
    coresSecundarias: number[],
    coresTerciarias: number[],
    variacoesExistentes: ProdutoVariacaoResumo[],
    lookups: LookupsProdutos | undefined
): VariacaoCombinacaoPreview[] => {
    const combinacoes = gerarCombinacoesCores(coresPrimarias, coresSecundarias, coresTerciarias)
    const preview: VariacaoCombinacaoPreview[] = []
    const chavesNovas = new Set<string>()

    const mapaExistentes = new Map<string, ProdutoVariacaoResumo>()
    variacoesExistentes.forEach((v) => {
        if (v.id_cor_primaria == null) return
        const chave = chaveCombinacaoCores(
            v.id_cor_primaria,
            v.id_cor_secundaria != null ? v.id_cor_secundaria : null,
            v.id_cor_terciaria != null ? v.id_cor_terciaria : null
        )
        mapaExistentes.set(chave, v)
    })

    combinacoes.forEach((combinacao) => {
        const chave = chaveCombinacaoCores(
            combinacao.id_cor_primaria,
            combinacao.id_cor_secundaria,
            combinacao.id_cor_terciaria
        )
        chavesNovas.add(chave)

        const existente = mapaExistentes.get(chave)
        let status: VariacaoPreviewStatus = 'NOVA'

        if (existente) {
            if (existente.status === 'INATIVADA') {
                status = 'REATIVADA'
            } else {
                status = 'ATIVA'
            }
        }

        preview.push({
            id: existente && existente.id,
            id_cor_primaria: combinacao.id_cor_primaria,
            id_cor_secundaria: combinacao.id_cor_secundaria,
            id_cor_terciaria: combinacao.id_cor_terciaria,
            cor_primaria_descricao: obterDescricaoLookup(lookups && lookups.cores, combinacao.id_cor_primaria) || '—',
            cor_secundaria_descricao: combinacao.id_cor_secundaria != null
                ? obterDescricaoLookup(lookups && lookups.cores, combinacao.id_cor_secundaria)
                : null,
            cor_terciaria_descricao: combinacao.id_cor_terciaria != null
                ? obterDescricaoLookup(lookups && lookups.cores, combinacao.id_cor_terciaria)
                : null,
            sku: montarSkuVariacao(
                skuBase,
                combinacao.id_cor_primaria,
                combinacao.id_cor_secundaria,
                combinacao.id_cor_terciaria,
                lookups
            ),
            status,
        })
    })

    variacoesExistentes.forEach((v) => {
        if (v.id_cor_primaria == null) return
        const chave = chaveCombinacaoCores(
            v.id_cor_primaria,
            v.id_cor_secundaria != null ? v.id_cor_secundaria : null,
            v.id_cor_terciaria != null ? v.id_cor_terciaria : null
        )

        if (!chavesNovas.has(chave) && v.status === 'ATIVA') {
            preview.push({
                id: v.id,
                id_cor_primaria: v.id_cor_primaria,
                id_cor_secundaria: v.id_cor_secundaria != null ? v.id_cor_secundaria : null,
                id_cor_terciaria: v.id_cor_terciaria != null ? v.id_cor_terciaria : null,
                cor_primaria_descricao: (v.cor_primaria && v.cor_primaria.descricao) || '—',
                cor_secundaria_descricao: (v.cor_secundaria && v.cor_secundaria.descricao) || null,
                cor_terciaria_descricao: (v.cor_terciaria && v.cor_terciaria.descricao) || null,
                sku: v.sku || '—',
                status: 'INATIVADA',
            })
        }
    })

    return preview
}

export const extrairIdsMultiSelect = (selected: SelectOptions[] | null | undefined): number[] => {
    if (!selected || !Array.isArray(selected)) return []
    return selected
        .map((item) => Number(item.value))
        .filter((id) => !Number.isNaN(id) && id > 0)
}

export const normalizarProdutoList = (row: Record<string, any>): ProdutosList => ({
    id: row.id,
    descricao_produto: row.descricao_produto,
    codigo_base: row.codigo_base,
    sku_base: row.sku_base,
    id_categoria: row.id_categoria,
    id_modelo: row.id_modelo,
    id_linha: row.id_linha,
    categoria: row.categoria_descricao || (row.categoria && row.categoria.descricao),
    modelo: row.modelo_descricao || (row.modelo && row.modelo.descricao),
    linha: row.linha_descricao || (row.linha && row.linha.descricao),
    quantidade_variacoes: Number(row.quantidade_variacoes != null ? row.quantidade_variacoes : 0),
})

export const normalizarProdutosPaginate = (
    paginate: PaginateInterface<ProdutosList>
): PaginateInterface<ProdutosList> => ({
    ...paginate,
    data: (paginate.data || []).map((row) => normalizarProdutoList(row as Record<string, any>)),
})

export const normalizarProdutoView = (view: Record<string, any>): ProdutosView => ({
    id: view.id,
    descricao_produto: view.descricao_produto,
    codigo_base: view.codigo_base,
    sku_base: view.sku_base,
    id_categoria: view.id_categoria,
    id_modelo: view.id_modelo,
    id_linha: view.id_linha,
    categoria: view.categoria,
    modelo: view.modelo,
    linha: view.linha,
    quantidade_variacoes: Number(
        view.quantidade_variacoes != null
            ? view.quantidade_variacoes
            : (view.variacoes ? view.variacoes.length : 0)
    ),
    variacoes: (view.variacoes || []).map((v: Record<string, any>) => ({
        id: v.id,
        sku: v.sku,
        status: v.status as ProdutoVariacaoStatus,
        id_cor_primaria: v.id_cor_primaria,
        id_cor_secundaria: v.id_cor_secundaria,
        id_cor_terciaria: v.id_cor_terciaria,
        cor_primaria: v.cor_primaria,
        cor_secundaria: v.cor_secundaria,
        cor_terciaria: v.cor_terciaria,
    })),
})

export const normalizarLookupsProdutos = (lookups: Record<string, any>): LookupsProdutos => ({
    categoriasProdutos: lookups.categoriasProdutos || [],
    modelosProdutos: lookups.modelosProdutos || [],
    linhasProdutos: lookups.linhasProdutos || [],
    cores: lookups.cores || [],
    partesBase: lookups.partesBase || [],
    proximoCodigoBase: lookups.proximoCodigoBase != null ? lookups.proximoCodigoBase : null,
})

export type FiltroStatusVariacao = 'ATIVAS' | 'INATIVADAS' | 'TODAS'

export const filtrarVariacoesPorStatus = (
    variacoes: ProdutoVariacaoResumo[],
    filtro: FiltroStatusVariacao
): ProdutoVariacaoResumo[] => {
    if (filtro === 'TODAS') return variacoes
    if (filtro === 'ATIVAS') {
        return variacoes.filter((v) => v.status === 'ATIVA')
    }
    return variacoes.filter((v) => v.status === 'INATIVADA')
}
