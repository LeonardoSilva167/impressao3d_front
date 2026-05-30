import React, { useMemo, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, Col, Row, Table } from 'reactstrap'
import CustomModal from 'Components/ComponentController/Modal/CustomModal'
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'
import { ItemParteProjetoModel } from 'interfaces/ProjetosImpressao/ItemParteProjetoInterface'
import { ProjetosImpressaoPartesService } from 'services/ProjetosImpressaoPartes/ProjetosImpressaoPartesService'
import { ProjetosImpressaoParteItensService } from 'services/ProjetosImpressaoParteItens/ProjetosImpressaoParteItensService'
import {
    calcularPesoTotalParte,
    calcularResumoPartesItens,
    flattenPartesItens,
    formatarHexadecimalCss,
    formatarNumeroDecimal,
    obterValorNumerico,
} from '../hooks/useProjetosImpressao'
import ParteNomeModal from '../ParteNomeModal/ParteNomeModal'
import ItemParteProjetoModal from '../ItemParteProjetoModal/ItemParteProjetoModal'

export interface PartesProjetoTableProps {
    projetoId: number
    partes: ParteProjetoImpressaoModel[]
    onReload: () => void
    readOnly?: boolean
}

const PartesProjetoTable = ({ projetoId, partes, onReload, readOnly = false }: PartesProjetoTableProps) => {
    const partesService = new ProjetosImpressaoPartesService()
    const itensService = new ProjetosImpressaoParteItensService()

    const [parteModalOpen, setParteModalOpen] = useState(false)
    const [itemModalOpen, setItemModalOpen] = useState(false)
    const [parteEmEdicao, setParteEmEdicao] = useState<ParteProjetoImpressaoModel | null>(null)
    const [itemEmEdicao, setItemEmEdicao] = useState<ItemParteProjetoModel | null>(null)
    const [parteSelecionadaId, setParteSelecionadaId] = useState<number | string | null>(null)
    const [parteSelecionadaNome, setParteSelecionadaNome] = useState('')
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [deleteTarget, setDeleteTarget] = useState<{ tipo: 'parte' | 'item'; id: number } | null>(null)
    const [salvando, setSalvando] = useState(false)

    const linhas = useMemo(() => flattenPartesItens(partes), [partes])
    const resumo = useMemo(() => calcularResumoPartesItens(partes), [partes])

    const abrirModalNovaParte = () => {
        setParteEmEdicao(null)
        setParteModalOpen(true)
    }

    const abrirModalEditarParte = (parte: ParteProjetoImpressaoModel) => {
        setParteEmEdicao(parte)
        setParteModalOpen(true)
    }

    const abrirModalNovoItem = (parte: ParteProjetoImpressaoModel) => {
        if (!parte.id) return
        setItemEmEdicao(null)
        setParteSelecionadaId(parte.id)
        setParteSelecionadaNome(parte.nome_parte || '')
        setItemModalOpen(true)
    }

    const abrirModalEditarItem = (parte: ParteProjetoImpressaoModel, item: ItemParteProjetoModel) => {
        if (!parte.id) return
        setItemEmEdicao(item)
        setParteSelecionadaId(parte.id)
        setParteSelecionadaNome(parte.nome_parte || '')
        setItemModalOpen(true)
    }

    const confirmarExclusao = (tipo: 'parte' | 'item', id: number) => {
        setDeleteTarget({ tipo, id })
        setDeleteModalOpen(true)
    }

    const executarExclusao = async () => {
        if (!deleteTarget) return

        setSalvando(true)
        try {
            if (deleteTarget.tipo === 'parte') {
                await partesService.deleteParte(deleteTarget.id)
                toast.success('Parte excluída com sucesso.')
            } else {
                await itensService.deleteItem(deleteTarget.id)
                toast.success('Item excluído com sucesso.')
            }
            onReload()
        } catch (error) {
            console.error('Erro ao excluir:', error)
            toast.error('Erro ao excluir registro.')
        } finally {
            setSalvando(false)
            setDeleteModalOpen(false)
            setDeleteTarget(null)
        }
    }

    const salvarParte = async (data: ParteProjetoImpressaoModel) => {
        setSalvando(true)
        try {
            if (parteEmEdicao && parteEmEdicao.id) {
                await partesService.editParte({
                    id: parteEmEdicao.id,
                    id_projeto_impressao: projetoId,
                    nome_parte: data.nome_parte,
                })
                toast.success('Parte atualizada com sucesso.')
            } else {
                const newId = await partesService.createParte({
                    id_projeto_impressao: projetoId,
                    nome_parte: data.nome_parte,
                })
                toast.success('Parte cadastrada com sucesso.')
                if (newId) {
                    setParteSelecionadaId(newId)
                    setParteSelecionadaNome(data.nome_parte || '')
                    setItemEmEdicao(null)
                    setItemModalOpen(true)
                }
            }
            onReload()
        } catch (error) {
            console.error('Erro ao salvar parte:', error)
            toast.error('Erro ao salvar parte.')
        } finally {
            setSalvando(false)
        }
    }

    const salvarItem = async (data: ItemParteProjetoModel) => {
        setSalvando(true)
        try {
            if (itemEmEdicao && itemEmEdicao.id) {
                await itensService.editItem({ ...data, id: itemEmEdicao.id })
                toast.success('Item atualizado com sucesso.')
            } else {
                await itensService.createItem(data)
                toast.success('Item cadastrado com sucesso.')
            }
            onReload()
        } catch (error) {
            console.error('Erro ao salvar item:', error)
            toast.error('Erro ao salvar item.')
        } finally {
            setSalvando(false)
        }
    }

    return (
        <React.Fragment>
            {!readOnly && (
                <Row>
                    <Col md={12}>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h5 className="mb-0">Partes e Itens</h5>
                            <Button color="primary" type="button" onClick={abrirModalNovaParte} disabled={salvando}>
                                <i className="ri-add-line me-1"></i> Adicionar Parte
                            </Button>
                        </div>
                    </Col>
                </Row>
            )}

            {readOnly && (
                <Row>
                    <Col md={12}>
                        <h5 className="mb-3">Partes e Itens</h5>
                    </Col>
                </Row>
            )}

            <Card>
                <CardBody>
                    {linhas.length === 0 ? (
                        <p className="text-muted text-center mb-0">Nenhuma parte ou item cadastrado.</p>
                    ) : (
                        <div className="table-responsive">
                            <Table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-start">Parte</th>
                                        <th scope="col" className="text-start">Item</th>
                                        <th scope="col">Cor</th>
                                        <th scope="col">Tempo</th>
                                        <th scope="col">Peso Total</th>
                                        {!readOnly && <th scope="col" style={{ width: '140px' }}>Ação</th>}
                                    </tr>
                                </thead>
                                <tbody>
                                    {linhas.map((linha) => {
                                        const item = linha.item
                                        const pesoTotal = item
                                            ? (item.peso_total != null
                                                ? obterValorNumerico(item.peso_total)
                                                : calcularPesoTotalParte(item))
                                            : 0

                                        return (
                                            <tr key={linha.chave}>
                                                <td className="text-start">{linha.parte.nome_parte || '—'}</td>
                                                <td className="text-start">{item ? item.nome_item : '—'}</td>
                                                <td>
                                                    {item ? (
                                                        <div className="d-flex align-items-center justify-content-center gap-2">
                                                            {item.cor_hexadecimal && (
                                                                <span
                                                                    style={{
                                                                        width: '18px',
                                                                        height: '18px',
                                                                        borderRadius: '50%',
                                                                        background: formatarHexadecimalCss(item.cor_hexadecimal),
                                                                        border: '1px solid #ccc',
                                                                        display: 'inline-block',
                                                                    }}
                                                                />
                                                            )}
                                                            <span>{item.cor_descricao || '—'}</span>
                                                        </div>
                                                    ) : '—'}
                                                </td>
                                                <td>{item ? (item.tempo_impressao || '—') : '—'}</td>
                                                <td>
                                                    {item && pesoTotal > 0
                                                        ? `${formatarNumeroDecimal(pesoTotal)}g`
                                                        : '—'}
                                                </td>
                                                {!readOnly && (
                                                    <td>
                                                        {!item && linha.parte.id && (
                                                            <>
                                                                <Button
                                                                    color="soft-success"
                                                                    size="sm"
                                                                    type="button"
                                                                    className="me-1"
                                                                    title="Adicionar Item"
                                                                    onClick={() => abrirModalNovoItem(linha.parte)}
                                                                >
                                                                    <i className="ri-add-line"></i>
                                                                </Button>
                                                                <Button
                                                                    color="soft-primary"
                                                                    size="sm"
                                                                    type="button"
                                                                    className="me-1"
                                                                    onClick={() => abrirModalEditarParte(linha.parte)}
                                                                >
                                                                    <i className="ri-edit-line"></i>
                                                                </Button>
                                                                <Button
                                                                    color="soft-danger"
                                                                    size="sm"
                                                                    type="button"
                                                                    onClick={() => confirmarExclusao('parte', Number(linha.parte.id))}
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
                                                                </Button>
                                                            </>
                                                        )}
                                                        {item && item.id && (
                                                            <>
                                                                <Button
                                                                    color="soft-primary"
                                                                    size="sm"
                                                                    type="button"
                                                                    className="me-1"
                                                                    onClick={() => abrirModalEditarItem(linha.parte, item)}
                                                                >
                                                                    <i className="ri-edit-line"></i>
                                                                </Button>
                                                                <Button
                                                                    color="soft-danger"
                                                                    size="sm"
                                                                    type="button"
                                                                    onClick={() => confirmarExclusao('item', Number(item.id))}
                                                                >
                                                                    <i className="ri-delete-bin-line"></i>
                                                                </Button>
                                                            </>
                                                        )}
                                                    </td>
                                                )}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                                {linhas.length > 0 && (
                                    <tfoot className="table-light">
                                        <tr>
                                            <td colSpan={readOnly ? 2 : 2} className="text-end fw-semibold">
                                                Total de Itens:
                                            </td>
                                            <td className="fw-semibold">{resumo.totalItens}</td>
                                            <td className="text-end fw-semibold">Tempo Total Projeto:</td>
                                            <td className="fw-semibold">{resumo.tempoTotal}</td>
                                            {!readOnly && <td />}
                                        </tr>
                                        <tr>
                                            <td colSpan={readOnly ? 4 : 4} className="text-end fw-semibold">
                                                Peso Total Projeto:
                                            </td>
                                            <td className="fw-semibold">
                                                {formatarNumeroDecimal(resumo.pesoTotal)}g
                                            </td>
                                            {!readOnly && <td />}
                                        </tr>
                                    </tfoot>
                                )}
                            </Table>
                        </div>
                    )}
                </CardBody>
            </Card>

            {!readOnly && (
                <>
                    <ParteNomeModal
                        isOpen={parteModalOpen}
                        toggle={() => setParteModalOpen(!parteModalOpen)}
                        parte={parteEmEdicao}
                        onSave={salvarParte}
                    />

                    {parteSelecionadaId && (
                        <ItemParteProjetoModal
                            isOpen={itemModalOpen}
                            toggle={() => setItemModalOpen(!itemModalOpen)}
                            item={itemEmEdicao}
                            idParte={parteSelecionadaId}
                            nomeParte={parteSelecionadaNome}
                            onSave={salvarItem}
                        />
                    )}

                    <CustomModal
                        isOpen={deleteModalOpen}
                        toggle={() => setDeleteModalOpen(!deleteModalOpen)}
                        title="Confirmação de Exclusão"
                        delete={true}
                        body={`Deseja excluir este ${deleteTarget?.tipo === 'parte' ? 'parte' : 'item'}?`}
                        onConfirmDelete={executarExclusao}
                    />
                </>
            )}
        </React.Fragment>
    )
}

export default PartesProjetoTable
