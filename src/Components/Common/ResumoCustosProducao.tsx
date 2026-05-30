import React from 'react'
import { Col, Row } from 'reactstrap'
import {
    CustosProducaoBreakdown,
    formatarCustoProducao,
} from 'helpers/custosProducao_helpers'
import { formatarNumeroDecimal } from 'pages/Pages/ProjetosImpressao/hooks/useProjetosImpressao'

export interface ResumoCustosProducaoProps {
    pesoTotal?: number | string | null
    tempoTotal?: string | null
    custos: CustosProducaoBreakdown
    titulo?: string
    className?: string
}

const ResumoCustosProducao = ({
    pesoTotal,
    tempoTotal,
    custos,
    titulo = 'Resumo Financeiro',
    className = '',
}: ResumoCustosProducaoProps) => {
    const peso = Number(pesoTotal) || 0

    return (
        <div className={`border rounded p-3 bg-light ${className}`.trim()}>
            <h6 className="mb-3 fw-semibold">{titulo}</h6>
            <Row className="g-2">
                {peso > 0 && (
                    <Col md={6} lg={4}>
                        <div className="text-muted small">Peso Total</div>
                        <div className="fw-medium">{formatarNumeroDecimal(peso)}g</div>
                    </Col>
                )}
                {tempoTotal && (
                    <Col md={6} lg={4}>
                        <div className="text-muted small">Tempo Total</div>
                        <div className="fw-medium">{tempoTotal}</div>
                    </Col>
                )}
                <Col md={6} lg={4}>
                    <div className="text-muted small">Custo Filamento</div>
                    <div className="fw-medium">{formatarCustoProducao(custos.custo_filamento)}</div>
                </Col>
                <Col md={6} lg={4}>
                    <div className="text-muted small">Custo Energia</div>
                    <div className="fw-medium">{formatarCustoProducao(custos.custo_energia)}</div>
                </Col>
                <Col md={6} lg={4}>
                    <div className="text-muted small">Custo Desgaste</div>
                    <div className="fw-medium">{formatarCustoProducao(custos.custo_desgaste)}</div>
                </Col>
                <Col md={6} lg={4}>
                    <div className="text-muted small">Custo Total</div>
                    <div className="fw-semibold text-primary">{formatarCustoProducao(custos.custo_total)}</div>
                </Col>
            </Row>
        </div>
    )
}

export default ResumoCustosProducao
