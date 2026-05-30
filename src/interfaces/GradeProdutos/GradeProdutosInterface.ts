export type GradeProdutosStatus = 'PENDENTE' | 'GERADA' | 'CONCLUIDA' | 'EM_ANDAMENTO' | string

export interface GradeProdutosSearch {
    id?: string | number | undefined | null
    id_produto_base?: string | number | undefined | null
    sku?: string | undefined | null
    nome_produto?: string | undefined | null
    codigo_base?: string | undefined | null
    parte?: string | undefined | null
    status?: string | number | boolean | undefined | null
    descricao?: string | undefined | null
    palavra_chave?: string | null | undefined | unknown
}

export interface GradeParteResumo {
    nome_parte?: string | null
}

export interface GradeProdutosList {
    id?: number
    descricao?: string
    codigo_base?: string | number | null
    partes?: Array<GradeParteResumo | string>
    partes_utilizadas?: GradeParteResumo[]
    partes_descricao?: string | null
    quantidade_combinacoes?: number | null
    combinacoes?: unknown[]
    produto_base?: string
    produto_descricao?: string
    sku_base?: string
    quantidade_produtos?: number
    produtos_gerados?: number
    status?: GradeProdutosStatus | null
    data_criacao?: string
}

export interface GradeParteDisponivel {
    id?: number | string
    id_parte?: number | string
    id_projeto_impressao_parte?: number | string
    nome_parte?: string | null
    selecionada?: boolean
}

export interface GradeItemDisponivel {
    id?: number | string
    id_parte?: number | string
    nome_parte?: string | null
    nome_item?: string | null
    peso?: number | string | null
    tempo?: string | null
}

export interface GradeVariacaoDisponivel {
    id?: number | string
    id_parte?: number | string
    nome_parte?: string | null
    nome_item?: string | null
    descricao?: string | null
    cor_descricao?: string | null
    descricao_filamento?: string | null
}

export interface GradeProdutosCarregarDados {
    id_composicao?: number
    id_produto_base?: number
    produto_descricao?: string
    sku_base?: string
    partes?: GradeParteDisponivel[]
    itens?: GradeItemDisponivel[]
    variacoes?: GradeVariacaoDisponivel[]
}

export interface GradeProdutoGeradoList {
    id?: number
    id_grade_produto?: number
    nome_produto?: string
    sku?: string
    codigo_base?: string | number | null
    descricao_combinacao?: string | null
    partes?: string | null
    partes_utilizadas?: GradeParteResumo[]
    peso_total?: number | string | null
    tempo_total?: string | null
    custo_filamento?: number | string | null
    custo_energia?: number | string | null
    custo_desgaste?: number | string | null
    custo_total?: number | string | null
    status?: string | number | boolean | null
}

export interface GradeProdutosView {
    id?: number
    descricao?: string
    id_produto_base?: number
    codigo_base?: string | number | null
    produto_base?: string
    produto_descricao?: string
    sku_base?: string
    partes?: Array<GradeParteResumo | string>
    partes_utilizadas?: GradeParteResumo[]
    partes_descricao?: string | null
    quantidade_combinacoes?: number | null
    quantidade_produtos?: number
    status?: GradeProdutosStatus | null
    data_criacao?: string
    combinacoes?: GradeCombinacao[]
    produtos_gerados?: GradeProdutoGeradoList[]
}

export interface GradeProdutoGeradoParte {
    nome_parte?: string | null
    cor?: string | null
}

export interface GradeProdutoGeradoItem {
    nome_parte?: string | null
    nome_item?: string | null
    cor?: string | null
}

export interface GradeProdutoGeradoFilamento {
    descricao?: string | null
    peso?: number | string | null
    custo?: number | string | null
}

export interface GradeProdutoGeradoCor {
    descricao?: string | null
    codigo?: string | null
    hexadecimal?: string | null
}

export interface GradeProdutoGeradoView {
    id?: number
    id_grade?: number
    nome_produto?: string
    sku?: string
    peso_total?: number | string | null
    tempo_total?: string | null
    custo_filamento?: number | string | null
    custo_energia?: number | string | null
    custo_desgaste?: number | string | null
    custo_total?: number | string | null
    status?: string | null
    partes_utilizadas?: GradeProdutoGeradoParte[]
    itens_utilizados?: GradeProdutoGeradoItem[]
    filamentos_utilizados?: GradeProdutoGeradoFilamento[]
    cores_utilizadas?: GradeProdutoGeradoCor[]
}

export interface GradeCombinacaoParte {
    id_parte: number | string
    nome_parte?: string | null
    quantidade: number
}

export interface GradeCombinacao {
    id?: number | string | null
    descricao: string
    partes: GradeCombinacaoParte[]
}

export interface GradeCombinacaoPayload {
    id?: number | string | null
    descricao: string
    partes: Array<{ id_parte: number | string; quantidade: number }>
}

export interface GradeProdutosModel {
    id?: number | string | null
    id_produto_base?: number | string | null
    combinacoes?: GradeCombinacaoPayload[]
    descricao?: string | null
}

export interface GerarGradePayload {
    id?: number | string | null
    id_produto_base: number | string
    combinacoes: GradeCombinacaoPayload[]
}

export interface GradeProdutosInterface {
    getViewGradeProdutos(params: { id: number }): Promise<GradeProdutosView | undefined>
    getViewProdutoGerado(params: { id: number }): Promise<GradeProdutoGeradoView | undefined>
    listGradeProdutosPaginate(params: GradeProdutosSearch): Promise<any>
    listProdutosGeradosPaginate(params: GradeProdutosSearch): Promise<any>
    carregarDados(params: { id_produto_base: number | string }): Promise<GradeProdutosCarregarDados | undefined>
    gerarGrade(params: GerarGradePayload): Promise<number | undefined>
    editGradeProdutos(params: GradeProdutosModel): Promise<any>
    deleteGradeProdutos(id: number): Promise<any>
}

export const GradeProdutosDefaultValues: GradeProdutosModel = {
    id: null,
    id_produto_base: null,
    combinacoes: [],
    descricao: null,
}
