import { AxiosHttpClient, HttpStatusCode } from "../../libs/api/ApiConfig"
import { AccessDeniedError } from "../../libs/api/exceptions/AccessDeniedError"
import { UnexpectedError } from "../../libs/api/exceptions/UnexpectedError"
import { PaginateInterface } from "interfaces/SystemInterfaces/PaginateInterface"
// import { ValidationError } from "yup"
import { ValidationError } from "../../libs/api/exceptions/ValidationError"
import { LookupsFluxoCaixa, FluxoCaixaInterface, FluxoCaixaModel, FluxoCaixaSearch, FluxoCaixaView } from "interfaces/FluxoCaixa/FluxoCaixaInterface"
// import { FluxoCaixaInterface, FluxoCaixaModel, FluxoCaixaSearch, FluxoCaixaView, LookupsFluxoCaixa } from "interfaces/FluxoCaixa"

export class FluxoCaixaService implements FluxoCaixaInterface {
    private readonly url: string
    private readonly httpClient: AxiosHttpClient

    constructor() {
        this.url = 'movimento-caixas/fluxo-caixa'
        this.httpClient = new AxiosHttpClient()
    }
    

    async getLookupsFluxoCaixa(): Promise<LookupsFluxoCaixa | undefined> {
        const response = await this.httpClient.get<LookupsFluxoCaixa>({
            url: this.url + '/lookups'
        })

        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }

    // async getViewFluxoCaixa(params: any): Promise<FluxoCaixaView | undefined> {
    //     const response = await this.httpClient.get<FluxoCaixaView>({
    //         url: this.url + '/listar-view',
    //         body: params
    //     })

    //     switch (response.statusCode) {
    //         case HttpStatusCode.ok: return response.body
    //         case HttpStatusCode.unauthorized: throw new AccessDeniedError()
    //         default: throw new UnexpectedError()
    //     }
    // }
    async getViewFluxoCaixa(params: FluxoCaixaSearch): Promise<FluxoCaixaModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/listar-view',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }   

    async listFluxoCaixaPaginate(params: FluxoCaixaSearch): Promise<PaginateInterface<FluxoCaixaSearch> | undefined> {
        const response = await this.httpClient.get<PaginateInterface<FluxoCaixaSearch>>({
            url: this.url + '/listar',
            body: params
        })
        switch (response.statusCode) {
            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }
    // async listFluxoCaixas(params: FluxoCaixaSearch): Promise<PaginateInterface<FluxoCaixaSearch> | undefined> {
    //     const response = await this.httpClient.get<PaginateInterface<FluxoCaixaSearch>>({
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

    async AsyncListFluxoCaixa(params: FluxoCaixaSearch): Promise<FluxoCaixaModel[] | undefined> {
        const response = await this.httpClient.get<any>({
            url: this.url + '/FluxoCaixa-list',
            // url: this.url + '/',
            body: params
        })
        switch (response.statusCode) {

            case HttpStatusCode.ok: return response.body
            case HttpStatusCode.unauthorized: throw new AccessDeniedError()
            default: throw new UnexpectedError()
        }
    }    
    
    async createFluxoCaixa(params: FluxoCaixaModel) {
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

    async editFluxoCaixa(params: FluxoCaixaModel) {
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

    async deleteFluxoCaixa(id: number) {
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

 
    
    
}