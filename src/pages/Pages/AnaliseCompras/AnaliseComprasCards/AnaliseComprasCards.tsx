import React from 'react'
import { Alert, Card, CardBody, Col, Row } from 'reactstrap'
import { formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import { AnaliseComprasResumo } from 'interfaces/AnaliseCompras/AnaliseComprasInterface'

export interface AnaliseComprasCardsProps {
    resumo: AnaliseComprasResumo
    possuiDados: boolean
}

const cardsConfig = [
    { key: 'total_compras', label: 'Total Compras', icon: 'bx bx-cart', color: 'primary' },
    { key: 'total_fretes', label: 'Fretes', icon: 'bx bx-package', color: 'info' },
    { key: 'total_impostos', label: 'Impostos', icon: 'bx bx-receipt', color: 'warning' },
    { key: 'total_taxas', label: 'Taxas', icon: 'bx bx-credit-card', color: 'secondary' },
    { key: 'total_descontos', label: 'Descontos', icon: 'bx bx-purchase-tag', color: 'success' },
    { key: 'total_investido', label: 'Total Investido', icon: 'bx bx-wallet', color: 'danger' },
] as const

const AnaliseComprasCards = ({ resumo, possuiDados }: AnaliseComprasCardsProps) => {
    const obterValor = (key: keyof AnaliseComprasResumo): number => Number(resumo[key] || 0)

    if (!possuiDados) {
        return (
            <Row>
                <Col xs={12}>
                    <Alert color="info" className="text-center mb-0">
                        Nenhum dado encontrado para os filtros aplicados.
                    </Alert>
                </Col>
            </Row>
        )
    }

    return (
        <React.Fragment>
            <Row>
                {cardsConfig.map((card) => (
                    <Col xl={2} md={4} sm={6} key={card.key}>
                        <Card className="card-animate">
                            <CardBody>
                                <div className="d-flex align-items-center">
                                    <div className="flex-grow-1">
                                        <p className="text-uppercase fw-medium text-muted text-truncate mb-2">
                                            {card.label}
                                        </p>
                                        <h4 className="fs-22 fw-semibold ff-secondary mb-0">
                                            R$ {formatarParaMoedaSemSimbolo(obterValor(card.key))}
                                        </h4>
                                    </div>
                                    <div className="avatar-sm flex-shrink-0">
                                        <span className={`avatar-title rounded fs-3 bg-${card.color}-subtle`}>
                                            <i className={`text-${card.color} ${card.icon}`}></i>
                                        </span>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>

            <Row>
                <Col xl={12}>
                    <Card className="card-animate border border-primary border-opacity-25">
                        <CardBody>
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <p className="text-uppercase fw-medium text-muted mb-2">Valor Estoque Atual</p>
                                    <h3 className="fs-24 fw-semibold ff-secondary mb-1 text-primary">
                                        R$ {formatarParaMoedaSemSimbolo(obterValor('valor_estoque_investido'))}
                                    </h3>
                                    <p className="text-muted mb-0">
                                        Representa quanto dinheiro ainda está investido no estoque atual.
                                    </p>
                                </div>
                                <div className="avatar-md flex-shrink-0">
                                    <span className="avatar-title rounded fs-2 bg-primary-subtle">
                                        <i className="text-primary bx bx-store"></i>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default AnaliseComprasCards
