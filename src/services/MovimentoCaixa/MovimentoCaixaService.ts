import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { CaixaModel, CaixaSearch, LookupsMovimentoCaixa, MovimentoCaixaInterface, MovimentoCaixaModel, MovimentoCaixaSearch, MovimentoCaixaView } from "interfaces/MovimentoCaixa/MovimentoCaixaInterface"
// import { MovimentoCaixaInterface, MovimentoCaixaModel, MovimentoCaixaSearch, MovimentoCaixaView, LookupsMovimentoCaixa } from "interfaces/MovimentoCaixa"

export class MovimentoCaixaService implements MovimentoCaixaInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient


    constructor() {
        this.url = 'movimento-caixas'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsMovimentoCaixa(): Promise<LookupsMovimentoCaixa | undefined> {
        const response = await this.httpClient.get<LookupsMovimentoCaixa>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    async getViewMovimentoCaixa(params: any): Promise<MovimentoCaixaView | undefined> {
        const response = await this.httpClient.get<MovimentoCaixaView>({
            url: `${this.url}/listar/${params.id}`
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }


    async listMovimentoCaixaPaginate(params: MovimentoCaixaSearch): Promise<PaginateInterface<MovimentoCaixaSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<MovimentoCaixaSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    // async listMovimentoCaixas(params: MovimentoCaixaSearch): Promise<PaginateInterface<MovimentoCaixaSearch> | undefined> {
    //     const response = await this.httpClient.get<PaginateInterface<MovimentoCaixaSearch>>({
    //         // url: this.url + '/listar',
    //         url: this.url + '',
    //         body: params
    //     })

    //     switch (response.statusCode) {
    //         case HttpStatusCode.ok: return response.body
    //         case HttpStatusCode.unauthorized: throw new AccessDeniedError()
    //         default: throw new UnexpectedError()
    //     }
    // }

    async AsyncListMovimentoCaixa(params: MovimentoCaixaSearch): Promise<MovimentoCaixaModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/movimento-caixas-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
   
    
    async createMovimentoCaixa(params: MovimentoCaixaModel) {
        const response = await this.httpClient.post({
            url: this.url + '/cadastrar', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async editMovimentoCaixa(params: MovimentoCaixaModel) {
        const response = await this.httpClient.put({
            url: this.url + '/editar', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async deleteMovimentoCaixa(id: number) {
        const response = await this.httpClient.delete({
            url: this.url + '/excluir/' + id
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

 
    
    async caixaStatus(params: CaixaSearch): Promise<CaixaModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/caixa/status',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }   

    
    async caixaAbertura(params: CaixaModel) {
        const response = await this.httpClient.put({
            url: this.url + '/caixa/abertura', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

    async caixaFechamento(params: CaixaModel) {
        const response = await this.httpClient.put({
            url: this.url + '/caixa/fechamento', body: params
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.noContent: return
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            case HttpStatusCode.invalidForm: throw new ValidationError(response.body)
            default: throw new UnexpectedError(response.message)
        }
    }

}