import React, { useEffect, useState } from 'react'
import { Modal, ModalBody, ModalHeader, Row, Col, Label, Spinner } from 'reactstrap'
import { formatDateSQLForBR, formatDateTimeBR, formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import { CarreteisFinalizadosView } from 'interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface'
import { CarreteisFinalizadosService } from 'services/CarreteisFinalizados/CarreteisFinalizadosService'

interface CarreteisFinalizadosViewModalProps {
    isOpen: boolean
    toggle: () => void
    registroId: number | null
}

const formatGramatura = (value: number | string | null | undefined) => {
    if (value == null || value === '') return '—'
    return `${value}g`
}

const formatQuantidadeGramas = (value: number | null | undefined) => {
    if (value == null) return '—'
    return `${value.toLocaleString('pt-BR')}g`
}

const formatDataFinalizacao = (value?: string) => {
    if (!value) return '—'
    if (value.includes('T')) return formatDateTimeBR(value)
    const [datePart, timePart] = value.split(' ')
    if (!datePart) return value
    const formattedDate = formatDateSQLForBR(datePart)
    if (timePart) {
        const [hour, minute] = timePart.split(':')
        return `${formattedDate} ${hour}:${minute}`
    }
    return formattedDate
}

const CarreteisFinalizadosViewModal = ({ isOpen, toggle, registroId }: CarreteisFinalizadosViewModalProps) => {
    const [registro, setRegistro] = useState<CarreteisFinalizadosView>()
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const carreteisFinalizadosService = new CarreteisFinalizadosService()

        const loadRegistro = async () => {
            if (!isOpen || !registroId) return
            setLoading(true)
            try {
                const view = await carreteisFinalizadosService.getViewCarreteisFinalizados({ id: registroId })
                if (view) setRegistro(view)
            } catch (error) {
                console.error('Erro ao carregar carretel finalizado:', error)
            } finally {
                setLoading(false)
            }
        }
        loadRegistro()
    }, [isOpen, registroId])

    useEffect(() => {
        if (!isOpen) {
            setRegistro(undefined)
        }
    }, [isOpen])

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader toggle={toggle}>Visualizar Carretel Finalizado</ModalHeader>
            <ModalBody>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : registro ? (
                    <>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Filamento</Label>
                                <div>{registro.item_descricao || '—'}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Data Finalização</Label>
                                <div>{formatDataFinalizacao(registro.data_finalizacao)}</div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Label className="form-label fw-semibold">Gramatura</Label>
                                <div>{formatGramatura(registro.gramatura)}</div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Label className="form-label fw-semibold">Quantidade</Label>
                                <div>{registro.quantidade != null ? registro.quantidade : '—'}</div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Label className="form-label fw-semibold">Total Consumido</Label>
                                <div>{formatQuantidadeGramas(registro.total_consumido)}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Usuário</Label>
                                <div>{registro.usuario_descricao || '—'}</div>
                            </Col>
                            <Col md={12} className="mb-3">
                                <Label className="form-label fw-semibold">Observação</Label>
                                <div>{registro.observacao || '—'}</div>
                            </Col>
                        </Row>

                        <hr />

                        <h6 className="mb-3 text-muted">Lote utilizado (FIFO)</h6>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Compra</Label>
                                <div>{registro.compra_descricao || '—'}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Número Pedido</Label>
                                <div>{registro.numero_pedido || '—'}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Plataforma</Label>
                                <div>{registro.plataforma_descricao || '—'}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Data Compra</Label>
                                <div>
                                    {registro.data_compra
                                        ? formatDateSQLForBR(registro.data_compra)
                                        : '—'}
                                </div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Label className="form-label fw-semibold">Quantidade Original</Label>
                                <div>{formatQuantidadeGramas(registro.qtd_original)}</div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Label className="form-label fw-semibold">Quantidade Atual</Label>
                                <div>{formatQuantidadeGramas(registro.qtd_atual)}</div>
                            </Col>
                            <Col md={4} className="mb-3">
                                <Label className="form-label fw-semibold">Valor Unitário</Label>
                                <div>
                                    {registro.valor_unitario != null
                                        ? formatarParaMoedaSemSimbolo(registro.valor_unitario)
                                        : '—'}
                                </div>
                            </Col>
                        </Row>
                    </>
                ) : (
                    <div className="text-center py-4 text-muted">Registro não encontrado.</div>
                )}
            </ModalBody>
        </Modal>
    )
}

export default CarreteisFinalizadosViewModal
