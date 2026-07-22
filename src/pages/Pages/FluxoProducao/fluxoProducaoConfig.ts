import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import {
    anexarContextoFluxo,
    FluxoProducaoQuery,
    montarParamsFluxo,
} from './fluxoProducaoContext'

export type EtapaFluxoId = 1 | 2 | 3

export interface AcaoEtapaFluxo {
    label: string
    to: string
    /** primary | secondary | tertiary — controla hierarquia visual no hub */
    nivel?: 'primary' | 'secondary' | 'tertiary'
    /** Quando true, anexa `fluxo=1` ao link */
    fluxoGuiado?: boolean
    badge?: string
    /** Ícone remix (ex.: ri-add-line) no botão primário */
    icone?: string
}

export interface EtapaFluxoConfig {
    id: EtapaFluxoId
    tituloCurto: string
    titulo: string
    resumo: string
    /** Título do card de CTA (ex.: Comece por aqui!) */
    ctaTitulo?: string
    /** Texto de apoio do card de CTA */
    ctaDescricao?: string
    /** Ícone remix do card de CTA */
    ctaIcone?: string
    detalhes: string[]
    acoes: AcaoEtapaFluxo[]
}

export const FLUXO_PRODUCAO_ETAPAS: EtapaFluxoConfig[] = [
    {
        id: 1,
        tituloCurto: 'O que vende',
        titulo: '1. O que vende',
        resumo: `Cadastre o ${DominioProducaoLabels.produtoBase}: descrição, categoria, modelo e linha.`,
        ctaTitulo: 'Comece por aqui!',
        ctaDescricao: 'Clique no botão ao lado para iniciar o cadastro do seu produto base.',
        ctaIcone: 'ri-flag-line',
        detalhes: [
            'Gera o código e o SKU base do catálogo.',
            'Ainda não define impressão, filamento nem montagem.',
        ],
        acoes: [
            {
                label: 'Cadastrar produto',
                to: '/produtos/add',
                nivel: 'primary',
                fluxoGuiado: true,
                icone: 'ri-add-line',
            },
            {
                label: 'Ver produtos',
                to: '/produtos',
                nivel: 'tertiary',
            },
        ],
    },
    {
        id: 2,
        tituloCurto: 'Como se imprime',
        titulo: '2. Como se imprime',
        resumo: `Projeto (ex.: Makework) → partes e dados do fatiador → ${DominioProducaoLabels.vinculo} com cores e filamento.`,
        ctaTitulo: 'Continue por aqui!',
        ctaDescricao: 'Cadastre o projeto de impressão. Se já tiver um, avance para criar o vínculo.',
        ctaIcone: 'ri-printer-line',
        detalhes: [
            `Cadastre o ${DominioProducaoLabels.projetoImpressao} com a URL e as partes/itens do fatiador.`,
            `Crie o ${DominioProducaoLabels.vinculo} ligando o produto ao projeto.`,
            'Em cada parte: escolha cores, gere as configurações e selecione o filamento.',
        ],
        acoes: [
            {
                label: 'Cadastrar projeto',
                to: '/projetos-impressao/add',
                nivel: 'primary',
                fluxoGuiado: true,
                icone: 'ri-add-line',
            },
            {
                label: 'Selecionar existente',
                to: '/projetos-impressao',
                nivel: 'secondary',
                fluxoGuiado: true,
                icone: 'ri-folder-open-line',
            },
            {
                label: `Criar ${DominioProducaoLabels.vinculoCurto.toLowerCase()}`,
                to: '/composicao-produtos/add',
                nivel: 'tertiary',
                fluxoGuiado: true,
            },
        ],
    },
    {
        id: 3,
        tituloCurto: 'Montagem',
        titulo: '3. Montagem',
        resumo: `${DominioProducaoLabels.montagem}: combine partes do projeto em kits e gere os SKUs finais.`,
        ctaTitulo: 'Finalize por aqui!',
        ctaDescricao: 'Com o vínculo e as partes configurados, crie a montagem do produto.',
        ctaIcone: 'ri-stack-line',
        detalhes: [
            'Só funciona depois que o vínculo e as partes estiverem configurados.',
            'Cada combinação gera produtos com peso, tempo e custos agregados.',
        ],
        acoes: [
            {
                label: `Criar ${DominioProducaoLabels.montagemCurta.toLowerCase()}`,
                to: '/grade-produtos/add',
                nivel: 'primary',
                fluxoGuiado: true,
                icone: 'ri-add-line',
            },
            {
                label: `Ver ${DominioProducaoLabels.montagem.toLowerCase()}`,
                to: '/grade-produtos',
                nivel: 'tertiary',
            },
        ],
    },
]

const ROTAS_FLUXO_PREFIXOS = [
    '/fluxo-producao',
    '/produtos',
    '/projetos-impressao',
    '/composicao-produtos',
    '/grade-produtos',
]

export const isRotaFluxoProducao = (pathname: string): boolean => {
    return ROTAS_FLUXO_PREFIXOS.some((prefixo) => (
        pathname === prefixo || pathname.startsWith(`${prefixo}/`)
    ))
}

export const inferirEtapaPorRota = (pathname: string, etapaQuery?: number | null): EtapaFluxoId => {
    if (pathname === '/fluxo-producao' || pathname.startsWith('/fluxo-producao/')) {
        if (etapaQuery === 2 || etapaQuery === 3) return etapaQuery
        return 1
    }

    if (pathname.startsWith('/produtos')) return 1
    if (pathname.startsWith('/projetos-impressao') || pathname.startsWith('/composicao-produtos')) return 2
    if (pathname.startsWith('/grade-produtos')) return 3

    return 1
}

export const obterContextoRotaFluxo = (pathname: string): string => {
    if (pathname.startsWith('/fluxo-producao')) return DominioProducaoLabels.fluxoProducao
    if (pathname.startsWith('/produtos')) return DominioProducaoLabels.produtoBase
    if (pathname.startsWith('/projetos-impressao')) return DominioProducaoLabels.projetoImpressao
    if (pathname.startsWith('/composicao-produtos')) return DominioProducaoLabels.vinculo
    if (pathname.startsWith('/grade-produtos')) return DominioProducaoLabels.montagem
    return DominioProducaoLabels.fluxoProducao
}

export const montarHrefEtapaFluxo = (
    etapa: EtapaFluxoId,
    contextoOuProduto?: FluxoProducaoQuery | string | null
): string => {
    const contexto: FluxoProducaoQuery = typeof contextoOuProduto === 'object' && contextoOuProduto !== null
        ? contextoOuProduto
        : { produto: contextoOuProduto }

    const params = montarParamsFluxo(contexto, { etapa: String(etapa) })
    return `/fluxo-producao?${params.toString()}`
}

/** @deprecated Prefira anexarContextoFluxo com FluxoProducaoQuery */
export const montarHrefAcaoFluxo = (
    to: string,
    produtoId?: string | null,
    forcarFluxo = false
): string => {
    return anexarContextoFluxo(to, { produto: produtoId }, { forcarFluxo })
}

export const classeBotaoAcaoFluxo = (nivel?: AcaoEtapaFluxo['nivel']): string => {
    switch (nivel) {
        case 'primary':
            return 'btn-primary'
        case 'secondary':
            return 'btn-outline-primary'
        case 'tertiary':
            return 'btn-soft-secondary'
        default:
            return 'btn-soft-primary'
    }
}

export const textosProximoPassoEtapa2 = (params: {
    produtoId?: string | null
    projetoId?: string | null
    composicaoId?: string | null
}): { opcaoA: string; opcaoB: string } => {
    const { produtoId, projetoId, composicaoId } = params

    if (!produtoId) {
        return {
            opcaoA: 'Próximo: volte à etapa 1 e cadastre o produto base.',
            opcaoB: '',
        }
    }

    if (!projetoId) {
        return {
            opcaoA: 'Próximo: cadastrar um projeto de impressão',
            opcaoB: 'Já tem projeto? Continuar para criar o vínculo',
        }
    }

    if (!composicaoId) {
        return {
            opcaoA: `Próximo: criar o ${DominioProducaoLabels.vinculo.toLowerCase()}`,
            opcaoB: 'Projeto já definido — confirme o vínculo produto–projeto.',
        }
    }

    return {
        opcaoA: 'Próximo: configurar as partes do vínculo',
        opcaoB: `Depois, avance para a ${DominioProducaoLabels.montagemCurta.toLowerCase()}.`,
    }
}

/** Progresso mínimo usado para liberar etapas do hub. */
export interface ProgressoEtapasFluxo {
    produtoOk: boolean
    projetoOk: boolean
    vinculoOk: boolean
    partesOk: boolean
    montagemOk: boolean
}

export const montarProgressoEtapasFluxo = (params: {
    produtoId?: string | null
    projetoId?: string | null
    composicaoId?: string | null
    partesConfiguradas?: boolean
    montagemCriada?: boolean
}): ProgressoEtapasFluxo => ({
    produtoOk: Boolean(params.produtoId),
    projetoOk: Boolean(params.projetoId),
    vinculoOk: Boolean(params.composicaoId),
    partesOk: Boolean(params.partesConfiguradas),
    montagemOk: Boolean(params.montagemCriada),
})

/**
 * Etapa 2 exige produto.
 * Etapa 3 exige vínculo (partes ficam como subpasso da etapa 2 no checklist).
 */
export const etapaFluxoLiberada = (
    etapa: EtapaFluxoId,
    progresso: ProgressoEtapasFluxo
): boolean => {
    if (etapa === 1) return true
    if (etapa === 2) return progresso.produtoOk
    return progresso.vinculoOk
}

export const obterEtapaMaximaLiberada = (progresso: ProgressoEtapasFluxo): EtapaFluxoId => {
    if (etapaFluxoLiberada(3, progresso)) return 3
    if (etapaFluxoLiberada(2, progresso)) return 2
    return 1
}

export const normalizarEtapaFluxo = (
    etapaDesejada: EtapaFluxoId,
    progresso: ProgressoEtapasFluxo
): EtapaFluxoId => {
    const maxima = obterEtapaMaximaLiberada(progresso)
    return etapaDesejada > maxima ? maxima : etapaDesejada
}
