import UiContent from "Components/Common/UiContent";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Card, CardHeader, Col, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from "reactstrap";
import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled";
import { ServicosSearch } from "interfaces/Servicos";
import { ServicosService } from "services/ServicosService";



export interface ServicosFilterProps {
    getRemoteServicosList: (data: any) => void
}

const ServicosFilter = ({ getRemoteServicosList }: ServicosFilterProps) => {
    const servicosService = new ServicosService()

    const { handleSubmit, control, setValue, register, watch } = useForm<ServicosSearch>({ defaultValues: {} })

    const [showFilter, setShowFilter] = useState<boolean>(false);
    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };

    return (
        <React.Fragment>
            <UiContent />
            {/* Breadcrumb */}
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <Link to="/dashboard" className="me-2">
                                <i className="bx bx-arrow-back bx-sm"></i>
                            </Link>
                            <h4 className="mb-0">Servicos</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                            <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                            <BreadcrumbItem active> Servicos </BreadcrumbItem>
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
                                            <form onSubmit={handleSubmit(getRemoteServicosList)} >
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
                                            <form className="px-0 my-0 m-2" id="form-search" name="form-search" onSubmit={handleSubmit(getRemoteServicosList)}>
                                                <Row>
                                                    {/* <Col md={5}>
                                                        <Label htmlFor="cliente_id" className="form-label">Servicos</Label>
                                                        <AsyncSelectListControlled<ServicosSearch>
                                                            callback={getListServicos}
                                                            field={"cliente_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="uf" className="form-label">UF</Label>
                                                            <SelectListControlled<ServicosSearch> 
                                                                options={optUF} 
                                                                field={"uf"} 
                                                                control={control} 
                                                            />
                                                        </div>
                                                    </Col>      
                                                    <Col md={2}>
                                                        <div className="ms-4 ">
                                                            <Label htmlFor="cidade" className="form-label">Cidade</Label>
                                                            <InputTextControlled<ServicosSearch> 
                                                                field={"cidade"} 
                                                                control={control} 
                                                            />
                                                        </div>                                     
                                                    </Col>       */}
                                                </Row>

                                             
                                                <Row className="mt-5">
                                                    <div className="d-flex flex-row justify-content-end align-items-center" >

                                                        <Col md={6}>
                                                            <div className="ms-4 ">
                                                                <InputTextControlled<ServicosSearch> field={"palavra_chave"} control={control} placeholder="Buscar..." />
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

export default ServicosFilter;     