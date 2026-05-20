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
import { LancamentosService } from "services/LancamentosServicve/LancamentosService";
import { LancamentosSearch } from "interfaces/Lancamentos";
import { DespesasService } from "services/DespesasService";
import { ReceitasService } from "services/ReceitasService";
import { DespesasModel } from "interfaces/Despesas";
import { ReceitasModel } from "interfaces/Receitas";


export interface LancamentosFilterProps {
    getRemoteLancamentosList: (data: any) => void
}

const LancamentosFilter = ({ getRemoteLancamentosList }: LancamentosFilterProps) => {
    const lancamentosService = new LancamentosService()
    const despesasService = new DespesasService()
    const receitasService = new ReceitasService()

    const [optBancos, setOptbancos] = useState<SelectOptions[]>([])

    const { handleSubmit, control, setValue, register, watch } = useForm<LancamentosSearch>({ defaultValues: {} })

    const [showFilter, setShowFilter] = useState<boolean>(false);
    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };
    
    const getLookupsLancamentos = async (): Promise<void> => {
        const lookups = await lancamentosService.getLookupsLancamentos()

        if (lookups) {
            let conta_bancaria = new Array
            lookups.contas_bancarias.map(item => { conta_bancaria.push({ value: item.id, label: item.apelido }) })
            setOptbancos(conta_bancaria)
        }
    }

    const optTipoLancamento: SelectOptions[] = [
        { value: '0', label: 'Entrada' },
        { value: '1', label: 'Saida' },
    ]
    const getListDespesas = async (inputValue: string): Promise<SelectOptions[]> => {
        const listDespesas = await despesasService.AsyncListDespesas({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listDespesas && listDespesas.map((item: DespesasModel) => {
            opt.push({ value: item.id, label: item.nome })
        });

        return opt
    }

    const getListReceitas = async (inputValue: string): Promise<SelectOptions[]> => {

        const listDespesas = await receitasService.AsyncListReceitas({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listDespesas && listDespesas.map((item: ReceitasModel) => {
            opt.push({ value: item.id, label: item.descricao })
        });

        return opt
    }
    
    useEffect(() => {
        getLookupsLancamentos()
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
                            <h4 className="mb-sm-0 ms-3">Lançamentos</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                            <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                            <BreadcrumbItem active> Lançamentos </BreadcrumbItem>
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
                                            <form onSubmit={handleSubmit(getRemoteLancamentosList)} >
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
                                            <form className="px-0 my-0 m-2" id="form-search" name="form-search" onSubmit={handleSubmit(getRemoteLancamentosList)}>
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="tipo_lancamento" className="form-label">Tipo Lançamento</Label>
                                                            <SelectListControlled<LancamentosSearch>
                                                                options={optTipoLancamento}
                                                                field={"tipo_lancamento"}
                                                                control={control}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <Label htmlFor="despesa_id" className="form-label">Despesa</Label>
                                                        <AsyncSelectListControlled<LancamentosSearch>
                                                            callback={getListDespesas}
                                                            field={"despesa_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                    <Col md={4}>

                                                        <Label htmlFor="receita_id" className="form-label">Receitas</Label>
                                                        <AsyncSelectListControlled<LancamentosSearch>
                                                            callback={getListReceitas}
                                                            field={"receita_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                </Row>

                                                <Row>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="dthr_lancamento" className="form-label">Data</Label>
                                                            <InputDate<LancamentosSearch>
                                                                field={"dthr_lancamento"}
                                                                register={register}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="contas_bancaria_origem_id" className="form-label">Origem</Label>
                                                            <SelectListControlled<LancamentosSearch>
                                                                options={optBancos}
                                                                field={"contas_bancaria_origem_id"}
                                                                control={control}
                                                            />
                                                        </div>
                                                    </Col>

                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="contas_bancaria_destino_id" className="form-label">Destino</Label>
                                                            <SelectListControlled<LancamentosSearch>
                                                                options={optBancos}
                                                                field={"contas_bancaria_destino_id"}
                                                                control={control}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row className="mt-5">
                                                    <div className="d-flex flex-row justify-content-end align-items-center" >

                                                        <Col md={6}>
                                                            <div className="ms-4 ">
                                                                <InputTextControlled<LancamentosSearch> field={"palavra_chave"} control={control} placeholder="Buscar..." />
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

export default LancamentosFilter;     