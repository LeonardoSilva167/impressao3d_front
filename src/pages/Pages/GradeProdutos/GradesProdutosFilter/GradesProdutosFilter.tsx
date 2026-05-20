import UiContent from "Components/Common/UiContent";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Card, CardHeader, Col, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from "reactstrap";
import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled";
import { InputDate } from "Components/ComponentController/Inputs/Date/InputDate";
import { SelectListControlled } from "Components/ComponentController/Selects/Select/SelectListControlled";
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface";
// import { AsyncSelectListControlled } from "Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled";
import { AsyncSelectListControlled } from "Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled";
import { InputCheckbox } from "Components/ComponentController/Inputs/Checkbox/InputCheckbox";
import { InputRadio } from "Components/ComponentController/Inputs/Radio/InputRadio";
import CustomModal from "Components/ComponentController/Modal/CustomModal";
import { GradesProdutosService } from "services/GradesProdutosService/GradesProdutosService";
import { GradesProdutosModel, GradesProdutosSearch } from "interfaces/GradesProdutos/GradesProdutosInterface";


export interface GradesProdutosFilterProps {
    getRemoteGradesProdutosList: (data: any) => void
}

const GradesProdutosFilter = ({ getRemoteGradesProdutosList }: GradesProdutosFilterProps) => {
    const gradesProdutosService = new GradesProdutosService()


    const [optMarcas, setOptMarcas] = useState<SelectOptions[]>([])
    const [optUsoPeriodo, setOptUsoPeriodo] = useState<SelectOptions[]>([])
    const [optTipoProduto, setOptTipoProduto] = useState<SelectOptions[]>([])

    const { handleSubmit, control, setValue, register, watch } = useForm<GradesProdutosSearch>({ defaultValues: {} })

    const [showFilter, setShowFilter] = useState<boolean>(false);
    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };


    const getLookupsGradesProdutos = async (): Promise<void> => {
        const lookups = await gradesProdutosService.getLookupsGradesProdutos()

        if (lookups) {
            let marca = new Array
            lookups.marcas.map(item => { marca.push({ value: item.id, label: `${item.nome} - ${item.codigo}` }) })
            setOptMarcas(marca)

            let usoPeriodo = new Array
            lookups.usoPeriodos.map(item => { usoPeriodo.push({ value: item.id, label: `${item.descricao}` }) })
            setOptUsoPeriodo(usoPeriodo)

            let tipoProduto = new Array
            lookups.tipoProdutos.map(item => { tipoProduto.push({ value: item.id, label: `${item.descricao}` }) })
            setOptTipoProduto(tipoProduto)
        }
    }

    const getListLinhas = async (inputValue: string): Promise<SelectOptions[]> => {
        const listLinha = await gradesProdutosService.AsyncListGradesProdutos({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listLinha && listLinha.map((item: GradesProdutosModel) => {
            opt.push({ value: item.id, label: item.nome })
        });

        return opt
    }

    useEffect(() => {
        getLookupsGradesProdutos()
    }, [])

    return (
        <React.Fragment>
            <UiContent />
            {/* Breadcrumb */}
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <div className='d-sm-flex align-items-center justify-content-between'>
                            <Link to="/dashboard"> <i className="bx bx-arrow-back bx-sm"></i> </Link>
                            <h4 className="mb-sm-0 ms-3">Linha Produto</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                            <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                            <BreadcrumbItem active> Linha Produto </BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>
            {/* Filter */}
            <Row>
                <Col xs={12}>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-4" >
                        <div className="mt-3 mt-lg-0">
                            <div className="col-auto">
                                <Link to="add" type="button" className="btn btn-primary"><i className="ri-add-circle-line align-middle me-1"></i> Add</Link>
                            </div>
                        </div>
                    </div>
                </Col>
                <Col xl={12}>
                    <Card>
                        <CardHeader>
                            <div className="gap-2 flex-wrap">
                                <Row>
                                    <Col md={4}>
                                        <Button onClick={handleShowFilter} color="primary" style={{ cursor: "pointer" }} className="mb-1"> Filtros </Button>
                                    </Col>
                                    {!showFilter &&
                                        <Col md={8}>
                                            <form onSubmit={handleSubmit(getRemoteGradesProdutosList)} >
                                                <div className="input-group">
                                                    <input {...register("palavra_chave")} type="text" className="form-control" placeholder="Buscar..." />
                                                    <button className="btn btn-success" type="submit" id="button-addon2"><i className="ri-search-line align-middle me-1"></i> Buscar</button>
                                                </div>
                                            </form>
                                        </Col>
                                    }
                                </Row>
                            </div>
                            {/* {showFilter && */}
                            <Row>
                                <Col>
                                    <Collapse isOpen={showFilter} id="multiCollapseExample2" className="multi-collapse mt-3">
                                        <div className="">
                                            <form className="px-0 my-0 m-2" id="form-search" name="form-search" onSubmit={handleSubmit(getRemoteGradesProdutosList)}>
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="marca_id" className="form-label">Marcas</Label>
                                                            <SelectListControlled<GradesProdutosSearch>
                                                                options={optMarcas}
                                                                field={"marca_id"}
                                                                control={control}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={5}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="linha_id" className="form-label">Nome Linha</Label>
                                                            <AsyncSelectListControlled<GradesProdutosSearch>
                                                                callback={getListLinhas}
                                                                field={"linha_id"}
                                                                control={control}
                                                                className="w-100"
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="uso_periodo_id" className="form-label">Usabilidade</Label>
                                                            <SelectListControlled<GradesProdutosSearch>
                                                                options={optUsoPeriodo}
                                                                field={"uso_periodo_id"}
                                                                control={control}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="tipo_id" className="form-label">Tipo</Label>
                                                            <SelectListControlled<GradesProdutosSearch>
                                                                options={optTipoProduto}
                                                                field={"tipo_id"}
                                                                control={control}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="hora_protecao" className="form-label">Horas Duração</Label>
                                                            <InputTextControlled<GradesProdutosSearch>
                                                                field={"hora_protecao"}
                                                                control={control}
                                                            />
                                                        </div>
                                                    </Col>

                                                </Row>


                                                <Row className="mt-5">
                                                    <div className="d-flex flex-row justify-content-end align-items-center" >

                                                        <Col md={6}>
                                                            <div className="ms-4 ">
                                                                <InputTextControlled<GradesProdutosSearch> field={"palavra_chave"} control={control} placeholder="Buscar..." />
                                                            </div>
                                                        </Col>
                                                        <Col md={2} className="me-3">
                                                            <button className="btn btn-success form-control ms-3" type="submit" id="button-addon2">Buscar</button>
                                                        </Col>
                                                    </div>
                                                </Row>
                                            </form>
                                        </div>
                                    </Collapse>
                                </Col>
                            </Row>
                            {/* } */}
                        </CardHeader>
                    </Card>
                </Col>
            </Row>
        </React.Fragment >
    )
}

export default GradesProdutosFilter;     