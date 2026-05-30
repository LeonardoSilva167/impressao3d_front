import { CorProjetoModel } from 'interfaces/ProjetosImpressao/CorProjetoInterface'
import { ItemParteProjetoModel } from 'interfaces/ProjetosImpressao/ItemParteProjetoInterface'
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'
import { ProjetosImpressaoList } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { PaginateInterface } from 'interfaces/SystemInterfaces/PaginateInterface'

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

export const filtrarEntradaTempoDecimal = (valor: string): string => {
    let result = ''
    let hasSeparator = false

    for (const char of valor) {
        if (/\d/.test(char)) {
            result += char
        } else if ((char === ',' || char === '.') && !hasSeparator) {
            result += char
            hasSeparator = true
        }
    }

    return result
}

export const normalizarTempoDecimalOnBlur = (valor: string | null | undefined): string => {
    if (!valor) return ''
    return String(valor).trim().replace('.', ',')
}

export const validarTempoDecimal = (valor: string | null | undefined): boolean | string => {
    if (!valor || !String(valor).trim()) return 'Informe o tempo total do projeto'
    const normalized = String(valor).trim()
    return /^\d+([,.]\d+)?$/.test(normalized) || 'Formato inválido. Use apenas números (ex: 3,5)'
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
    item: Pick<ItemParteProjetoModel, 'peso_parte' | 'peso_suporte' | 'peso_corado' | 'peso_torre'>
): number => {
    return (
        obterValorNumerico(item.peso_parte)
        + obterValorNumerico(item.peso_suporte)
        + obterValorNumerico(item.peso_corado)
        + obterValorNumerico(item.peso_torre)
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

export const normalizarProjetoImpressao = <T extends Record<string, any>>(projeto: T): T & ProjetosImpressaoList => ({
    ...projeto,
    partes: projeto.partes ? normalizarPartesProjeto(projeto.partes) : undefined,
})

export const normalizarProjetosImpressaoPaginate = (
    paginate: PaginateInterface<ProjetosImpressaoList>
): PaginateInterface<ProjetosImpressaoList> => ({
    ...paginate,
    data: paginate.data.map((item) => normalizarProjetoImpressao(item)),
})

export const normalizarItemParte = (item: Record<string, any>): ItemParteProjetoModel => ({
    id: item.id,
    id_projeto_impressao_parte: item.id_projeto_impressao_parte,
    nome_item: item.nome_item,
    id_cor: item.id_cor,
    cor_descricao: item.cor_descricao || item.descricao_cor,
    cor_hexadecimal: item.cor_hexadecimal || item.hexadecimal,
    altura_camada: item.altura_camada,
    loops_parede: item.loops_parede,
    temperatura_bico: item.temperatura_bico,
    temperatura_mesa: item.temperatura_mesa,
    tempo_impressao: item.tempo_impressao,
    peso_parte: item.peso_parte,
    peso_suporte: item.peso_suporte,
    peso_corado: item.peso_corado,
    peso_torre: item.peso_torre,
    peso_total: item.peso_total,
    usa_suporte: item.usa_suporte,
    angulo_suporte: item.angulo_suporte,
    tipo_suporte: item.tipo_suporte,
    distancia_z_inferior: item.distancia_z_inferior,
    quantidade_voltas: item.quantidade_voltas != null ? item.quantidade_voltas : item.quantidade_voltas_suporte,
    usa_brim: item.usa_brim,
    usa_engomagem: item.usa_engomagem,
    velocidade_engomagem: item.velocidade_engomagem,
    fluxo_engomagem: item.fluxo_engomagem,
})

export const normalizarPartesProjeto = (partes: ParteProjetoImpressaoModel[] = []): ParteProjetoImpressaoModel[] => (
    partes.map((parte) => ({
        id: parte.id,
        id_projeto_impressao: parte.id_projeto_impressao,
        nome_parte: parte.nome_parte,
        itens: (parte.itens || []).map((item) => normalizarItemParte(item as Record<string, any>)),
    }))
)

export interface LinhaParteItemTabela {
    parte: ParteProjetoImpressaoModel
    item?: ItemParteProjetoModel
    chave: string
}

export const flattenPartesItens = (partes: ParteProjetoImpressaoModel[]): LinhaParteItemTabela[] => {
    const linhas: LinhaParteItemTabela[] = []

    partes.forEach((parte) => {
        const itens = parte.itens || []

        if (!itens.length) {
            linhas.push({
                parte,
                chave: `parte-${parte.id}`,
            })
            return
        }

        itens.forEach((item) => {
            linhas.push({
                parte,
                item,
                chave: `item-${item.id}`,
            })
        })
    })

    return linhas
}

export const tempoParaMinutos = (tempo: string | null | undefined): number => {
    if (!tempo || !/^\d{1,2}:\d{2}$/.test(String(tempo).trim())) return 0
    const partes = String(tempo).trim().split(':')
    const horas = Number(partes[0]) || 0
    const minutos = Number(partes[1]) || 0
    return horas * 60 + minutos
}

export const minutosParaTempo = (totalMinutos: number): string => {
    const horas = Math.floor(totalMinutos / 60)
    const minutos = totalMinutos % 60
    return `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}`
}

export const calcularResumoPartesItens = (partes: ParteProjetoImpressaoModel[]) => {
    let totalItens = 0
    let totalMinutos = 0
    let totalPeso = 0

    partes.forEach((parte) => {
        (parte.itens || []).forEach((item) => {
            totalItens += 1
            totalMinutos += tempoParaMinutos(item.tempo_impressao)
            const peso = item.peso_total != null
                ? obterValorNumerico(item.peso_total)
                : calcularPesoTotalParte(item)
            totalPeso += peso
        })
    })

    return {
        totalItens,
        tempoTotal: minutosParaTempo(totalMinutos),
        pesoTotal: totalPeso,
    }
}
