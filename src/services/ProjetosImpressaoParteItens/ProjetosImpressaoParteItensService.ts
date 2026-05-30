import { AxiosHttpClient, HttpStatusCode } from '../../libs/api/ApiConfig'
import { AccessDeniedError } from '../../libs/api/exceptions/AccessDeniedError'
import { UnexpectedError } from '../../libs/api/exceptions/UnexpectedError'
import { ValidationError } from '../../libs/api/exceptions/ValidationError'
import { ItemParteProjetoModel } from 'interfaces/ProjetosImpressao/ItemParteProjetoInterface'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'

export interface LookupsItemParteProjeto {
    cores?: Array<{ id: number; descricao?: string; hexadecimal?: string }>
    tiposSuporte?: string[]
}

const extrairIdResposta = (body: Record<string, any>, chave: string): number | undefined => {
    const payload = body?.[chave] ?? body
    const data = payload?.data ?? payload
    const id = data?.id

    if (id == null || Number.isNaN(Number(id))) {
        return undefined
    }

    return Number(id)
}

export class ProjetosImpressaoParteItensService {
    private readonly url = 'projetos-impressao-parte-itens'
    private readonly httpClient = new AxiosHttpClient()

    async getLookups(): Promise<LookupsItemParteProjeto | undefined> {
        const response = await this.httpClient.get<LookupsItemParteProjeto>({
            url: `${this.url}/lookups`,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return response.body
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            default:
                throw new UnexpectedError()
        }
    }

    async getCoresOptions(): Promise<SelectOptions[]> {
        const lookups = await this.getLookups()
        if (!lookups?.cores?.length) return []

        return lookups.cores.map((cor) => ({
            value: cor.id,
            label: cor.descricao || '',
        }))
    }

    async createItem(params: ItemParteProjetoModel): Promise<number | undefined> {
        const response = await this.httpClient.post({
            url: `${this.url}/cadastrar`,
            body: params,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return extrairIdResposta(response.body as Record<string, any>, 'projetoImpressaoParteItem')
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            case HttpStatusCode.invalidForm:
                throw new ValidationError(response.body)
            default:
                throw new UnexpectedError(response.message)
        }
    }

    async editItem(params: ItemParteProjetoModel) {
        const response = await this.httpClient.put({
            url: `${this.url}/editar`,
            body: params,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
                return response.body
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            case HttpStatusCode.invalidForm:
                throw new ValidationError(response.body)
            default:
                throw new UnexpectedError(response.message)
        }
    }

    async deleteItem(id: number) {
        const response = await this.httpClient.delete({
            url: `${this.url}/excluir/${id}`,
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok:
            case HttpStatusCode.noContent:
                return response.body
            case HttpStatusCode.unauthorized:
                throw new AccessDeniedError()
            case HttpStatusCode.invalidForm:
                throw new ValidationError(response.body)
            default:
                throw new UnexpectedError(response.message)
        }
    }
}
