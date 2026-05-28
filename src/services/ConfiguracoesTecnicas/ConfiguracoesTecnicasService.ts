import {
    ALTURAS_CAMADA_POR_BICO,
    BICO_OPTIONS,
    ConfiguracoesTecnicasInterface,
    LookupsConfiguracoesTecnicas,
    QUANTIDADE_PAREDES_OPTIONS,
    TIPO_SUPORTE_OPTIONS,
} from 'interfaces/ConfiguracoesTecnicas/ConfiguracoesTecnicasInterface'

export class ConfiguracoesTecnicasService implements ConfiguracoesTecnicasInterface {
    async getLookupsConfiguracoesTecnicas(): Promise<LookupsConfiguracoesTecnicas | undefined> {
        return {
            bicoOptions: BICO_OPTIONS,
            alturasCamadaPorBico: ALTURAS_CAMADA_POR_BICO,
            tipoSuporteOptions: TIPO_SUPORTE_OPTIONS,
            quantidadeParedesOptions: QUANTIDADE_PAREDES_OPTIONS,
        }
    }
}
