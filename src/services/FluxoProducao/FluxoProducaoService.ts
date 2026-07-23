import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import {
    FluxoProducaoProgresso,
    FluxoProducaoProgressoParams,
    SubpassoFluxoCodigoApi,
} from 'interfaces/FluxoProducao/FluxoProducaoInterface'

const SUBPASSOS_VAZIOS: Record<SubpassoFluxoCodigoApi, boolean> = {
    E1_PRODUTO: false,
    E2_PROJETO: false,
    E2_VINCULO: false,
    E2_PARTES: false,
    E3_MONTAGEM: false,
}

const extrairPayloadProgresso = (body: unknown): Record<string, unknown> | null => {
    if (!body || typeof body !== 'object') return null
    const raw = body as Record<string, unknown>
    const nested = raw.progresso ?? raw.data ?? raw.fluxo_progresso
    if (nested && typeof nested === 'object') {
        return nested as Record<string, unknown>
    }
    if (raw.produto_id != null || raw.subpassos != null || raw.produto != null) {
        return raw
    }
    return null
}

export const normalizarProgressoFluxo = (body: unknown): FluxoProducaoProgresso | undefined => {
    const raw = extrairPayloadProgresso(body)
    if (!raw) return undefined

    const produtoRaw = (raw.produto && typeof raw.produto === 'object'
        ? raw.produto
        : {}) as Record<string, unknown>
    const produtoId = Number(raw.produto_id ?? produtoRaw.id)
    if (Number.isNaN(produtoId)) return undefined

    const projetoRaw = (raw.projeto && typeof raw.projeto === 'object'
        ? raw.projeto
        : null) as Record<string, unknown> | null
    const subpassosRaw = (raw.subpassos && typeof raw.subpassos === 'object'
        ? raw.subpassos
        : {}) as Partial<Record<SubpassoFluxoCodigoApi, boolean>>

    const projetoId = raw.projeto_id != null
        ? Number(raw.projeto_id)
        : (projetoRaw?.id != null ? Number(projetoRaw.id) : null)
    const composicaoId = raw.composicao_id != null ? Number(raw.composicao_id) : null
    const gradeId = raw.grade_id != null ? Number(raw.grade_id) : null

    return {
        produto_id: produtoId,
        projeto_id: projetoId != null && !Number.isNaN(projetoId) ? projetoId : null,
        composicao_id: composicaoId != null && !Number.isNaN(composicaoId) ? composicaoId : null,
        grade_id: gradeId != null && !Number.isNaN(gradeId) ? gradeId : null,
        produto: {
            id: Number(produtoRaw.id ?? produtoId),
            descricao_produto: (produtoRaw.descricao_produto as string | null) ?? null,
            sku_base: (produtoRaw.sku_base as string | null) ?? null,
            codigo_base: (produtoRaw.codigo_base as string | null) ?? null,
        },
        projeto: projetoRaw && projetoRaw.id != null
            ? {
                id: Number(projetoRaw.id),
                nome_original_projeto: (projetoRaw.nome_original_projeto as string | null) ?? null,
                codigo_projeto: (projetoRaw.codigo_projeto as string | null) ?? null,
            }
            : null,
        partes_resumo: Array.isArray(raw.partes_resumo)
            ? raw.partes_resumo as FluxoProducaoProgresso['partes_resumo']
            : [],
        subpassos: {
            ...SUBPASSOS_VAZIOS,
            ...subpassosRaw,
        },
        proximo_subpasso: (raw.proximo_subpasso as SubpassoFluxoCodigoApi | null) ?? null,
    }
}

export class FluxoProducaoService {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'fluxo-producao'
        this.httpClient = new AxiosHttpClient()
    }

    async getProgresso(params: FluxoProducaoProgressoParams): Promise<FluxoProducaoProgresso | undefined> {
        const body: Record<string, string | number> = {
            produto: params.produto,
        }

        if (params.projeto != null && params.projeto !== '') {
            body.projeto = params.projeto
        }

        if (params.composicao != null && params.composicao !== '') {
            body.composicao = params.composicao
        }

        const response = await this.httpClient.get<unknown>({
            url: `${this.url}/progresso`,
            body,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return normalizarProgressoFluxo(response.body)
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            case HttpStatusCode.invalidForm:
            case HttpStatusCode.badRequest:
                throw new ValidationError(response.body)
            default:
                throw new UnexpectedError()
        }
    }
}
