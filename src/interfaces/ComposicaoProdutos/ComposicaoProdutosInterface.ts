import { LookupItem } from 'interfaces/Produtos/ProdutosInterface'

export type ComposicaoStatus = 'PENDENTE' | 'EM_ANDAMENTO' | 'CONCLUIDA' | string

export interface ComposicaoProdutosSearch {
    id?: string | number | undefined | null
    id_produto_base?: string | number | undefined | null
    id_projeto_impressao?: string | number | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface ComposicaoProdutosList {
    id?: number
    produto?: string
    produto_descricao?: string
    projeto?: string
    projeto_descricao?: string
    codigo_projeto?: string
    nome_projeto?: string
    status?: ComposicaoStatus | null
    data_cadastro?: string
}

export interface ComposicaoParteResumo {
    id_projeto_impressao_parte?: number | string | null
    nome_parte?: string | null
    quantidade_itens?: number
    configurada?: boolean
}

export interface ComposicaoItemConfigModel {
    id_projeto_impressao_parte?: number | string | null
    id_projeto_impressao_parte_item?: number | string | null
    nome_parte?: string | null
    nome_item?: string | null
    peso?: number | string | null
    tempo?: string | null
    cores_primarias?: number[]
    cores_secundarias?: number[]
    cores_terciarias?: number[]
    /** @deprecated use cores_primarias/secundarias/terciarias */
    cores?: number[]
}

export interface ComposicaoVariacaoItemModel {
    id?: number | string | null
    chave?: string
    id_projeto_impressao_parte?: number | string | null
    id_projeto_impressao_parte_item?: number | string | null
    nome_parte?: string | null
    nome_item?: string | null
    id_cor?: number | string | null
    id_cor_primaria?: number | string | null
    id_cor_secundaria?: number | string | null
    id_cor_terciaria?: number | string | null
    cor_descricao?: string | null
    cor_primaria_descricao?: string | null
    cor_secundaria_descricao?: string | null
    cor_terciaria_descricao?: string | null
    descricao?: string | null
    peso?: number | string | null
    tempo?: string | null
    id_filamento?: number | string | null
    descricao_filamento?: string | null
    cor_filamento?: string | null
    preco_medio_grama?: number | string | null
    custo?: number | string | null
}

export interface ComposicaoProdutosView {
    id?: number
    id_produto_base?: number
    id_projeto_impressao?: number
    produto_descricao?: string
    sku_base?: string
    codigo_projeto?: string
    nome_projeto?: string
    descricao_projeto?: string
    status?: ComposicaoStatus | null
    data_cadastro?: string
    configuracao_itens?: ComposicaoItemConfigModel[]
    variacoes_itens?: ComposicaoVariacaoItemModel[]
}

export interface ComposicaoProdutosModel {
    id?: number | string | null
    id_produto_base?: number | string | null
    id_projeto_impressao?: number | string | null
    configuracao_itens?: ComposicaoItemConfigModel[]
    variacoes_itens?: ComposicaoVariacaoItemModel[]
}

export interface CarregarComposicaoParams {
    id_produto_base: number | string
    id_projeto_impressao: number | string
}

export interface ComposicaoCorConfigurada {
    id?: number
    id_cor: number
    tipo_cor?: string
    descricao?: string | null
    codigo?: string | null
    hexadecimal?: string | null
}

export interface ComposicaoParteItemView {
    id: number
    nome_item?: string | null
    peso_total?: number | string | null
    tempo_impressao?: string | null
    cores?: {
        primarias?: ComposicaoCorConfigurada[]
        secundarias?: ComposicaoCorConfigurada[]
        terciarias?: ComposicaoCorConfigurada[]
    }
    variacoes?: ComposicaoVariacaoApiModel[]
}

export interface ComposicaoVariacaoApiModel {
    id?: number
    id_composicao_cor?: number
    id_parte?: number
    id_item_projeto?: number
    id_projeto_impressao_parte?: number | string | null
    id_projeto_impressao_parte_item?: number | string | null
    nome_parte?: string | null
    nome_item?: string | null
    tipo_cor?: string | null
    id_cor?: number
    descricao_variacao?: string | null
    cor?: {
        descricao?: string | null
        codigo?: string | null
        hexadecimal?: string | null
    }
    custo_item?: number | string | null
    filamento?: {
        id?: number
        resumo?: string | null
        preco_medio_grama?: number | string | null
        peso_item?: number | string | null
        custo_item?: number | string | null
    } | null
}

export interface ComposicaoParteConfigView {
    parte: {
        id: number
        nome_parte?: string | null
    }
    itens: ComposicaoParteItemView[]
    cores_disponiveis?: LookupItem[]
    tipos_cor?: string[]
    filamentos?: unknown[]
}

export interface ComposicaoSalvarCoresPartePayload {
    id_composicao: number
    id_parte: number
    itens: {
        id_item_projeto: number | string
        cores_primarias?: number[]
        cores_secundarias?: number[]
        cores_terciarias?: number[]
    }[]
}

export interface ComposicaoConfirmarVariacoesPayload {
    id_composicao: number
    id_parte?: number
    id_item_projeto?: number
}

export interface ComposicaoSalvarFilamentosPayload {
    id_composicao: number
    id_parte?: number
    filamentos: {
        id_variacao: number
        id_filamento: number | string
        peso_item: number | string
        preco_medio_grama?: number | string | null
    }[]
}

export interface ComposicaoProdutosInterface {
    getViewComposicaoProdutos(params: { id: number }): Promise<ComposicaoProdutosView | undefined>
    getConfigurarParte(params: { id: number; idParte: number | string }): Promise<ComposicaoParteConfigView | undefined>
    listComposicaoProdutosPaginate(params: ComposicaoProdutosSearch): Promise<any>
    carregarComposicao(params: CarregarComposicaoParams): Promise<ComposicaoProdutosView | undefined>
    createComposicaoProdutos(params: ComposicaoProdutosModel): Promise<number | undefined>
    editComposicaoProdutos(params: ComposicaoProdutosModel): Promise<any>
    salvarCoresParte(params: ComposicaoSalvarCoresPartePayload): Promise<any>
    gerarVariacoesParte(params: { id: number; idParte?: number | string; idItemProjeto?: number | string }): Promise<any>
    confirmarVariacoes(params: ComposicaoConfirmarVariacoesPayload): Promise<any>
    salvarFilamentosParte(params: ComposicaoSalvarFilamentosPayload): Promise<any>
    deleteComposicaoProdutos(id: number): Promise<any>
}

export const ComposicaoProdutosDefaultValues: ComposicaoProdutosModel = {
    id: null,
    id_produto_base: null,
    id_projeto_impressao: null,
    configuracao_itens: [],
    variacoes_itens: [],
}
