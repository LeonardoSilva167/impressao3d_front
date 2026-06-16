import React from 'react'
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap'
import { formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import {
    AnaliseComprasItemTabela,
    AnaliseComprasRankingItem,
} from 'interfaces/AnaliseCompras/AnaliseComprasInterface'

export interface AnaliseComprasTablesProps {
    tabelaItens: AnaliseComprasItemTabela[]
    rankingItens: AnaliseComprasRankingItem[]
}

const somarValorComprado = (
    linhas: { valor_comprado?: number | string | null }[]
): number => linhas.reduce((total, linha) => {
    const valor = Number(linha.valor_comprado || 0)
    return total + (Number.isNaN(valor) ? 0 : valor)
}, 0)

const somarValorTotal = (
    linhas: { valor_total?: number | string | null }[]
): number => linhas.reduce((total, linha) => {
    const valor = Number(linha.valor_total || 0)
    return total + (Number.isNaN(valor) ? 0 : valor)
}, 0)

const AnaliseComprasTables = ({ tabelaItens, rankingItens }: AnaliseComprasTablesProps) => {
    const subtotalItensComprados = somarValorComprado(tabelaItens)
    const totalItensComprados = somarValorTotal(tabelaItens)
    const subtotalRanking = somarValorComprado(rankingItens)
    const totalRanking = somarValorTotal(rankingItens)

    return (
        <React.Fragment>
            <Row>
                <Col xl={7}>
                    <Card>
                        <CardHeader className="border-0">
                            <h4 className="card-title mb-0">Itens Comprados</h4>
                        </CardHeader>
                        <CardBody>
                            <div className="table-responsive">
                                <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Item</th>
                                            <th className="text-end">Qtde</th>
                                            <th className="text-end">Subtotal</th>
                                            <th className="text-end">Total</th>
                                            <th className="text-end">Custo Médio</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabelaItens.length === 0 ? (
                                            <tr>
                                                <td colSpan={5} className="text-center text-muted py-4">
                                                    Nenhum item encontrado para os filtros aplicados.
                                                </td>
                                            </tr>
                                        ) : (
                                            tabelaItens.map((linha, index) => (
                                                <tr key={`${linha.item}-${index}`}>
                                                    <td>{linha.item || '—'}</td>
                                                    <td className="text-end">{linha.quantidade_comprada || 0}</td>
                                                    <td className="text-end">
                                                        R$ {formatarParaMoedaSemSimbolo(linha.valor_comprado)}
                                                    </td>
                                                    <td className="text-end">
                                                        R$ {formatarParaMoedaSemSimbolo(linha.valor_total)}
                                                    </td>
                                                    <td className="text-end">
                                                        R$ {formatarParaMoedaSemSimbolo(linha.custo_medio)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {tabelaItens.length > 0 && (
                                        <tfoot className="table-light">
                                            <tr>
                                                <td colSpan={2} className="text-end fw-semibold">
                                                    Total
                                                </td>
                                                <td className="text-end fw-semibold">
                                                    R$ {formatarParaMoedaSemSimbolo(subtotalItensComprados)}
                                                </td>
                                                <td className="text-end fw-semibold">
                                                    R$ {formatarParaMoedaSemSimbolo(totalItensComprados)}
                                                </td>
                                                <td></td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>

                <Col xl={5}>
                    <Card>
                        <CardHeader className="border-0">
                            <h4 className="card-title mb-0">Itens Mais Comprados</h4>
                        </CardHeader>
                        <CardBody>
                            <div className="table-responsive">
                                <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                    <thead className="table-light">
                                        <tr>
                                            <th>Item</th>
                                            <th className="text-end">Qtde</th>
                                            <th className="text-end">Subtotal</th>
                                            <th className="text-end">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rankingItens.length === 0 ? (
                                            <tr>
                                                <td colSpan={4} className="text-center text-muted py-4">
                                                    Nenhum item encontrado para os filtros aplicados.
                                                </td>
                                            </tr>
                                        ) : (
                                            rankingItens.map((linha, index) => (
                                                <tr key={`${linha.item}-${index}`}>
                                                    <td>{linha.item || '—'}</td>
                                                    <td className="text-end">{linha.quantidade || 0}</td>
                                                    <td className="text-end">
                                                        R$ {formatarParaMoedaSemSimbolo(linha.valor_comprado)}
                                                    </td>
                                                    <td className="text-end">
                                                        R$ {formatarParaMoedaSemSimbolo(linha.valor_total)}
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    {rankingItens.length > 0 && (
                                        <tfoot className="table-light">
                                            <tr>
                                                <td colSpan={2} className="text-end fw-semibold">
                                                    Total
                                                </td>
                                                <td className="text-end fw-semibold">
                                                    R$ {formatarParaMoedaSemSimbolo(subtotalRanking)}
                                                </td>
                                                <td className="text-end fw-semibold">
                                                    R$ {formatarParaMoedaSemSimbolo(totalRanking)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    )}
                                </Table>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default AnaliseComprasTables
