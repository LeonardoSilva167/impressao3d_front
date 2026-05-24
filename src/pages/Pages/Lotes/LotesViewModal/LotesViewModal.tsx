import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Spinner } from 'reactstrap'
import { formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import { LotesView } from 'interfaces/Estoque/EstoqueInterface'
import { EstoqueService } from 'services/Estoque/EstoqueService'

interface LotesViewModalProps {
    isOpen: boolean
    toggle: () => void
    loteId: number | null
}

const formatQuantidade = (value: number | null | undefined) => {
    if (value == null) return '—'
    return `${value.toLocaleString('pt-BR')}g`
}

const LotesViewModal = ({ isOpen, toggle, loteId }: LotesViewModalProps) => {
    const [lote, setLote] = useState<LotesView>()
    const [loading, setLoading] = useState(false)
    const estoqueService = new EstoqueService()

    useEffect(() => {
        const loadLote = async () => {
            if (!isOpen || !loteId) return
            setLoading(true)
            try {
                const view = await estoqueService.getViewLote({ id: loteId })
                if (view) setLote(view)
            } catch (error) {
                console.error('Erro ao carregar lote:', error)
            } finally {
                setLoading(false)
            }
        }
        loadLote()
    }, [isOpen, loteId])

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader toggle={toggle}>Visualizar Lote</ModalHeader>
            <ModalBody>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : lote ? (
                    <Row>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Item</Label>
                            <div>{lote.item_descricao || '—'}</div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Compra</Label>
                            <div>{lote.compra_descricao || '—'}</div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Data Compra</Label>
                            <div>{lote.data_compra || '—'}</div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Status</Label>
                            <div>{lote.status || '—'}</div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Quantidade Original</Label>
                            <div>{formatQuantidade(lote.qtd_original)}</div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Quantidade Atual</Label>
                            <div>{formatQuantidade(lote.qtd_atual)}</div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Percentual Utilizado</Label>
                            <div>
                                {lote.percentual_utilizado != null
                                    ? `${lote.percentual_utilizado}%`
                                    : '—'}
                            </div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Valor Unitário</Label>
                            <div>
                                {lote.valor_unitario != null
                                    ? formatarParaMoedaSemSimbolo(lote.valor_unitario)
                                    : '—'}
                            </div>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Label className="form-label fw-semibold">Valor Total</Label>
                            <div>
                                {lote.valor_total != null
                                    ? formatarParaMoedaSemSimbolo(lote.valor_total)
                                    : '—'}
                            </div>
                        </Col>
                    </Row>
                ) : (
                    <div className="text-center py-4 text-muted">Lote não encontrado.</div>
                )}
            </ModalBody>
        </Modal>
    )
}

export default LotesViewModal
