export interface ConfiguracoesModel {
    id?: number | string | null
    proximo_codigo_base?: number | string | null
    custo_energia_kwh?: number | string | null
    custo_desgaste_hora?: number | string | null
}

export interface ConfiguracoesView extends ConfiguracoesModel {}

export interface ConfiguracoesInterface {
    getConfiguracoes(): Promise<ConfiguracoesView | undefined>
    editConfiguracoes(params: ConfiguracoesModel): Promise<any>
}

export const ConfiguracoesDefaultValues: ConfiguracoesModel = {
    id: 1,
    proximo_codigo_base: null,
    custo_energia_kwh: 1.039,
    custo_desgaste_hora: 1.2,
}
