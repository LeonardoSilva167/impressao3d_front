import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Spinner, Table } from 'reactstrap'
import { formatDateSQLForBR, formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers'
import { CompraItens, ComprasView } from 'interfaces/Compras/ComprasInterface'
import { ComprasService } from 'services/Compras/ComprasService'

interface ComprasCancelModalProps {
    isOpen: boolean
    toggle: () => void
    compraId: number | null
    onSuccess?: () => void
}

const TIPO_ITEM_FILAMENTO = 'FILAMENTO'

const formatarQuantidadeLote = (item: CompraItens, quantidade: number | string | null | undefined): string => {
    if (quantidade == null || quantidade === '') return '—'
    const qtd = Number(quantidade)
    if (isNaN(qtd)) return String(quantidade)
    if (item.tipo_item === TIPO_ITEM_FILAMENTO || item.item_unidade_medida === 'g') {
        return `${qtd.toLocaleString('pt-BR')}g`
    }
    return qtd.toLocaleString('pt-BR')
}

const obterNomeItem = (item: CompraItens): string => {
    if (item.nome_item) return item.nome_item
    if (item.item_descricao && item.item_codigo) {
        return `${item.item_descricao} (${item.item_codigo})`
    }
    return item.item_descricao || item.item_codigo || '—'
}

const ComprasCancelModal = ({ isOpen, toggle, compraId, onSuccess }: ComprasCancelModalProps) => {
    const [compra, setCompra] = useState<ComprasView>()
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const comprasService = new ComprasService()

    useEffect(() => {
        const loadCompra = async () => {
            if (!isOpen || !compraId) {
                setCompra(undefined)
                setErrorMessage('')
                return
            }

            setLoading(true)
            setErrorMessage('')

            try {
                const view = await comprasService.getViewCompras({ id: compraId })
                if (view) setCompra(view)
            } catch (error) {
                console.error('Erro ao carregar compra:', error)
                setErrorMessage('Não foi possível carregar os dados da compra.')
            } finally {
                setLoading(false)
            }
        }

        loadCompra()
    }, [isOpen, compraId])

    const handleConfirmCancel = async () => {
        if (!compraId) return

        setSubmitting(true)
        setErrorMessage('')

        try {
            await comprasService.cancelCompras(compraId)
            toast.success('Compra cancelada com sucesso')
            toggle()
            if (onSuccess) onSuccess()
        } catch (error: any) {
            const message = error?.message || 'Erro ao cancelar compra'
            if (message.toLowerCase().includes('estoque já consumido') || message.toLowerCase().includes('estoque ja consumido')) {
                setErrorMessage('Não é possível cancelar esta compra pois parte do estoque já foi utilizada.')
            } else {
                setErrorMessage(message)
            }
        } finally {
            setSubmitting(false)
        }
    }

    const itens = compra?.compra_itens?.length
        ? compra.compra_itens
        : (compra?.itens || [])

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered size="lg">
            <ModalHeader toggle={toggle}>Cancelar Compra</ModalHeader>
            <ModalBody>
                {loading ? (
                    <div className="text-center py-4">
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : compra ? (
                    <>
                        <Row>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Número do Pedido</Label>
                                <div>{compra.numero_pedido || '—'}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Plataforma</Label>
                                <div>{compra.plataforma_compra_descricao || compra.plataforma_descricao || '—'}</div>
                            </Col>
                            <Col md={6} className="mb-3">
                                <Label className="form-label fw-semibold">Data da Compra</Label>
                                <div>{compra.data_compra ? formatDateSQLForBR(compra.data_compra) : '—'}</div>
                            </Col>
                        </Row>

                        <div className="table-responsive mt-2">
                            <Table className="table-bordered table-nowrap align-middle mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th className="text-start">Item</th>
                                        <th>Qtd Compra</th>
                                        <th>Qtd Original</th>
                                        <th>Estoque Atual</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itens.length ? itens.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td className="text-start">{obterNomeItem(item)}</td>
                                            <td>{item.qtd_compra ?? '—'}</td>
                                            <td>{formatarQuantidadeLote(item, item.qtd_original ?? item.qtd_interna)}</td>
                                            <td>{formatarQuantidadeLote(item, item.qtd_atual)}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="text-center text-muted">Nenhum item encontrado.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>

                        <div className="mt-3 text-muted">
                            Total da compra: R$ {formatarParaMoedaSemSimbolo(compra.valor_total)}
                        </div>

                        <div className="alert alert-warning mt-3 mb-0">
                            Ao cancelar, os lotes desta compra serão zerados e ela não participará mais do estoque.
                        </div>

                        {errorMessage && (
                            <div className="alert alert-danger mt-3 mb-0">{errorMessage}</div>
                        )}

                        <div className="d-flex gap-2 justify-content-end mt-4">
                            <Button type="button" color="light" onClick={toggle} disabled={submitting}>
                                Fechar
                            </Button>
                            <Button
                                type="button"
                                color="danger"
                                onClick={handleConfirmCancel}
                                disabled={submitting}
                            >
                                {submitting ? 'Cancelando...' : 'Confirmar Cancelamento'}
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-4 text-muted">
                        {errorMessage || 'Compra não encontrada.'}
                    </div>
                )}
            </ModalBody>
        </Modal>
    )
}

export default ComprasCancelModal
