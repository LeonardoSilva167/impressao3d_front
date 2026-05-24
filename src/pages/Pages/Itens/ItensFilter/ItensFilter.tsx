import UiContent from "Components/Common/UiContent"
import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import {
    Breadcrumb, BreadcrumbItem, Button, Card, CardHeader, Col, Collapse, Label, Row
} from "reactstrap"
import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled"
import { SelectListControlled } from "Components/ComponentController/Selects/Select/SelectListControlled"
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface"
import { ItensSearch } from "interfaces/Itens/ItensInterface"
import { CategoriasService } from "services/Categorias/CategoriasService"

export interface ItensFilterProps {
    getRemoteItensList: (data: any) => void
}

const ItensFilter = ({ getRemoteItensList }: ItensFilterProps) => {
    const { handleSubmit, control, register } = useForm<ItensSearch>({ defaultValues: {} })
    const [showFilter, setShowFilter] = useState<boolean>(false)
    const [categorias, setCategorias] = useState<SelectOptions[]>([])
    const categoriasService = new CategoriasService()

    const getLookups = async (): Promise<void> => {
        try {
            const resCategorias = await categoriasService.AsyncListCategorias({})
            if (resCategorias) {
                setCategorias(resCategorias.map((el: any) => ({ value: el.id, label: el.descricao })))
            }
        } catch (error) {
            console.error("Erro ao carregar categorias:", error)
        }
    }

    useEffect(() => {
        getLookups()
    }, [])

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
                            <h4 className="mb-0">Itens</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                            <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                            <BreadcrumbItem active>Itens</BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xs={12}>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-4">
                        <Link to="add" className="btn btn-primary">
                            <i className="ri-add-circle-line align-middle me-1"></i> Add
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
                                            <form onSubmit={handleSubmit(getRemoteItensList)}>
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
                                            onSubmit={handleSubmit(getRemoteItensList)}
                                        >
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_categoria_item" className="form-label">Categoria</Label>
                                                        <SelectListControlled<ItensSearch>
                                                            control={control}
                                                            field="id_categoria_item"
                                                            options={categorias}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="codigo" className="form-label">Código</Label>
                                                        <InputTextControlled<ItensSearch>
                                                            field={"codigo"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                        <InputTextControlled<ItensSearch>
                                                            field={"descricao"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="unidade_medida" className="form-label">Unidade de Medida</Label>
                                                        <InputTextControlled<ItensSearch>
                                                            field={"unidade_medida"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className="mt-5">
                                                <div className="d-flex flex-row justify-content-end align-items-center">
                                                    <Col md={6}>
                                                        <InputTextControlled<ItensSearch>
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

export default ItensFilter
