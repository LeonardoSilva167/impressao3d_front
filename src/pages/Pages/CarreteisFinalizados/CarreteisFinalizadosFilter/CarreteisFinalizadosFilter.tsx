import UiContent from "Components/Common/UiContent"
import React, { useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
    Breadcrumb, BreadcrumbItem, Button, Card, CardHeader, Col, Collapse, Label, Row
} from "reactstrap"
import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled"
import { InputDate } from "Components/ComponentController/Inputs/Date/InputDate"
import { SelectListControlled } from "Components/ComponentController/Selects/Select/SelectListControlled"
import { AsyncSelectListControlled } from "Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled"
import {
    CarreteisFinalizadosSearch,
    GRAMATURA_CARRETEIS_OPTIONS,
    TIPO_ITEM_FILAMENTO,
} from "interfaces/CarreteisFinalizados/CarreteisFinalizadosInterface"
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface"
import { ItensLookup } from "interfaces/Itens/ItensInterface"
import { ItensService } from "services/Itens/ItensService"

export interface CarreteisFinalizadosFilterProps {
    getRemoteCarreteisFinalizadosList: (data: any) => void
}

const formatarLabelFilamento = (item: ItensLookup): string => {
    let texto = item.descricao || item.codigo || `Item ${item.id}`
    if (item.codigo && item.descricao) {
        texto = `${item.descricao} (${item.codigo})`
    }
    return texto
}

const CarreteisFinalizadosFilter = ({ getRemoteCarreteisFinalizadosList }: CarreteisFinalizadosFilterProps) => {
    const { handleSubmit, control, register } = useForm<CarreteisFinalizadosSearch>({ defaultValues: {} })
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const itensService = new ItensService()

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

    return (
        <React.Fragment>
            <UiContent />

            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Link to="/dashboard" className="me-2">
                                <i className="bx bx-arrow-back bx-sm"></i>
                            </Link>
                            <h4 className="mb-0">Carretéis Finalizados</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                            <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                            <BreadcrumbItem><Link to="/filamentos">Filamentos</Link></BreadcrumbItem>
                            <BreadcrumbItem active>Carretéis Finalizados</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-4">
                        <Link to="add" className="btn btn-primary">
                            <i className="ri-add-circle-line align-middle me-1"></i> Adicionar
                        </Link>
                    </div>
                </Col>
                <Col xl={12}>
                    <Card>
                        <CardHeader>
                            <div className="gap-2 flex-wrap">
                                <Row>
                                    <Col md={4}>
                                        <Button onClick={() => setShowFilter(!showFilter)} color="primary" className="mb-1">
                                            Filtros
                                        </Button>
                                    </Col>
                                    {!showFilter && (
                                        <Col md={8}>
                                            <form onSubmit={handleSubmit(getRemoteCarreteisFinalizadosList)}>
                                                <div className="input-group">
                                                    <input
                                                        {...register("palavra_chave")}
                                                        type="text"
                                                        className="form-control"
                                                        placeholder="Buscar..."
                                                    />
                                                    <button className="btn btn-success" type="submit">
                                                        <i className="ri-search-line align-middle me-1"></i> Buscar
                                                    </button>
                                                </div>
                                            </form>
                                        </Col>
                                    )}
                                </Row>
                            </div>

                            <Row>
                                <Col>
                                    <Collapse isOpen={showFilter} className="multi-collapse mt-3">
                                        <form
                                            className="px-0 my-0 m-2"
                                            id="form-search"
                                            onSubmit={handleSubmit(getRemoteCarreteisFinalizadosList)}
                                        >
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Filamento</Label>
                                                        <AsyncSelectListControlled<CarreteisFinalizadosSearch>
                                                            callback={getListFilamentos}
                                                            field="id_item"
                                                            control={control}
                                                            placeholder="Digite para buscar..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Gramatura</Label>
                                                        <SelectListControlled<CarreteisFinalizadosSearch>
                                                            control={control}
                                                            field="gramatura"
                                                            options={GRAMATURA_CARRETEIS_OPTIONS}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Data Início</Label>
                                                        <InputDate<CarreteisFinalizadosSearch>
                                                            field="data_inicio"
                                                            register={register}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Data Fim</Label>
                                                        <InputDate<CarreteisFinalizadosSearch>
                                                            field="data_fim"
                                                            register={register}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="mt-3">
                                                <div className="d-flex flex-row justify-content-end align-items-center">
                                                    <Col md={6}>
                                                        <InputTextControlled<CarreteisFinalizadosSearch>
                                                            field={"palavra_chave"}
                                                            control={control}
                                                            placeholder="Buscar..."
                                                        />
                                                    </Col>
                                                    <Col md={2} className="me-3">
                                                        <button className="btn btn-success form-control ms-3" type="submit">
                                                            Buscar
                                                        </button>
                                                    </Col>
                                                </div>
                                            </Row>
                                        </form>
                                    </Collapse>
                                </Col>
                            </Row>
                        </CardHeader>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    )
}

export default CarreteisFinalizadosFilter
