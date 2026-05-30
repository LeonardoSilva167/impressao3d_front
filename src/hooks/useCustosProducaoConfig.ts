import { useEffect, useState } from 'react'
import {
    CUSTOS_PRODUCAO_DEFAULT,
    CustosProducaoConfig,
} from 'helpers/custosProducao_helpers'
import { obterValorNumerico } from 'pages/Pages/ProjetosImpressao/hooks/useProjetosImpressao'
import { ConfiguracoesService } from 'services/Configuracoes/ConfiguracoesService'

let cachedConfig: CustosProducaoConfig | null = null
let loadingPromise: Promise<CustosProducaoConfig> | null = null

export const carregarCustosProducaoConfig = async (): Promise<CustosProducaoConfig> => {
    if (cachedConfig) return cachedConfig
    if (loadingPromise) return loadingPromise

    loadingPromise = (async () => {
        try {
            const service = new ConfiguracoesService()
            const config = await service.getConfiguracoes()
            if (config) {
                cachedConfig = {
                    custo_energia_kwh: obterValorNumerico(config.custo_energia_kwh)
                        || CUSTOS_PRODUCAO_DEFAULT.custo_energia_kwh,
                    custo_desgaste_hora: obterValorNumerico(config.custo_desgaste_hora)
                        || CUSTOS_PRODUCAO_DEFAULT.custo_desgaste_hora,
                }
                return cachedConfig
            }
        } catch (error) {
            console.warn('Usando custos de produção padrão:', error)
        }

        cachedConfig = { ...CUSTOS_PRODUCAO_DEFAULT }
        return cachedConfig
    })()

    try {
        return await loadingPromise
    } finally {
        loadingPromise = null
    }
}

export const invalidarCacheCustosProducaoConfig = () => {
    cachedConfig = null
}

export const useCustosProducaoConfig = () => {
    const [config, setConfig] = useState<CustosProducaoConfig>(CUSTOS_PRODUCAO_DEFAULT)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let ativo = true

        carregarCustosProducaoConfig()
            .then((loaded) => {
                if (ativo) setConfig(loaded)
            })
            .finally(() => {
                if (ativo) setLoading(false)
            })

        return () => {
            ativo = false
        }
    }, [])

    return { config, loading }
}
