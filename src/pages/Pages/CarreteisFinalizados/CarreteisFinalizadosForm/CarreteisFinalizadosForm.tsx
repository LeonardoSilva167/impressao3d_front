import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row, Spinner } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextArea } from 'Components/ComponentController/Inputs/Text/InputTextArea'
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled'
import {
    CarreteisFinalizadosDefaultValues,
    CarreteisFinalizadosModel,
    GRAMATURA_CARRETEIS_OPTIONS,
    TIPO_ITEM_FILAMENTO,
} from 'interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { ItensLookup } from 'interfaces/Itens/ItensInterface'
import { ItensService } from 'services/Itens/ItensService'
import { CarreteisFinalizadosService } from 'services/CarreteisFinalizados/CarreteisFinalizadosService'
import { calcularTotalConsumido, useLotesConsumo } from '../hooks/useCarreteisFinalizados'
import LotesConsumoTable from '../LotesConsumoTable/LotesConsumoTable'

const formatarLabelFilamento = (item: ItensLookup): string => {
    let texto = item.descricao || item.codigo || `Item ${item.id}`
    if (item.codigo && item.descricao) {
        texto = `${item.descricao} (${item.codigo})`
    }
    return texto
}

const CarreteisFinalizadosForm = () => {
    const { state } = useLocation()
    const { id } = useParams()
    const recordId = state?.source?.id ?? (id ? Number(id) : null)
    const isEditing = recordId != null

    const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<CarreteisFinalizadosModel>({
        defaultValues: CarreteisFinalizadosDefaultValues,
    })
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const itensService = new ItensService()
    const carreteisFinalizadosService = new CarreteisFinalizadosService()

    const [loadingRecord, setLoadingRecord] = useState(isEditing)
    const [filamentoDefaultOption, setFilamentoDefaultOption] = useState<SelectOptions | undefined>()
    const [filamentoSelectKey, setFilamentoSelectKey] = useState(0)

    const idItemWatch = watch('id_item')
    const gramaturaWatch = watch('gramatura')
    const quantidadeWatch = watch('quantidade')

    const {
        lotes,
        loading: loadingLotes,
        estoqueInsuficiente,
        estoqueInsuficienteMsg,
        error: lotesError,
        podeConsultar,
    } = useLotesConsumo(idItemWatch, gramaturaWatch, quantidadeWatch)

    const totalConsumido = calcularTotalConsumido(quantidadeWatch, gramaturaWatch)
    const bloquearSalvar = podeConsultar && (estoqueInsuficiente || loadingLotes)

    const getListFilamentos = async (inputValue: string): Promise<SelectOptions[]> => {
        const itens = await itensService.lookupItens({ search: inputValue })
        if (!itens || !itens.length) return []
        return itens
            .filter((item) => item.tipo_item === TIPO_ITEM_FILAMENTO || item.tipo_item === 'FILAMENTOS')
            .map((item) => ({
                value: item.id,
                label: formatarLabelFilamento(item),
            }))
    }

    const loadRecord = async (): Promise<void> => {
        if (!recordId) return

        setLoadingRecord(true)
        try {
            const view = await carreteisFinalizadosService.getViewCarreteisFinalizados({ id: recordId })
            if (!view) return

            reset({
                id: view.id != null ? view.id.toString() : null,
                carreteis_finalizados_id: view.id != null ? view.id.toString() : null,
                id_item: view.id_item != null ? view.id_item.toString() : null,
                gramatura: view.gramatura != null ? view.gramatura.toString() : null,
                quantidade: view.quantidade != null ? view.quantidade.toString() : null,
                observacao: view.observacao ?? null,
            })

            if (view.id_item && view.item_descricao) {
                setFilamentoDefaultOption({ value: view.id_item, label: view.item_descricao })
                setFilamentoSelectKey((prev) => prev + 1)
            }
        } catch (error) {
            console.error('Erro ao carregar carretéis finalizados:', error)
            toast.error('Erro ao carregar registro para edição')
        } finally {
            setLoadingRecord(false)
        }
    }

    const onSubmit: SubmitHandler<CarreteisFinalizadosModel> = async (data) => {
        const quantidade = Number(data.quantidade || 0)
        if (quantidade <= 0) {
            toast.error('A quantidade deve ser maior que zero.')
            return
        }
        if (!data.gramatura) {
            toast.error('Selecione a gramatura.')
            return
        }
        if (!data.id_item) {
            toast.error('Selecione o filamento.')
            return
        }
        if (estoqueInsuficiente) {
            toast.error(estoqueInsuficienteMsg)
            return
        }

        try {
            if (isEditing) {
                await carreteisFinalizadosService.editCarreteisFinalizados({
                    ...data,
                    id: recordId!.toString(),
                    carreteis_finalizados_id: recordId!.toString(),
                })
                toast.success('Carretéis finalizados alterados com sucesso')
            } else {
                await carreteisFinalizadosService.createCarreteisFinalizados(data)
                toast.success('Carretéis finalizados registrados com sucesso')
            }
            navigate('/carreteis-finalizados')
        } catch (error) {
            const err = error as any
            const message = (err && err.errors && err.errors.message)
                || (err && err.message)
                || (isEditing
                    ? 'Erro ao alterar carretéis finalizados'
                    : 'Erro ao registrar carretéis finalizados')
            toast.error(message)
        }
    }

    useEffect(() => {
        setActiveMenu('/carreteis-finalizados')
    }, [])

    useEffect(() => {
        if (isEditing) {
            loadRecord()
        }
    }, [recordId])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/carreteis-finalizados"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {isEditing ? 'Editar' : 'Registrar'} Carretéis Finalizados
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/filamentos">Filamentos</Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/carreteis-finalizados">Carretéis Finalizados</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>{isEditing ? 'Editar' : 'Registrar'}</BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {loadingRecord ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Filamento</Label>
                                                        <AsyncSelectListControlled<CarreteisFinalizadosModel>
                                                            key={filamentoSelectKey}
                                                            callback={getListFilamentos}
                                                            field="id_item"
                                                            control={control}
                                                            placeholder="Digite para buscar..."
                                                            required={true}
                                                            defaultValue={filamentoDefaultOption}
                                                            defaultOptions={filamentoDefaultOption ? [filamentoDefaultOption] : undefined}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Gramatura</Label>
                                                        <SelectListControlled<CarreteisFinalizadosModel>
                                                            control={control}
                                                            field="gramatura"
                                                            options={GRAMATURA_CARRETEIS_OPTIONS}
                                                            placeholder="Selecione..."
                                                            required={required}
                                                            errors={errors.gramatura}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Quantidade</Label>
                                                        <InputNumber<CarreteisFinalizadosModel>
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
                                                        <Label className="form-label">Observação</Label>
                                                        <InputTextArea<CarreteisFinalizadosModel>
                                                            field="observacao"
                                                            register={register}
                                                            rows={3}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            {totalConsumido > 0 && (
                                                <Row>
                                                    <Col md={12}>
                                                        <div className="alert alert-info mb-3">
                                                            <strong>Total a consumir:</strong> {totalConsumido.toLocaleString('pt-BR')}g
                                                            {' '}({quantidadeWatch || 0} carretéis × {gramaturaWatch || 0}g)
                                                        </div>
                                                    </Col>
                                                </Row>
                                            )}

                                            {podeConsultar && (
                                                <Row>
                                                    <Col md={12}>
                                                        <Card className="border shadow-none mb-3">
                                                            <CardBody className="bg-light">
                                                                <h6 className="mb-3 text-muted">
                                                                    Lotes que serão consumidos (FIFO por data de compra)
                                                                </h6>
                                                                {loadingLotes ? (
                                                                    <div className="text-center py-3">
                                                                        <Spinner size="sm" animation="border" variant="primary" />
                                                                    </div>
                                                                ) : estoqueInsuficiente ? (
                                                                    <div className="alert alert-warning mb-0">
                                                                        {estoqueInsuficienteMsg}
                                                                    </div>
                                                                ) : lotesError ? (
                                                                    <div className="text-danger">{lotesError}</div>
                                                                ) : (
                                                                    <LotesConsumoTable lotes={lotes} />
                                                                )}
                                                            </CardBody>
                                                        </Card>
                                                    </Col>
                                                </Row>
                                            )}

                                            <hr />
                                            <Row className="mt-3">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary"
                                                            disabled={bloquearSalvar}
                                                        >
                                                            Salvar
                                                        </button>
                                                        <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>Voltar</button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </form>
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default CarreteisFinalizadosForm
