import React from 'react'
import { Link } from 'react-router-dom'
import { DominioProducaoLabels } from 'constants/dominioProducaoLabels'
import { AcaoEtapaFluxo, classeBotaoAcaoFluxo } from './fluxoProducaoConfig'
import { FluxoProducaoQuery, anexarContextoFluxo } from './fluxoProducaoContext'

export type SubpassoFluxoCodigo =
    | 'E1_PRODUTO'
    | 'E2_PROJETO'
    | 'E2_VINCULO'
    | 'E2_PARTES'
    | 'E3_MONTAGEM'

export interface ItemChecklistFluxo {
    codigo: SubpassoFluxoCodigo
    titulo: string
    descricao?: string
    concluido: boolean
    atual?: boolean
    icone?: string
    detalheLinha?: string
    linkAbrir?: { label: string; to: string }
    acoes?: AcaoEtapaFluxo[]
}

export interface ProdutoResumoFluxo {
    id: string | number
    descricao?: string | null
    sku_base?: string | null
}

interface FluxoProducaoChecklistProps {
    itens: ItemChecklistFluxo[]
    contexto: FluxoProducaoQuery
}

const hrefAcao = (acao: AcaoEtapaFluxo, contexto: FluxoProducaoQuery) => (
    anexarContextoFluxo(acao.to, contexto, { forcarFluxo: Boolean(acao.fluxoGuiado) })
)

export const montarItensChecklistFluxo = (params: {
    produtoId?: string | null
    projetoId?: string | null
    composicaoId?: string | null
    partesConfiguradas?: boolean
    montagemCriada?: boolean
    etapaAtiva?: number
    produto?: ProdutoResumoFluxo | null
}): ItemChecklistFluxo[] => {
    const {
        produtoId,
        projetoId,
        composicaoId,
        partesConfiguradas = false,
        montagemCriada = false,
        etapaAtiva,
        produto,
    } = params

    const e1 = Boolean(produtoId)
    const e2Projeto = Boolean(projetoId)
    const e2Vinculo = Boolean(composicaoId)
    const e2Partes = partesConfiguradas
    const e3 = montagemCriada

    // Primeiro subpasso incompleto = "próximo passo" (card azul com ações)
    const proximoCodigo: SubpassoFluxoCodigo | null = !e1
        ? 'E1_PRODUTO'
        : !e2Projeto
            ? 'E2_PROJETO'
            : !e2Vinculo
                ? 'E2_VINCULO'
                : !e2Partes
                    ? 'E2_PARTES'
                    : !e3
                        ? 'E3_MONTAGEM'
                        : null

    // Na etapa 3, prioriza montagem como foco visual se ainda pendente
    const codigoAtual: SubpassoFluxoCodigo | null =
        etapaAtiva === 3 && !e3
            ? 'E3_MONTAGEM'
            : etapaAtiva === 1 && !e1
                ? 'E1_PRODUTO'
                : proximoCodigo

    const isAtual = (codigo: SubpassoFluxoCodigo) => codigoAtual === codigo

    return [
        {
            codigo: 'E1_PRODUTO',
            titulo: e1
                ? `${DominioProducaoLabels.produtoBase} cadastrado`
                : `Cadastrar ${DominioProducaoLabels.produtoBase.toLowerCase()}`,
            descricao: e1
                ? undefined
                : 'Cadastre o produto base: descrição, categoria, modelo e linha.',
            concluido: e1,
            atual: isAtual('E1_PRODUTO'),
            icone: 'ri-shopping-bag-3-line',
            detalheLinha: e1
                ? [
                    produto?.descricao || `Produto #${produtoId}`,
                    produto?.sku_base ? `SKU: ${produto.sku_base}` : null,
                ].filter(Boolean).join(' · ')
                : undefined,
            linkAbrir: e1
                ? { label: 'Abrir produto', to: `/produtos/view/${produtoId}` }
                : undefined,
            acoes: isAtual('E1_PRODUTO')
                ? [
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
                        nivel: 'secondary',
                        icone: 'ri-folder-open-line',
                    },
                ]
                : undefined,
        },
        {
            codigo: 'E2_PROJETO',
            titulo: e2Projeto
                ? `${DominioProducaoLabels.projetoImpressao} definido`
                : `Cadastrar ou escolher ${DominioProducaoLabels.projetoImpressao.toLowerCase()}`,
            descricao: e2Projeto
                ? undefined
                : 'Cadastre um novo projeto ou selecione um já existente. Inclui o arquivo 3D (STL/3MF) e os dados do fatiador.',
            concluido: e2Projeto,
            atual: isAtual('E2_PROJETO'),
            icone: 'ri-file-list-3-line',
            detalheLinha: e2Projeto ? `Projeto #${projetoId}` : undefined,
            linkAbrir: e2Projeto
                ? { label: 'Abrir projeto', to: `/projetos-impressao/view/${projetoId}` }
                : undefined,
            acoes: isAtual('E2_PROJETO')
                ? [
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
                ]
                : undefined,
        },
        {
            codigo: 'E2_VINCULO',
            titulo: e2Vinculo
                ? `${DominioProducaoLabels.vinculo} criado`
                : `Criar ${DominioProducaoLabels.vinculo.toLowerCase()}`,
            descricao: e2Vinculo
                ? undefined
                : `Vincule o ${DominioProducaoLabels.produtoBase.toLowerCase()} ao ${DominioProducaoLabels.projetoImpressao.toLowerCase()}.`,
            concluido: e2Vinculo,
            atual: isAtual('E2_VINCULO'),
            icone: 'ri-link',
            detalheLinha: e2Vinculo ? `Vínculo #${composicaoId}` : undefined,
            linkAbrir: e2Vinculo
                ? { label: 'Abrir vínculo', to: `/composicao-produtos/view/${composicaoId}` }
                : undefined,
            acoes: isAtual('E2_VINCULO')
                ? [
                    {
                        label: `Criar ${DominioProducaoLabels.vinculoCurto.toLowerCase()}`,
                        to: '/composicao-produtos/add',
                        nivel: 'primary',
                        fluxoGuiado: true,
                        icone: 'ri-add-line',
                    },
                    {
                        label: `Ver ${DominioProducaoLabels.vinculo.toLowerCase()}s`,
                        to: '/composicao-produtos',
                        nivel: 'secondary',
                        icone: 'ri-folder-open-line',
                    },
                ]
                : undefined,
        },
        {
            codigo: 'E2_PARTES',
            titulo: e2Partes ? 'Partes configuradas' : 'Configurar partes',
            descricao: e2Partes
                ? undefined
                : 'Defina cores, configurações de impressão e filamento de cada parte.',
            concluido: e2Partes,
            atual: isAtual('E2_PARTES'),
            icone: 'ri-box-3-line',
            linkAbrir: e2Partes && composicaoId
                ? { label: 'Abrir vínculo', to: `/composicao-produtos/view/${composicaoId}` }
                : undefined,
            acoes: isAtual('E2_PARTES') && composicaoId
                ? [
                    {
                        label: 'Configurar partes',
                        to: `/composicao-produtos/view/${composicaoId}`,
                        nivel: 'primary',
                        fluxoGuiado: true,
                        icone: 'ri-settings-3-line',
                    },
                ]
                : undefined,
        },
        {
            codigo: 'E3_MONTAGEM',
            titulo: e3
                ? `${DominioProducaoLabels.montagem} criada`
                : `Criar ${DominioProducaoLabels.montagemCurta.toLowerCase()}`,
            descricao: e3
                ? undefined
                : 'Monte as partes para finalizar o produto e gerar os SKUs.',
            concluido: e3,
            atual: isAtual('E3_MONTAGEM'),
            icone: 'ri-stack-line',
            acoes: isAtual('E3_MONTAGEM')
                ? [
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
                        nivel: 'secondary',
                        icone: 'ri-folder-open-line',
                    },
                ]
                : undefined,
        },
    ]
}

const IconeItem = ({
    item,
    numero,
}: {
    item: ItemChecklistFluxo
    numero: number
}) => {
    if (item.concluido) {
        return (
            <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-success text-white"
                style={{ width: 40, height: 40 }}
                aria-hidden
            >
                <i className="ri-check-line fs-5" />
            </div>
        )
    }

    if (item.atual) {
        return (
            <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-primary-subtle text-primary border border-primary-subtle"
                style={{ width: 40, height: 40 }}
                aria-hidden
            >
                <i className={`${item.icone || 'ri-flag-line'} fs-5`} />
            </div>
        )
    }

    return (
        <div
            className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-light text-muted border"
            style={{ width: 36, height: 36, fontSize: '0.85rem' }}
            aria-hidden
        >
            {item.icone ? <i className={item.icone} /> : numero}
        </div>
    )
}

const FluxoProducaoChecklist = ({ itens, contexto }: FluxoProducaoChecklistProps) => {
    return (
        <div className="fluxo-producao-checklist mb-4">
            <h6 className="text-muted text-uppercase small mb-3 fw-semibold" style={{ letterSpacing: '0.04em' }}>
                Progresso do fluxo
            </h6>

            <div className="d-flex flex-column gap-2">
                {itens.map((item, index) => {
                    const concluido = item.concluido
                    const atual = Boolean(item.atual && !concluido)
                    const pendente = !concluido && !atual

                    const cardClass = [
                        'rounded-3 border p-3',
                        atual ? 'border-primary shadow-sm' : '',
                    ].filter(Boolean).join(' ')

                    const cardStyle: React.CSSProperties = concluido
                        ? {
                            backgroundColor: 'rgba(10, 179, 156, 0.06)',
                            borderColor: 'rgba(10, 179, 156, 0.35)',
                        }
                        : atual
                            ? { backgroundColor: 'var(--vz-primary-bg-subtle, rgba(64, 81, 137, 0.08))' }
                            : {
                                backgroundColor: 'var(--vz-secondary-bg, #fff)',
                                borderColor: 'var(--vz-border-color, #e9ebec)',
                            }

                    return (
                        <div key={item.codigo} className={cardClass} style={cardStyle}>
                            <div className="d-flex gap-3 align-items-start">
                                <IconeItem item={item} numero={index + 1} />

                                <div className="flex-grow-1 min-w-0">
                                    <div className="d-flex flex-wrap align-items-center gap-2 mb-1">
                                        <span
                                            className={[
                                                'fw-semibold',
                                                concluido ? 'text-success' : '',
                                                atual ? 'text-body' : '',
                                                pendente ? 'text-muted' : '',
                                            ].filter(Boolean).join(' ')}
                                        >
                                            {item.titulo}
                                        </span>
                                        {atual && (
                                            <span className="badge bg-primary">Próximo passo</span>
                                        )}
                                    </div>

                                    {item.detalheLinha && (
                                        <div className={concluido ? 'small text-body' : 'small text-muted'}>
                                            {item.detalheLinha}
                                        </div>
                                    )}

                                    {!concluido && item.descricao && (
                                        <p className={`small mb-0 ${atual ? 'text-muted' : 'text-muted'}`}>
                                            {item.descricao}
                                        </p>
                                    )}

                                    {atual && item.acoes && item.acoes.length > 0 && (
                                        <div className="d-flex flex-wrap gap-2 mt-3">
                                            {item.acoes.map((acao) => (
                                                <Link
                                                    key={acao.to + acao.label}
                                                    to={hrefAcao(acao, contexto)}
                                                    className={`btn btn-sm d-inline-flex align-items-center gap-1 ${classeBotaoAcaoFluxo(acao.nivel || 'primary')}`}
                                                >
                                                    {acao.icone && <i className={acao.icone} aria-hidden />}
                                                    {acao.label}
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-shrink-0 d-flex align-items-center gap-2">
                                    {concluido && item.linkAbrir && (
                                        <Link
                                            to={item.linkAbrir.to}
                                            className="btn btn-sm btn-soft-success d-inline-flex align-items-center gap-1"
                                        >
                                            {item.linkAbrir.label}
                                            <i className="ri-external-link-line" aria-hidden />
                                        </Link>
                                    )}
                                    {!concluido && (
                                        <i className="ri-arrow-right-s-line text-muted fs-4" aria-hidden />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FluxoProducaoChecklist
