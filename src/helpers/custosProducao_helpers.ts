import { formatarParaMoedaReal } from 'helpers/functions_helpers'
import { obterValorNumerico, tempoParaMinutos } from 'pages/Pages/ProjetosImpressao/hooks/useProjetosImpressao'

export interface CustosProducaoConfig {
    custo_energia_kwh: number
    custo_desgaste_hora: number
}

export interface CustosProducaoBreakdown {
    custo_filamento: number
    custo_energia: number
    custo_desgaste: number
    custo_total: number
}

export const CUSTOS_PRODUCAO_DEFAULT: CustosProducaoConfig = {
    custo_energia_kwh: 1.039,
    custo_desgaste_hora: 1.2,
}

export const tempoParaHoras = (tempo: string | null | undefined): number => {
    return tempoParaMinutos(tempo) / 60
}

export const calcularCustoEnergia = (
    tempo: string | null | undefined,
    custoEnergiaKwh: number = CUSTOS_PRODUCAO_DEFAULT.custo_energia_kwh
): number => {
    const horas = tempoParaHoras(tempo)
    if (horas <= 0 || custoEnergiaKwh <= 0) return 0
    return horas * custoEnergiaKwh
}

export const calcularCustoDesgaste = (
    tempo: string | null | undefined,
    custoDesgasteHora: number = CUSTOS_PRODUCAO_DEFAULT.custo_desgaste_hora
): number => {
    const horas = tempoParaHoras(tempo)
    if (horas <= 0 || custoDesgasteHora <= 0) return 0
    return horas * custoDesgasteHora
}

export const calcularCustoFilamento = (
    pesoGramas: number | string | null | undefined,
    precoMedioGrama: number | string | null | undefined
): number => {
    const peso = obterValorNumerico(pesoGramas)
    const preco = obterValorNumerico(precoMedioGrama)
    if (peso <= 0 || preco <= 0) return 0
    return peso * preco
}

export const calcularCustoTotalProducao = (
    custoFilamento: number,
    custoEnergia: number,
    custoDesgaste: number
): number => {
    return obterValorNumerico(custoFilamento)
        + obterValorNumerico(custoEnergia)
        + obterValorNumerico(custoDesgaste)
}

export const calcularCustosProducao = (params: {
    peso?: number | string | null
    tempo?: string | null
    precoMedioGrama?: number | string | null
    custoFilamento?: number | string | null
    config?: Partial<CustosProducaoConfig>
}): CustosProducaoBreakdown => {
    const config = { ...CUSTOS_PRODUCAO_DEFAULT, ...params.config }
    const custo_filamento = params.custoFilamento != null
        ? obterValorNumerico(params.custoFilamento)
        : calcularCustoFilamento(params.peso, params.precoMedioGrama)
    const custo_energia = calcularCustoEnergia(params.tempo, config.custo_energia_kwh)
    const custo_desgaste = calcularCustoDesgaste(params.tempo, config.custo_desgaste_hora)
    const custo_total = calcularCustoTotalProducao(custo_filamento, custo_energia, custo_desgaste)

    return { custo_filamento, custo_energia, custo_desgaste, custo_total }
}

const obterCampoCusto = (
    fonte: {
        custo_filamento?: number | string | null
        custo_energia?: number | string | null
        custo_desgaste?: number | string | null
        custo_total?: number | string | null
        custo?: number | string | null
        custo_estimado?: number | string | null
    } | null | undefined,
    campo: 'custo_filamento' | 'custo_energia' | 'custo_desgaste' | 'custo_total' | 'custo' | 'custo_estimado'
): number | string | null | undefined => {
    if (!fonte) return undefined
    return fonte[campo]
}

export const extrairCustosProducao = (fonte: {
    custo_filamento?: number | string | null
    custo_energia?: number | string | null
    custo_desgaste?: number | string | null
    custo_total?: number | string | null
    custo?: number | string | null
    custo_estimado?: number | string | null
} | null | undefined): CustosProducaoBreakdown => {
    let custoFilamentoFonte = obterCampoCusto(fonte, 'custo_filamento')
    if (custoFilamentoFonte == null) custoFilamentoFonte = obterCampoCusto(fonte, 'custo')
    if (custoFilamentoFonte == null) custoFilamentoFonte = obterCampoCusto(fonte, 'custo_estimado')
    const custo_filamento = obterValorNumerico(custoFilamentoFonte)
    const custo_energia = obterValorNumerico(obterCampoCusto(fonte, 'custo_energia'))
    const custo_desgaste = obterValorNumerico(obterCampoCusto(fonte, 'custo_desgaste'))
    const custoTotalFonte = obterCampoCusto(fonte, 'custo_total')
    const custo_total = obterValorNumerico(custoTotalFonte)
        || calcularCustoTotalProducao(custo_filamento, custo_energia, custo_desgaste)

    return { custo_filamento, custo_energia, custo_desgaste, custo_total }
}

export const formatarCustoProducao = (valor: number | string | null | undefined): string => {
    const num = obterValorNumerico(valor)
    if (num <= 0) return '—'
    return formatarParaMoedaReal(num)
}

export const formatarCustoProducaoOuZero = (valor: number | string | null | undefined): string => {
    return formatarParaMoedaReal(obterValorNumerico(valor))
}
