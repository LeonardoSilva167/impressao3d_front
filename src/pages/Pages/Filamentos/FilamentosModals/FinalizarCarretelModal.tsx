import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import {
    FinalizarCarretelDefaultValues,
    FinalizarCarretelModel,
    GRAMATURA_CARRETEL_OPTIONS,
} from 'interfaces/Estoque/EstoqueInterface'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { FilamentosService } from 'services/Filamentos/FilamentosService'
import { EstoqueService } from 'services/Estoque/EstoqueService'

interface FinalizarCarretelModalProps {
    isOpen: boolean
    toggle: () => void
    idFilamentoPreSelecionado?: number | null
    onSuccess?: () => void
}

const FinalizarCarretelModal = ({
    isOpen,
    toggle,
    idFilamentoPreSelecionado,
    onSuccess,
}: FinalizarCarretelModalProps) => {
    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm<FinalizarCarretelModel>({
        defaultValues: FinalizarCarretelDefaultValues,
    })
    const filamentosService = new FilamentosService()
    const estoqueService = new EstoqueService()

    const getListFilamentos = async (inputValue: string): Promise<SelectOptions[]> => {
        const list = await filamentosService.AsyncListFilamentos({ palavra_chave: inputValue })
        if (!list || !list.length) return []
        return list.map((item: any) => ({
            value: item.id,
            label: item.resumo || item.codigo || `Filamento ${item.id}`,
        }))
    }

    const onSubmit: SubmitHandler<FinalizarCarretelModel> = async (data) => {
        try {
            await estoqueService.finalizarCarretel(data)
            toast.success('Carretel finalizado com sucesso')
            toggle()
            if (onSuccess) onSuccess()
        } catch (error) {
            const err = error as any
            const message = (err && err.errors && err.errors.message)
                || (err && err.message)
                || 'Erro ao finalizar carretel'
            toast.error(message)
        }
    }

    useEffect(() => {
        if (isOpen) {
            reset(FinalizarCarretelDefaultValues)
            if (idFilamentoPreSelecionado) {
                setValue('id_filamento', String(idFilamentoPreSelecionado))
            }
        }
    }, [isOpen, idFilamentoPreSelecionado, reset, setValue])

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>Finalizar Carretel</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label className="form-label">Filamento</Label>
                                <AsyncSelectListControlled<FinalizarCarretelModel>
                                    callback={getListFilamentos}
                                    field="id_filamento"
                                    control={control}
                                    placeholder="Digite para buscar..."
                                    required={true}
                                />
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label className="form-label">Gramatura</Label>
                                <SelectListControlled<FinalizarCarretelModel>
                                    control={control}
                                    field="gramatura"
                                    options={GRAMATURA_CARRETEL_OPTIONS}
                                    placeholder="Selecione..."
                                    required={required}
                                    errors={errors.gramatura}
                                />
                            </div>
                        </Col>
                    </Row>
                    <div className="d-flex gap-2 justify-content-end mt-3">
                        <Button type="button" color="light" onClick={toggle}>Cancelar</Button>
                        <Button type="submit" color="primary">Confirmar</Button>
                    </div>
                </form>
            </ModalBody>
        </Modal>
    )
}

export default FinalizarCarretelModal
