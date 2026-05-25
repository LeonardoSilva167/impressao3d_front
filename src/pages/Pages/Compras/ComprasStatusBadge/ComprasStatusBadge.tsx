import React from 'react'
import { CompraStatus } from 'interfaces/Compras/ComprasInterface'

interface ComprasStatusBadgeProps {
    status?: CompraStatus | string | null
}

const ComprasStatusBadge = ({ status }: ComprasStatusBadgeProps) => {
    const isCancelada = status === 'CANCELADA'

    return (
        <span className={`badge bg-${isCancelada ? 'danger' : 'success'}`}>
            {isCancelada ? 'CANCELADA' : 'ATIVA'}
        </span>
    )
}

export default ComprasStatusBadge
