import React, { useEffect, useMemo } from 'react'
import {
    Button, Col, Label, Modal, ModalBody, ModalFooter, ModalHeader, Row
} from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber'
import { InputCheckbox } from 'Components/ComponentController/Inputs/Checkbox/InputCheckbox'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { QUANTIDADE_PAREDES_OPTIONS } from 'interfaces/ConfiguracoesTecnicas/ConfiguracoesTecnicasInterface'
import {
    ParteProjetoImpressaoDefaultValues,
    ParteProjetoImpressaoModel,
    TIPO_SUPORTE_PARTE_OPTIONS,
} from 'interfaces/ProjetosImpressao/ParteProjetoImpressaoInterface'
import { calcularPesoTotalParte, formatarNumeroDecimal } from '../hooks/useProjetosImpressao'

export interface ParteProjetoModalProps {
    isOpen: boolean
    toggle: () => void
    parte?: ParteProjetoImpressaoModel | null
    onSave: (parte: ParteProjetoImpressaoModel) => void
    alturaCamadaOptions: SelectOptions[]
}

const PESO_STEP = '0.01'

const ParteProjetoModal = ({
    isOpen,
    toggle,
    parte,
    onSave,
    alturaCamadaOptions,
}: ParteProjetoModalProps) => {
    const { register, handleSubmit, control, watch, reset } = useForm<ParteProjetoImpressaoModel>({
        defaultValues: ParteProjetoImpressaoDefaultValues,
    })

    const usaSuporteWatch = watch('usa_suporte')
    const usaEngomagemWatch = watch('usa_engomagem')
    const pesoParteWatch = watch('peso_parte')
    const pesoSuporteWatch = watch('peso_suporte')
    const pesoCoradoWatch = watch('peso_corado')
    const pesoTorreWatch = watch('peso_torre')

    const pesoTotalCalculado = useMemo(() => (
        calcularPesoTotalParte({
            peso_parte: pesoParteWatch,
            peso_suporte: pesoSuporteWatch,
            peso_corado: pesoCoradoWatch,
            peso_torre: pesoTorreWatch,
        })
    ), [pesoParteWatch, pesoSuporteWatch, pesoCoradoWatch, pesoTorreWatch])

    useEffect(() => {
        if (isOpen) {
            reset(parte ? parte : ParteProjetoImpressaoDefaultValues)
        }
    }, [isOpen, parte, reset])

    const salvarParte: SubmitHandler<ParteProjetoImpressaoModel> = (data) => {
        onSave({
            ...data,
            peso_total: calcularPesoTotalParte(data),
        })
        toggle()
    }

    return (
        <Modal isOpen={isOpen} toggle={toggle} size="xl" scrollable>
            <ModalHeader toggle={toggle}>
                {parte && parte.id ? 'Editar Parte' : 'Adicionar Parte'}
            </ModalHeader>
            <form onSubmit={handleSubmit(salvarParte)}>
                <ModalBody>
                    <Row>
                        <Col md={6}>
                            <div className="mb-3">
                                <Label htmlFor="nome_parte" className="form-label">Nome Parte</Label>
                                <InputTextControlled<ParteProjetoImpressaoModel>
                                    field={'nome_parte'}
                                    control={control}
                                    rules={required}
                                    placeholder="Ex: tampa, base, olho..."
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="altura_camada" className="form-label">Altura Camada</Label>
                                <SelectListControlled<ParteProjetoImpressaoModel>
                                    field={'altura_camada'}
                                    control={control}
                                    options={alturaCamadaOptions}
                                    required={required}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="loops_parede" className="form-label">Loops Parede</Label>
                                <SelectListControlled<ParteProjetoImpressaoModel>
                                    field={'loops_parede'}
                                    control={control}
                                    options={QUANTIDADE_PAREDES_OPTIONS}
                                    required={required}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="temperatura_bico" className="form-label">Temperatura Bico</Label>
                                <InputNumber<ParteProjetoImpressaoModel>
                                    field={'temperatura_bico'}
                                    register={register}
                                    onlyPositive={true}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="temperatura_mesa" className="form-label">Temperatura Mesa</Label>
                                <InputNumber<ParteProjetoImpressaoModel>
                                    field={'temperatura_mesa'}
                                    register={register}
                                    onlyPositive={true}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="tempo_impressao" className="form-label">Tempo Impressão</Label>
                                <InputTextControlled<ParteProjetoImpressaoModel>
                                    field={'tempo_impressao'}
                                    control={control}
                                    rules={required}
                                    pattern={{
                                        value: /^\d{1,2}:\d{2}$/,
                                        message: 'Formato inválido. Use HH:mm (ex: 01:30)',
                                    }}
                                    placeholder="HH:mm (ex: 01:30)"
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-2">
                        <Col md={12}>
                            <h6 className="text-muted mb-0">Pesos (g)</h6>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="peso_parte" className="form-label">Peso Parte</Label>
                                <InputNumber<ParteProjetoImpressaoModel>
                                    field={'peso_parte'}
                                    register={register}
                                    required={required}
                                    onlyPositive={true}
                                    step={PESO_STEP}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="peso_suporte" className="form-label">Peso Suporte</Label>
                                <InputNumber<ParteProjetoImpressaoModel>
                                    field={'peso_suporte'}
                                    register={register}
                                    onlyPositive={true}
                                    step={PESO_STEP}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="peso_corado" className="form-label">Peso Corado</Label>
                                <InputNumber<ParteProjetoImpressaoModel>
                                    field={'peso_corado'}
                                    register={register}
                                    onlyPositive={true}
                                    step={PESO_STEP}
                                />
                            </div>
                        </Col>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="peso_torre" className="form-label">Peso Torre</Label>
                                <InputNumber<ParteProjetoImpressaoModel>
                                    field={'peso_torre'}
                                    register={register}
                                    onlyPositive={true}
                                    step={PESO_STEP}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={3}>
                            <div className="mb-3">
                                <Label htmlFor="peso_total" className="form-label">Peso Total</Label>
                                <input
                                    id="peso_total"
                                    type="text"
                                    className="form-control bg-light"
                                    readOnly
                                    disabled
                                    value={`${formatarNumeroDecimal(pesoTotalCalculado)}g`}
                                />
                            </div>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={12}>
                            <h6 className="text-muted">Configurações Extras</h6>
                        </Col>
                        <Col md={2}>
                            <Label className="form-label d-block">Suporte?</Label>
                            <InputCheckbox<ParteProjetoImpressaoModel>
                                field={'usa_suporte'}
                                register={register}
                            />
                        </Col>
                        <Col md={2}>
                            <Label className="form-label d-block">Brim?</Label>
                            <InputCheckbox<ParteProjetoImpressaoModel>
                                field={'usa_brim'}
                                register={register}
                            />
                        </Col>
                        <Col md={2}>
                            <Label className="form-label d-block">Engomar?</Label>
                            <InputCheckbox<ParteProjetoImpressaoModel>
                                field={'usa_engomagem'}
                                register={register}
                            />
                        </Col>
                    </Row>

                    {usaSuporteWatch && (
                        <Row>
                            <Col md={3}>
                                <div className="mb-3">
                                    <Label htmlFor="angulo_suporte" className="form-label">Ângulo Suporte</Label>
                                    <InputNumber<ParteProjetoImpressaoModel>
                                        field={'angulo_suporte'}
                                        register={register}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="mb-3">
                                    <Label htmlFor="tipo_suporte" className="form-label">Tipo Suporte</Label>
                                    <SelectListControlled<ParteProjetoImpressaoModel>
                                        field={'tipo_suporte'}
                                        control={control}
                                        options={TIPO_SUPORTE_PARTE_OPTIONS}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="mb-3">
                                    <Label htmlFor="distancia_z_inferior" className="form-label">Distância Inferior Z</Label>
                                    <InputNumber<ParteProjetoImpressaoModel>
                                        field={'distancia_z_inferior'}
                                        register={register}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div className="mb-3">
                                    <Label htmlFor="quantidade_voltas" className="form-label">Quantidade Voltas</Label>
                                    <InputNumber<ParteProjetoImpressaoModel>
                                        field={'quantidade_voltas'}
                                        register={register}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}

                    {usaEngomagemWatch && (
                        <Row>
                            <Col md={4}>
                                <div className="mb-3">
                                    <Label htmlFor="velocidade_engomagem" className="form-label">Velocidade</Label>
                                    <InputNumber<ParteProjetoImpressaoModel>
                                        field={'velocidade_engomagem'}
                                        register={register}
                                    />
                                </div>
                            </Col>
                            <Col md={4}>
                                <div className="mb-3">
                                    <Label htmlFor="fluxo_engomagem" className="form-label">Fluxo</Label>
                                    <InputNumber<ParteProjetoImpressaoModel>
                                        field={'fluxo_engomagem'}
                                        register={register}
                                    />
                                </div>
                            </Col>
                        </Row>
                    )}
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" type="button" onClick={toggle}>Cancelar</Button>
                    <Button color="success" type="submit">Salvar Parte</Button>
                </ModalFooter>
            </form>
        </Modal>
    )
}

export default ParteProjetoModal
