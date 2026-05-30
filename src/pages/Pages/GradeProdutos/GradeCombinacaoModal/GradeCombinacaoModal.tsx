import React, { useEffect, useState } from 'react'
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row, Table } from 'reactstrap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { GradeCombinacao, GradeCombinacaoParte, GradeParteDisponivel } from 'interfaces/GradeProdutos/GradeProdutosInterface'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { gerarIdLocalCombinacao, obterIdParte, obterNomePartePorId } from '../hooks/useGradeProdutos'

interface CombinacaoFormFields {
    descricao: string
    id_parte: string
}

interface GradeCombinacaoModalProps {
    isOpen: boolean
    toggle: () => void
    partesDisponiveis: GradeParteDisponivel[]
    combinacaoEdicao?: GradeCombinacao | null
    onSalvar: (combinacao: GradeCombinacao) => void
}

const GradeCombinacaoModal = ({
    isOpen,
    toggle,
    partesDisponiveis,
    combinacaoEdicao,
    onSalvar,
}: GradeCombinacaoModalProps) => {
    const [partesCombinacao, setPartesCombinacao] = useState<GradeCombinacaoParte[]>([])

    const { control, handleSubmit, reset, watch, setValue } = useForm<CombinacaoFormFields>({
        defaultValues: { descricao: '', id_parte: '' },
    })

    const idParteSelecionada = watch('id_parte')

    const partesOptions: SelectOptions[] = [
        { value: '', label: 'Selecione' },
        ...partesDisponiveis.map((parte) => ({
            value: obterIdParte(parte),
            label: parte.nome_parte || obterIdParte(parte),
        })),
    ]

    const adicionarParte = () => {
        if (!idParteSelecionada) {
            toast.error('Selecione uma parte.')
            return
        }

        const idStr = String(idParteSelecionada)
        const nomeParte = obterNomePartePorId(partesDisponiveis, idStr)

        setPartesCombinacao((prev) => {
            const existente = prev.find((p) => String(p.id_parte) === idStr)
            if (existente) {
                return prev.map((p) =>
                    String(p.id_parte) === idStr
                        ? { ...p, quantidade: p.quantidade + 1 }
                        : p
                )
            }
            return [...prev, { id_parte: idStr, nome_parte: nomeParte, quantidade: 1 }]
        })

        setValue('id_parte', '')
    }

    const removerParte = (idParte: number | string) => {
        const idStr = String(idParte)
        setPartesCombinacao((prev) => prev.filter((p) => String(p.id_parte) !== idStr))
    }

    const salvarCombinacao = (data: CombinacaoFormFields) => {
        const descricao = (data.descricao || '').trim()
        if (!descricao) {
            toast.error('Informe a descrição da combinação.')
            return
        }
        if (partesCombinacao.length === 0) {
            toast.error('Adicione ao menos uma parte à combinação.')
            return
        }

        onSalvar({
            id: combinacaoEdicao?.id ?? gerarIdLocalCombinacao(),
            descricao,
            partes: partesCombinacao,
        })
        toggle()
    }

    useEffect(() => {
        if (isOpen) {
            if (combinacaoEdicao) {
                reset({ descricao: combinacaoEdicao.descricao, id_parte: '' })
                setPartesCombinacao([...combinacaoEdicao.partes])
            } else {
                reset({ descricao: '', id_parte: '' })
                setPartesCombinacao([])
            }
        }
    }, [isOpen, combinacaoEdicao, reset])

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="lg" centered>
            <ModalHeader toggle={toggle}>
                {combinacaoEdicao ? 'Editar Combinação' : 'Adicionar Combinação'}
            </ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(salvarCombinacao)}>
                    <Row>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                <InputTextControlled<CombinacaoFormFields>
                                    field="descricao"
                                    control={control}
                                    required={required}
                                    placeholder="Ex: Produto Completo, Somente Cuba, Kit Duplo..."
                                />
                            </div>
                        </Col>
                    </Row>

                    <hr />
                    <h6 className="mb-3">Partes</h6>

                    <Row className="align-items-end">
                        <Col md={8}>
                            <div className="mb-3">
                                <Label htmlFor="id_parte" className="form-label">Parte</Label>
                                <SelectListControlled<CombinacaoFormFields>
                                    field="id_parte"
                                    control={control}
                                    options={partesOptions}
                                    placeholder="Selecione a parte..."
                                />
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className="mb-3">
                                <Button
                                    type="button"
                                    color="primary"
                                    onClick={adicionarParte}
                                    disabled={partesDisponiveis.length === 0}
                                >
                                    <i className="ri-add-line me-1"></i> Adicionar Parte
                                </Button>
                            </div>
                        </Col>
                    </Row>

                    {partesCombinacao.length === 0 ? (
                        <p className="text-muted mb-3">Nenhuma parte adicionada.</p>
                    ) : (
                        <div className="table-responsive mb-4">
                            <Table className="table align-middle table-nowrap table-striped-columns mb-0">
                                <thead className="table-light">
                                    <tr>
                                        <th>Parte</th>
                                        <th style={{ width: '120px' }}>Quantidade</th>
                                        <th style={{ width: '80px' }}>Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {partesCombinacao.map((parte) => (
                                        <tr key={String(parte.id_parte)}>
                                            <td>{parte.nome_parte || parte.id_parte}</td>
                                            <td>{parte.quantidade}</td>
                                            <td>
                                                <Button
                                                    type="button"
                                                    color="danger"
                                                    size="sm"
                                                    outline
                                                    onClick={() => removerParte(parte.id_parte)}
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

                    <div className="d-flex gap-2 justify-content-end">
                        <Button type="button" color="light" onClick={toggle}>Cancelar</Button>
                        <Button type="submit" color="primary">Salvar Combinação</Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default GradeCombinacaoModal
