import React from 'react'
import { formatDateSQLForBR, formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import { LoteConsumoInfo } from 'interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface'

interface LotesConsumoTableProps {
    lotes: LoteConsumoInfo[]
}

const formatNumero = (value: number | null | undefined) => {
    if (value == null) return '—'
    return value.toLocaleString('pt-BR')
}

const LotesConsumoTable = ({ lotes }: LotesConsumoTableProps) => {
    if (!lotes.length) {
        return <div className="text-muted">Nenhum lote será consumido.</div>
    }

    return (
        <div className="table-responsive">
            <table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                <thead className="table-light">
                    <tr>
                        <th>Compra</th>
                        <th>Plataforma</th>
                        <th>Data Compra</th>
                        <th>Saldo Atual</th>
                        <th>Quantidade Consumida</th>
                        <th>Saldo Restante</th>
                        <th>Valor Unitário</th>
                    </tr>
                </thead>
                <tbody>
                    {lotes.map((lote, index) => (
                        <tr key={`${lote.id_compra_item ?? lote.id_compra ?? 'lote'}-${index}`}>
                            <td>{lote.compra_descricao || (lote.id_compra ? `Compra #${lote.id_compra}` : '—')}</td>
                            <td>{lote.plataforma_descricao || '—'}</td>
                            <td>
                                {lote.data_compra
                                    ? formatDateSQLForBR(lote.data_compra.split('T')[0])
                                    : '—'}
                            </td>
                            <td>{formatNumero(lote.saldo_atual)}</td>
                            <td>{formatNumero(lote.quantidade_consumida)}</td>
                            <td>{formatNumero(lote.saldo_restante)}</td>
                            <td>
                                {lote.valor_unitario != null
                                    ? formatarParaMoedaSemSimbolo(lote.valor_unitario)
                                    : '—'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default LotesConsumoTable
