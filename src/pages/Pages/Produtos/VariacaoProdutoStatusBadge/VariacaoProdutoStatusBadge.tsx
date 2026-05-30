import React from 'react'
import { ProdutoVariacaoStatus } from 'interfaces/Produtos/ProdutosInterface'
import { VariacaoPreviewStatus } from 'interfaces/Produtos/ProdutoVariacaoInterface'

interface VariacaoProdutoStatusBadgeProps {
    status?: ProdutoVariacaoStatus | VariacaoPreviewStatus | string | null
}

const VariacaoProdutoStatusBadge = ({ status }: VariacaoProdutoStatusBadgeProps) => {
    const isInativada = status === 'INATIVADA'
    const isNova = status === 'NOVA'
    const isReativada = status === 'REATIVADA'

    let label = 'Ativa'
    let color: 'success' | 'warning' | 'secondary' | 'danger' = 'success'

    if (isInativada) {
        label = 'Inativada'
        color = 'warning'
    } else if (isNova) {
        label = 'Nova'
        color = 'secondary'
    } else if (isReativada) {
        label = 'Reativada'
        color = 'success'
    }

    return (
        <span className={`badge bg-${color}-subtle text-${color}`}>
            {label}
        </span>
    )
}

export default VariacaoProdutoStatusBadge
