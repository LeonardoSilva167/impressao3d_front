import React, { useEffect } from 'react'
import { Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import {
    ParteProjetoImpressaoDefaultValues,
    ParteProjetoImpressaoModel,
} from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'

export interface ParteNomeModalProps {
    isOpen: boolean
    toggle: () => void
    parte?: ParteProjetoImpressaoModel | null
    onSave: (parte: ParteProjetoImpressaoModel) => void
}

const ParteNomeModal = ({ isOpen, toggle, parte, onSave }: ParteNomeModalProps) => {
    const { handleSubmit, control, reset } = useForm<ParteProjetoImpressaoModel>({
        defaultValues: ParteProjetoImpressaoDefaultValues,
    })

    useEffect(() => {
        if (isOpen) {
            reset(parte ? parte : ParteProjetoImpressaoDefaultValues)
        }
    }, [isOpen, parte, reset])

    const salvar: SubmitHandler<ParteProjetoImpressaoModel> = (data) => {
        onSave(data)
        toggle()
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader toggle={toggle}>
                {parte && parte.id ? 'Editar Parte' : 'Adicionar Parte'}
            </ModalHeader>
            <form onSubmit={handleSubmit(salvar)}>
                <ModalBody>
                    <Row>
                        <Col md={12}>
                            <div className="mb-3">
                                <Label htmlFor="nome_parte" className="form-label">Nome da Parte</Label>
                                <InputTextControlled<ParteProjetoImpressaoModel>
                                    field={'nome_parte'}
                                    control={control}
                                    required={required}
                                    placeholder="Ex: Tampa, Base, Olho..."
                                />
                            </div>
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" type="button" onClick={toggle}>Cancelar</Button>
                    <Button color="success" type="submit">Salvar Parte</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ParteNomeModal
