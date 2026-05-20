import UiContent from "Components/Common/UiContent";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Card, CardHeader, Col, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from "reactstrap";
import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled";
import { InputDate } from "Components/ComponentController/Inputs/Date/InputDate";
import { SelectListControlled } from "Components/ComponentController/Selects/Select/SelectListControlled";
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface";
import { AsyncSelectListControlled } from "Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled";
import { DespesasSearch } from "interfaces/Despesas/DespesasInterface";
import { UFEstadosSelect } from "helpers/functions_helpers";
import { VendasService } from "services/Vendas/VendasService";
import { VendasModel, VendasSearch } from "interfaces/Vendas/VendasInterface";
// import { AsyncSelectListControlled } from "Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled";
// import { AsyncSelectListControlled } from "Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled";
// import { InputCheckbox } from "Components/ComponentController/Inputs/Checkbox/InputCheckbox";
// import { InputRadio } from "Components/ComponentController/Inputs/Radio/InputRadio";
// import CustomModal from "Components/ComponentController/Modal/CustomModal";
// import { DespesasService } from "services/DespesasService";
// import { ReceitasService } from "services/ReceitasService";
// import { DespesasModel } from "interfaces/Despesas";
// import { ReceitasModel } from "interfaces/Receitas";
// import { ContasBancariasService } from "services/ContasBancatiasService";
// import { ContasBancariasSearch } from "interfaces/ContasBancarias";
// import { VendasService } from "services/Vendas/VendasService";


export interface VendasFilterProps {
    getRemoteVendasList: (data: any) => void
}

const VendasFilter = ({ getRemoteVendasList }: VendasFilterProps) => {
    const vendasService = new VendasService()

    const { handleSubmit, control, setValue, register, watch } = useForm<VendasSearch>({ defaultValues: {} })

    const [showFilter, setShowFilter] = useState<boolean>(false);
    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };
    const [optUF, setOptUF] = useState<SelectOptions[]>(UFEstadosSelect())
    
    const getLookupsVendas = async (): Promise<void> => {
        // const lookups = await VendasService.getLookupsVendas()

        // if (lookups) {
        //     let conta_bancaria = new Array
        //     lookups.contas_bancarias.map(item => { conta_bancaria.push({ value: item.id, label: item.apelido }) })
        //     setOptbancos(conta_bancaria)
        // }
    }
    const getListVendas = async (inputValue: string): Promise<SelectOptions[]> => {
        const listVendas = await vendasService.AsyncListVendas({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listVendas && listVendas.map((item: VendasModel) => {
            opt.push({ value: item.id, label: `${item.codigo} - ${item.nome}` })
        });

        return opt
    }

    useEffect(() => {
        getLookupsVendas()
    }, [])

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
                            <h4 className="mb-0">Vendas</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                            <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                            <BreadcrumbItem active> Vendas </BreadcrumbItem>
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
                                            <form onSubmit={handleSubmit(getRemoteVendasList)} >
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
                                            <form className="px-0 my-0 m-2" id="form-search" name="form-search" onSubmit={handleSubmit(getRemoteVendasList)}>
                                                <Row>
                                                    <Col md={5}>
                                                        <Label htmlFor="cliente_id" className="form-label">Vendas</Label>
                                                        <AsyncSelectListControlled<VendasSearch>
                                                            callback={getListVendas}
                                                            field={"cliente_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="uf" className="form-label">UF</Label>
                                                            <SelectListControlled<VendasSearch> 
                                                                options={optUF} 
                                                                field={"uf"} 
                                                                control={control} 
                                                            />
                                                        </div>
                                                    </Col>      
                                                    <Col md={2}>
                                                        <div className="ms-4 ">
                                                            <Label htmlFor="cidade" className="form-label">Cidade</Label>
                                                            <InputTextControlled<VendasSearch> 
                                                                field={"cidade"} 
                                                                control={control} 
                                                            />
                                                        </div>                                     
                                                    </Col>      
                                                </Row>

                                             
                                                <Row className="mt-5">
                                                    <div className="d-flex flex-row justify-content-end align-items-center" >

                                                        <Col md={6}>
                                                            <div className="ms-4 ">
                                                                <InputTextControlled<VendasSearch> field={"palavra_chave"} control={control} placeholder="Buscar..." />
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

export default VendasFilter;     