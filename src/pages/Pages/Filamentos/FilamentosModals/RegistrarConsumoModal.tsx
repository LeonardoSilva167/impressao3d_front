import React, { useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button, Col, Label, Modal, ModalBody, ModalHeader, Row } from 'reactstrap'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled'
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import {
    MOTIVO_CONSUMO_OPTIONS,
    RegistrarConsumoDefaultValues,
    RegistrarConsumoModel,
} from 'interfaces/Estoque/EstoqueInterface'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { ItensService } from 'services/Itens/ItensService'
import { EstoqueService } from 'services/Estoque/EstoqueService'
import { ItensLookup } from 'interfaces/Itens/ItensInterface'

interface RegistrarConsumoModalProps {
    isOpen: boolean
    toggle: () => void
    onSuccess?: () => void
}

const RegistrarConsumoModal = ({ isOpen, toggle, onSuccess }: RegistrarConsumoModalProps) => {
    const { handleSubmit, control, register, reset, formState: { errors } } = useForm<RegistrarConsumoModel>({
        defaultValues: RegistrarConsumoDefaultValues,
    })
    const itensService = new ItensService()
    const estoqueService = new EstoqueService()

    const formatarLabelItem = (item: ItensLookup): string => {
        let texto = item.descricao || item.codigo || `Item ${item.id}`
        if (item.codigo && item.descricao) {
            texto = `${item.descricao} (${item.codigo})`
        }
        if (item.tipo_item) {
            return `${item.tipo_item} - ${texto}`
        }
        return texto
    }

    const getListItens = async (inputValue: string): Promise<SelectOptions[]> => {
        const itens = await itensService.lookupItens({ search: inputValue })
        if (!itens || !itens.length) return []
        return itens.map((item) => ({
            value: item.id,
            label: formatarLabelItem(item),
        }))
    }

    const onSubmit: SubmitHandler<RegistrarConsumoModel> = async (data) => {
        try {
            await estoqueService.registrarConsumo(data)
            toast.success('Consumo registrado com sucesso')
            toggle()
            if (onSuccess) onSuccess()
        } catch (error) {
            const err = error as any
            const message = (err && err.errors && err.errors.message)
                || (err && err.message)
                || 'Erro ao registrar consumo'
            toast.error(message)
        }
    }

    useEffect(() => {
        if (isOpen) {
            reset(RegistrarConsumoDefaultValues)
        }
    }, [isOpen, reset])

    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>Registrar Consumo</ModalHeader>
            <ModalBody>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Row>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label className="form-label">Item</Label>
                                <AsyncSelectListControlled<RegistrarConsumoModel>
                                    callback={getListItens}
                                    field="id_item"
                                    control={control}
                                    placeholder="Digite para buscar..."
                                    required={true}
                                />
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label className="form-label">Quantidade</Label>
                                <InputNumber<RegistrarConsumoModel>
                                    field="quantidade"
                                    register={register}
                                    onlyPositive={true}
                                    required={required}
                                    errors={errors.quantidade}
                                />
                            </div>
                        </Col>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label className="form-label">Motivo</Label>
                                <SelectListControlled<RegistrarConsumoModel>
                                    control={control}
                                    field="motivo"
                                    options={MOTIVO_CONSUMO_OPTIONS}
                                    placeholder="Selecione..."
                                    required={required}
                                    errors={errors.motivo}
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

export default RegistrarConsumoModal
