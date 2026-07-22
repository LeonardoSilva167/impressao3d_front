import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'

export type EtapaFluxoId = 1 | 2 | 3

export interface AcaoEtapaFluxo {
    label: string
    to: string
    primary?: boolean
}

export interface EtapaFluxoConfig {
    id: EtapaFluxoId
    tituloCurto: string
    titulo: string
    resumo: string
    detalhes: string[]
    acoes: AcaoEtapaFluxo[]
}

export const FLUXO_PRODUCAO_ETAPAS: EtapaFluxoConfig[] = [
    {
        id: 1,
        tituloCurto: 'O que vende',
        titulo: '1. O que vende',
        resumo: `Cadastre o ${DominioProducaoLabels.produtoBase}: descrição, categoria, modelo e linha.`,
        detalhes: [
            'Gera o código e o SKU base do catálogo.',
            'Ainda não define impressão, filamento nem montagem.',
        ],
        acoes: [
            { label: 'Cadastrar produto', to: '/produtos/add', primary: true },
            { label: 'Ver produtos', to: '/produtos' },
        ],
    },
    {
        id: 2,
        tituloCurto: 'Como se imprime',
        titulo: '2. Como se imprime',
        resumo: `Projeto (ex.: Makework) → partes e dados do fatiador → ${DominioProducaoLabels.vinculo} com cores e filamento.`,
        detalhes: [
            `Cadastre o ${DominioProducaoLabels.projetoImpressao} com a URL e as partes/itens do fatiador.`,
            `Crie o ${DominioProducaoLabels.vinculo} ligando o produto ao projeto.`,
            'Em cada parte: escolha cores, gere as configurações e selecione o filamento.',
        ],
        acoes: [
            { label: 'Cadastrar projeto', to: '/projetos-impressao/add', primary: true },
            { label: `Criar ${DominioProducaoLabels.vinculoCurto.toLowerCase()}`, to: '/composicao-produtos/add' },
            { label: `Ver ${DominioProducaoLabels.vinculo.toLowerCase()}s`, to: '/composicao-produtos' },
        ],
    },
    {
        id: 3,
        tituloCurto: 'Como se monta',
        titulo: '3. Como se monta',
        resumo: `${DominioProducaoLabels.montagem}: combine partes do projeto em kits e gere os SKUs finais.`,
        detalhes: [
            'Só funciona depois que o vínculo e as partes estiverem configurados.',
            'Cada combinação gera produtos com peso, tempo e custos agregados.',
        ],
        acoes: [
            {
                label: `Criar ${DominioProducaoLabels.montagemCurta.toLowerCase()}`,
                to: '/grade-produtos/add',
                primary: true,
            },
            { label: `Ver ${DominioProducaoLabels.montagem.toLowerCase()}`, to: '/grade-produtos' },
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

export const montarHrefEtapaFluxo = (etapa: EtapaFluxoId, produtoId?: string | null): string => {
    const params = new URLSearchParams()
    params.set('etapa', String(etapa))
    if (produtoId) params.set('produto', produtoId)
    return `/fluxo-producao?${params.toString()}`
}
