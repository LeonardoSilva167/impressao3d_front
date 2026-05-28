import React, { useMemo, useState } from 'react'
import { Alert, Button, Card, CardBody, Col, Row, Table } from 'reactstrap'
import CustomModal from 'Components/ComponentController/Modal/CustomModal'
import { getAlturasCamadaPorBico } from 'interfaces/ConfiguracoesTecnicas/ConfiguracoesTecnicasInterface'
import { ParteProjetoImpressaoModel } from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'
import { calcularPesoTotalParte, formatarNumeroDecimal, formatarSimNao, obterValorNumerico } from '../hooks/useProjetosImpressao'
import ParteProjetoModal from '../ParteProjetoModal/ParteProjetoModal'

export interface PartesProjetoTableProps {
    partes: ParteProjetoImpressaoModel[]
    onChange: (partes: ParteProjetoImpressaoModel[]) => void
    bicoPadrao: string | null | undefined
    modoView?: boolean
}

const PartesProjetoTable = ({ partes, onChange, bicoPadrao, modoView = false }: PartesProjetoTableProps) => {
    const [modalOpen, setModalOpen] = useState(false)
    const [parteEmEdicao, setParteEmEdicao] = useState<ParteProjetoImpressaoModel | null>(null)
    const [parteIndexEdicao, setParteIndexEdicao] = useState<number | null>(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)
    const [parteIndexExclusao, setParteIndexExclusao] = useState<number | null>(null)

    const alturaCamadaOptions = useMemo(
        () => getAlturasCamadaPorBico(bicoPadrao || '0.4').map((opt) => ({
            ...opt,
            label: `${opt.label}mm`,
        })),
        [bicoPadrao]
    )

    const abrirModalNova = () => {
        setParteEmEdicao(null)
        setParteIndexEdicao(null)
        setModalOpen(true)
    }

    const abrirModalEditar = (parte: ParteProjetoImpressaoModel, index: number) => {
        setParteEmEdicao(parte)
        setParteIndexEdicao(index)
        setModalOpen(true)
    }

    const confirmarExclusao = (index: number) => {
        setParteIndexExclusao(index)
        setDeleteModalOpen(true)
    }

    const excluirParte = () => {
        if (parteIndexExclusao == null) return
        onChange(partes.filter((_, i) => i !== parteIndexExclusao))
        setDeleteModalOpen(false)
        setParteIndexExclusao(null)
    }

    const salvarParte = (parte: ParteProjetoImpressaoModel) => {
        if (parteIndexEdicao != null) {
            const novasPartes = [...partes]
            novasPartes[parteIndexEdicao] = parte
            onChange(novasPartes)
        } else {
            onChange([...partes, { ...parte, id: parte.id != null ? parte.id : `temp-${Date.now()}` }])
        }
    }

    return (
        <React.Fragment>
            {!modoView && (
                <Row className="mt-4">
                    <Col md={12}>
                        <Alert color="info" className="py-2">
                            Etapa 2 — Após salvar o projeto, adicione quantas partes desejar.
                        </Alert>
                    </Col>
                </Row>
            )}

            <Row>
                <Col md={12}>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h5 className="mb-0">Partes do Projeto</h5>
                        <Button color="primary" type="button" onClick={abrirModalNova}>
                            <i className="ri-add-line me-1"></i> Adicionar Parte
                        </Button>
                    </div>
                </Col>
            </Row>

            <Card>
                <CardBody>
                    {partes.length === 0 ? (
                        <p className="text-muted text-center mb-0">Nenhuma parte cadastrada.</p>
                    ) : (
                        <div className="table-responsive">
                            <Table className="table align-middle table-nowrap table-striped-columns mb-0 text-center">
                                <thead className="table-light">
                                    <tr>
                                        <th scope="col" className="text-start">Nome Parte</th>
                                        <th scope="col">Tempo Impressão</th>
                                        <th scope="col">Peso Total</th>
                                        <th scope="col">Temp. Bico</th>
                                        <th scope="col">Temp. Mesa</th>
                                        <th scope="col">Suporte</th>
                                        <th scope="col">Brim</th>
                                        <th scope="col">Engomagem</th>
                                        <th scope="col" style={{ width: '120px' }}>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partes.map((parte, index) => (
                                        <tr key={parte.id != null ? parte.id : index}>
                                            <td className="text-start">{parte.nome_parte}</td>
                                            <td>{parte.tempo_impressao || '—'}</td>
                                            <td>
                                                {(() => {
                                                    const pesoTotal = parte.peso_total != null
                                                        ? obterValorNumerico(parte.peso_total)
                                                        : calcularPesoTotalParte(parte)
                                                    return pesoTotal > 0
                                                        ? `${formatarNumeroDecimal(pesoTotal)}g`
                                                        : '—'
                                                })()}
                                            </td>
                                            <td>{parte.temperatura_bico != null ? parte.temperatura_bico : '—'}</td>
                                            <td>{parte.temperatura_mesa != null ? parte.temperatura_mesa : '—'}</td>
                                            <td>{formatarSimNao(parte.usa_suporte)}</td>
                                            <td>{formatarSimNao(parte.usa_brim)}</td>
                                            <td>{formatarSimNao(parte.usa_engomagem)}</td>
                                            <td>
                                                <Button
                                                    color="soft-primary"
                                                    size="sm"
                                                    type="button"
                                                    className="me-1"
                                                    onClick={() => abrirModalEditar(parte, index)}
                                                >
                                                    <i className="ri-edit-line"></i>
                                                </Button>
                                                <Button
                                                    color="soft-danger"
                                                    size="sm"
                                                    type="button"
                                                    onClick={() => confirmarExclusao(index)}
                                                >
                                                    <i className="ri-delete-bin-line"></i>
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </CardBody>
            </Card>

            <ParteProjetoModal
                isOpen={modalOpen}
                toggle={() => setModalOpen(!modalOpen)}
                parte={parteEmEdicao}
                onSave={salvarParte}
                alturaCamadaOptions={alturaCamadaOptions}
            />

            <CustomModal
                isOpen={deleteModalOpen}
                toggle={() => setDeleteModalOpen(!deleteModalOpen)}
                title="Confirmação de Exclusão"
                delete={true}
                body="Deseja excluir esta parte?"
                onConfirmDelete={excluirParte}
            />
        </React.Fragment>
    )
}

export default PartesProjetoTable
