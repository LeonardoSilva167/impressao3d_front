import { useEffect, useState } from 'react'
import { LoteMaisAntigoInfo } from 'interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface'
import { CarreteisFinalizadosService } from 'services/CarreteisFinalizados/CarreteisFinalizadosService'

export const useLoteMaisAntigo = (idItem: string | null | undefined) => {
    const [loteInfo, setLoteInfo] = useState<LoteMaisAntigoInfo>()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    useEffect(() => {
        const carreteisFinalizadosService = new CarreteisFinalizadosService()

        const loadLote = async () => {
            if (!idItem) {
                setLoteInfo(undefined)
                setError(null)
                return
            }

            setLoading(true)
            setError(null)
            try {
                const info = await carreteisFinalizadosService.getLoteMaisAntigo(Number(idItem))
                setLoteInfo(info)
            } catch (err) {
                console.error('Erro ao carregar lote mais antigo:', err)
                setLoteInfo(undefined)
                setError('Não foi possível carregar informações do lote.')
            } finally {
                setLoading(false)
            }
        }

        loadLote()
    }, [idItem])

    return { loteInfo, loading, error }
}

export const viewToLoteInfo = (view: {
    compra_descricao?: string
    numero_pedido?: string
    plataforma_descricao?: string
    data_compra?: string
    qtd_original?: number
    qtd_atual?: number
    valor_unitario?: number
}): LoteMaisAntigoInfo | undefined => {
    if (
        !view.compra_descricao
        && !view.numero_pedido
        && view.qtd_original == null
        && view.qtd_atual == null
    ) {
        return undefined
    }

    return {
        compra_descricao: view.compra_descricao,
        numero_pedido: view.numero_pedido,
        plataforma_descricao: view.plataforma_descricao,
        data_compra: view.data_compra,
        qtd_original: view.qtd_original,
        qtd_atual: view.qtd_atual,
        valor_unitario: view.valor_unitario,
    }
}

export const calcularTotalConsumido = (
    quantidade: string | null | undefined,
    gramatura: string | null | undefined
): number => {
    const qtd = Number(quantidade || 0)
    const gram = Number(gramatura || 0)
    if (qtd <= 0 || gram <= 0) return 0
    return qtd * gram
}
