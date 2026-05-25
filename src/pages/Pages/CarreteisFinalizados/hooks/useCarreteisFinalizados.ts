import { useEffect, useState } from 'react'
import { ESTOQUE_INSUFICIENTE_MSG, LoteConsumoInfo } from 'interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface'
import { CarreteisFinalizadosService } from 'services/CarreteisFinalizados/CarreteisFinalizadosService'

export const calcularTotalConsumido = (
    quantidade: string | null | undefined,
    gramatura: string | null | undefined
): number => {
    const qtd = Number(quantidade || 0)
    const gram = Number(gramatura || 0)
    if (qtd <= 0 || gram <= 0) return 0
    return qtd * gram
}

const podeConsultarLotes = (
    idItem: string | null | undefined,
    gramatura: string | null | undefined,
    quantidade: string | null | undefined
): boolean => {
    const id = Number(idItem || 0)
    const gram = Number(gramatura || 0)
    const qtd = Number(quantidade || 0)
    return id > 0 && gram > 0 && qtd > 0
}

export const useLotesConsumo = (
    idItem: string | null | undefined,
    gramatura: string | null | undefined,
    quantidade: string | null | undefined
) => {
    const [lotes, setLotes] = useState<LoteConsumoInfo[]>([])
    const [loading, setLoading] = useState(false)
    const [estoqueInsuficiente, setEstoqueInsuficiente] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const carreteisFinalizadosService = new CarreteisFinalizadosService()

        const loadLotes = async () => {
            if (!podeConsultarLotes(idItem, gramatura, quantidade)) {
                setLotes([])
                setEstoqueInsuficiente(false)
                setError(null)
                return
            }

            setLoading(true)
            setError(null)
            setEstoqueInsuficiente(false)

            try {
                const result = await carreteisFinalizadosService.getLotesConsumo({
                    id_item: Number(idItem),
                    gramatura: Number(gramatura),
                    quantidade: Number(quantidade),
                })
                setLotes(result.lotes)
                setEstoqueInsuficiente(result.estoqueInsuficiente)
            } catch (err) {
                console.error('Erro ao carregar lotes de consumo:', err)
                setLotes([])
                setEstoqueInsuficiente(false)
                setError('Não foi possível carregar os lotes de consumo.')
            } finally {
                setLoading(false)
            }
        }

        loadLotes()
    }, [idItem, gramatura, quantidade])

    return {
        lotes,
        loading,
        estoqueInsuficiente,
        estoqueInsuficienteMsg: ESTOQUE_INSUFICIENTE_MSG,
        error,
        podeConsultar: podeConsultarLotes(idItem, gramatura, quantidade),
    }
}
