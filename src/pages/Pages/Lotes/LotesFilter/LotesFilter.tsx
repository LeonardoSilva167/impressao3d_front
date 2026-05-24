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
import { LOTE_STATUS_OPTIONS, LotesSearch } from "interfaces/Estoque/EstoqueInterface"
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface"
import { ItensService } from "services/Itens/ItensService"
import { FilamentosService } from "services/Filamentos/FilamentosService"
import { ItensLookup } from "interfaces/Itens/ItensInterface"

export interface LotesFilterProps {
    getRemoteLotesList: (data: any) => void
}

const LotesFilter = ({ getRemoteLotesList }: LotesFilterProps) => {
    const { handleSubmit, control, register } = useForm<LotesSearch>({ defaultValues: {} })
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const itensService = new ItensService()
    const filamentosService = new FilamentosService()

    const formatarLabelItem = (item: ItensLookup): string => {
        let texto = item.descricao || item.codigo || `Item ${item.id}`
        if (item.codigo && item.descricao) {
            texto = `${item.descricao} (${item.codigo})`
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

    const getListFilamentos = async (inputValue: string): Promise<SelectOptions[]> => {
        const list = await filamentosService.AsyncListFilamentos({ palavra_chave: inputValue })
        if (!list || !list.length) return []
        return list.map((item: any) => ({
            value: item.id,
            label: item.resumo || item.codigo || `Filamento ${item.id}`,
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
                            <h4 className="mb-0">Lotes de Estoque</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                            <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                            <BreadcrumbItem active>Lotes</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>

            <Row>
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
                                            <form onSubmit={handleSubmit(getRemoteLotesList)}>
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
                                            onSubmit={handleSubmit(getRemoteLotesList)}
                                        >
                                            <Row>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Item</Label>
                                                        <AsyncSelectListControlled<LotesSearch>
                                                            callback={getListItens}
                                                            field="id_item"
                                                            control={control}
                                                            placeholder="Digite para buscar..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Filamento</Label>
                                                        <AsyncSelectListControlled<LotesSearch>
                                                            callback={getListFilamentos}
                                                            field="id_filamento"
                                                            control={control}
                                                            placeholder="Digite para buscar..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Data Compra</Label>
                                                        <InputDate<LotesSearch>
                                                            field="data_compra"
                                                            register={register}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Status</Label>
                                                        <SelectListControlled<LotesSearch>
                                                            control={control}
                                                            field="status"
                                                            options={LOTE_STATUS_OPTIONS}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="mt-3">
                                                <div className="d-flex flex-row justify-content-end align-items-center">
                                                    <Col md={6}>
                                                        <InputTextControlled<LotesSearch>
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

export default LotesFilter
