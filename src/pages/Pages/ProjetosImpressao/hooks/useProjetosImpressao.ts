import { CorProjetoModel } from 'interfaces/ProjetosImpressao/CorProjetoInterface'
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'

export const obterValorNumerico = (valor: number | string | null | undefined): number => {
    if (typeof valor === 'string') {
        const parsed = parseFloat(valor.replace(',', '.'))
        return isNaN(parsed) ? 0 : parsed
    }
    const num = Number(valor != null ? valor : 0)
    return isNaN(num) ? 0 : num
}

export const validarTempoHHmm = (valor: string | null | undefined): boolean | string => {
    if (!valor) return 'Informe o tempo no formato HH:mm'
    return /^\d{1,2}:\d{2}$/.test(String(valor).trim()) || 'Formato inválido. Use HH:mm (ex: 01:30)'
}

export const formatarNumeroDecimal = (valor: number, casas = 2): string => {
    return valor.toLocaleString('pt-BR', {
        minimumFractionDigits: casas,
        maximumFractionDigits: casas,
    })
}

export const calcularSomaPesoCores = (cores: CorProjetoModel[]): number => {
    return cores.reduce((acc, cor) => acc + obterValorNumerico(cor.peso_gramas), 0)
}

export const validarSomaCoresIgualPesoTotal = (
    cores: CorProjetoModel[],
    pesoTotal: number | string | null | undefined
): boolean => {
    const somaCores = calcularSomaPesoCores(cores)
    const peso = obterValorNumerico(pesoTotal)
    if (peso <= 0) return false
    return Math.abs(somaCores - peso) < 0.01
}

export const formatarSimNao = (valor: boolean | undefined): string => {
    return valor ? 'Sim' : 'Não'
}

export const calcularPesoTotalParte = (
    parte: Pick<ParteProjetoImpressaoModel, 'peso_parte' | 'peso_suporte' | 'peso_corado' | 'peso_torre'>
): number => {
    return (
        obterValorNumerico(parte.peso_parte)
        + obterValorNumerico(parte.peso_suporte)
        + obterValorNumerico(parte.peso_corado)
        + obterValorNumerico(parte.peso_torre)
    )
}

export const formatarHexadecimalCss = (hexadecimal: string | null | undefined): string | undefined => {
    if (!hexadecimal) return undefined
    return hexadecimal.startsWith('#') ? hexadecimal : `#${hexadecimal}`
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

export const calcularCustoTotalFilamentos = (filamentos: CorProjetoModel[]): number => {
    return filamentos.reduce(
        (acc, filamento) => acc + obterValorNumerico(filamento.custo_estimado),
        0
    )
}

export const normalizarCoresProjeto = (cores: CorProjetoModel[]): CorProjetoModel[] => {
    return cores.map((cor, index) => {
        const peso = cor.peso_gramas != null ? cor.peso_gramas : (cor as any).peso
        const preco = cor.preco_medio_grama
        const custo = cor.custo_estimado != null
            ? obterValorNumerico(cor.custo_estimado)
            : calcularCustoFilamento(peso, preco)

        return {
            id: cor.id != null ? cor.id : `temp-${index}`,
            id_cor: cor.id_cor,
            id_filamento: cor.id_filamento,
            peso_gramas: peso,
            descricao_cor: cor.descricao_cor || (cor as any).descricao || (cor as any).cor || '',
            hexadecimal_cor: cor.hexadecimal_cor || (cor as any).hexadecimal || null,
            descricao_filamento: cor.descricao_filamento || (cor as any).filamento || (cor as any).resumo_filamento || '',
            preco_medio_grama: preco,
            custo_estimado: custo,
        }
    })
}
