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
    /** Rota sugerida quando o item ainda está pendente (lista com seta) */
    destino?: string
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
    /** Bloco "Importante" exibido após o card do próximo passo */
    detalhesImportante?: string[]
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
                : 'Comece por aqui!',
            descricao: e1
                ? undefined
                : 'Clique no botão ao lado para iniciar o cadastro do seu produto base.',
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
            destino: '/produtos/add',
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
                : isAtual('E2_PROJETO')
                    ? 'Próximo passo'
                    : `Cadastrar ou escolher ${DominioProducaoLabels.projetoImpressao.toLowerCase()}`,
            descricao: e2Projeto
                ? undefined
                : 'Cadastre um novo projeto ou selecione um já existente. Inclui o arquivo 3D (STL/3MF) e os dados do fatiador.',
            concluido: e2Projeto,
            atual: isAtual('E2_PROJETO'),
            icone: isAtual('E2_PROJETO') ? 'ri-flag-line' : 'ri-file-list-3-line',
            detalheLinha: e2Projeto ? `Projeto #${projetoId}` : undefined,
            linkAbrir: e2Projeto
                ? { label: 'Abrir projeto', to: `/projetos-impressao/view/${projetoId}` }
                : undefined,
            destino: '/projetos-impressao/add',
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
                : isAtual('E2_VINCULO')
                    ? 'Próximo passo'
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
            destino: '/composicao-produtos/add',
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
            titulo: e2Partes
                ? 'Partes configuradas'
                : isAtual('E2_PARTES')
                    ? 'Próximo passo'
                    : 'Configurar partes',
            descricao: e2Partes
                ? undefined
                : 'Defina cores, configurações de impressão e filamento de cada parte.',
            concluido: e2Partes,
            atual: isAtual('E2_PARTES'),
            icone: 'ri-box-3-line',
            linkAbrir: e2Partes && composicaoId
                ? { label: 'Abrir vínculo', to: `/composicao-produtos/view/${composicaoId}` }
                : undefined,
            destino: composicaoId
                ? `/composicao-produtos/view/${composicaoId}`
                : '/composicao-produtos',
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
                : isAtual('E3_MONTAGEM')
                    ? 'Próximo passo'
                    : `Criar ${DominioProducaoLabels.montagemCurta.toLowerCase()}`,
            descricao: e3
                ? undefined
                : 'Monte as partes para finalizar o produto e gerar os SKUs.',
            concluido: e3,
            atual: isAtual('E3_MONTAGEM'),
            icone: 'ri-puzzle-line',
            destino: '/grade-produtos/add',
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

const CardConcluido = ({ item }: { item: ItemChecklistFluxo }) => (
    <div
        className="rounded-3 bg-white p-3"
        style={{
            border: '1px solid rgba(10, 179, 156, 0.28)',
            borderLeft: '4px solid var(--vz-success, #0ab39c)',
        }}
    >
        <div className="d-flex align-items-center gap-3">
            <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-success text-white"
                style={{ width: 40, height: 40 }}
                aria-hidden
            >
                <i className="ri-check-line fs-5" />
            </div>
            <div className="flex-grow-1 min-w-0">
                <div className="fw-semibold text-success">{item.titulo}</div>
                {item.detalheLinha && (
                    <div className="small text-body mt-1">{item.detalheLinha}</div>
                )}
            </div>
            {item.linkAbrir && (
                <Link
                    to={item.linkAbrir.to}
                    className="btn btn-sm btn-soft-success d-inline-flex align-items-center gap-1 flex-shrink-0"
                >
                    {item.linkAbrir.label}
                    <i className="ri-external-link-line" aria-hidden />
                </Link>
            )}
        </div>
    </div>
)

const CardProximoPasso = ({
    item,
    contexto,
}: {
    item: ItemChecklistFluxo
    contexto: FluxoProducaoQuery
}) => (
    <div
        className="rounded-3 p-3 p-md-4"
        style={{
            backgroundColor: 'var(--vz-primary-bg-subtle, rgba(64, 81, 137, 0.07))',
            border: '1px solid var(--vz-primary, #405189)',
        }}
    >
        <div className="d-flex flex-column flex-lg-row align-items-lg-center gap-3">
            <div className="d-flex gap-3 flex-grow-1 min-w-0">
                <div
                    className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-white text-primary border border-primary-subtle"
                    style={{ width: 44, height: 44 }}
                    aria-hidden
                >
                    <i className={`${item.icone || 'ri-flag-line'} fs-4`} />
                </div>
                <div className="min-w-0">
                    <h5 className="mb-1 text-primary">{item.titulo}</h5>
                    {item.descricao && (
                        <p className="mb-0 text-muted small">{item.descricao}</p>
                    )}
                </div>
            </div>

            {item.acoes && item.acoes.length > 0 && (
                <div className="d-flex flex-column gap-2 flex-shrink-0" style={{ minWidth: 200 }}>
                    {item.acoes.map((acao) => (
                        <Link
                            key={acao.to + acao.label}
                            to={hrefAcao(acao, contexto)}
                            className={`btn d-inline-flex align-items-center justify-content-center gap-1 ${classeBotaoAcaoFluxo(acao.nivel || 'primary')}`}
                        >
                            {acao.icone && <i className={acao.icone} aria-hidden />}
                            {acao.label}
                        </Link>
                    ))}
                </div>
            )}
        </div>
    </div>
)

const CardImportante = ({ detalhes }: { detalhes: string[] }) => (
    <div
        className="rounded-3 p-3 p-md-4"
        style={{
            backgroundColor: 'rgba(10, 179, 156, 0.08)',
            border: '1px solid rgba(10, 179, 156, 0.28)',
        }}
    >
        <div className="d-flex gap-3">
            <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 text-success bg-white"
                style={{
                    width: 40,
                    height: 40,
                    border: '1px solid rgba(10, 179, 156, 0.35)',
                }}
                aria-hidden
            >
                <i className="ri-lightbulb-flash-line fs-5" />
            </div>
            <div className="flex-grow-1">
                <h6 className="text-success mb-2">Importante</h6>
                <ul className="list-unstyled mb-0">
                    {detalhes.map((detalhe, index) => (
                        <li
                            key={detalhe}
                            className={`d-flex gap-2 ${index < detalhes.length - 1 ? 'mb-2' : ''}`}
                        >
                            <i className="ri-checkbox-circle-fill text-success mt-1 flex-shrink-0" aria-hidden />
                            <span className="text-muted">{detalhe}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
)

const LinhaPendente = ({
    item,
    numero,
}: {
    item: ItemChecklistFluxo
    numero: number
}) => (
    <div
        className="border-bottom"
        style={{
            borderColor: 'var(--vz-border-color, #e9ebec)',
            opacity: 0.72,
        }}
        aria-disabled="true"
        title="Conclua o passo atual para liberar esta etapa"
    >
        <div className="d-flex align-items-center gap-3 py-3 px-2">
            <div
                className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 bg-light text-muted border"
                style={{ width: 36, height: 36 }}
                aria-hidden
            >
                <i className="ri-lock-line" />
            </div>
            <div className="flex-grow-1 min-w-0">
                <div className="fw-semibold text-muted">
                    {numero}. {item.titulo}
                </div>
                {item.descricao && (
                    <div className="small text-muted">
                        Bloqueado — conclua o passo anterior primeiro.
                    </div>
                )}
            </div>
            <i className="ri-lock-2-line text-muted fs-5 flex-shrink-0" aria-hidden />
        </div>
    </div>
)

const FluxoProducaoChecklist = ({
    itens,
    contexto,
    detalhesImportante,
}: FluxoProducaoChecklistProps) => {
    const concluidos = itens.filter((item) => item.concluido)
    const atual = itens.find((item) => item.atual && !item.concluido)
    const pendentes = itens.filter((item) => !item.concluido && !item.atual)

    return (
        <div className="fluxo-producao-checklist mb-4">
            <h6
                className="text-muted text-uppercase small mb-3 fw-semibold"
                style={{ letterSpacing: '0.04em' }}
            >
                Progresso do fluxo
            </h6>

            <div className="d-flex flex-column gap-3">
                {concluidos.map((item) => (
                    <CardConcluido key={item.codigo} item={item} />
                ))}

                {atual && (
                    <CardProximoPasso item={atual} contexto={contexto} />
                )}

                {detalhesImportante && detalhesImportante.length > 0 && (
                    <CardImportante detalhes={detalhesImportante} />
                )}

                {pendentes.length > 0 && (
                    <div className="rounded-3 border bg-white overflow-hidden">
                        {pendentes.map((item, index) => (
                            <LinhaPendente
                                key={item.codigo}
                                item={item}
                                numero={concluidos.length + (atual ? 1 : 0) + index + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default FluxoProducaoChecklist
