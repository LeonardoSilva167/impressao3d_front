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
import { LicitacoesService } from "services/Licitacoes/LicitacoesService";
import { LicitacoesModel, LicitacoesSearch } from "interfaces/Licitacoes";
import { ClientesService } from "services/Clientes";
import { ClientesModel } from "interfaces/Clientes";
import { required } from "Components/ComponentController/ValidatorForm/ValidatorForm";
import { InputDateTime } from "Components/ComponentController/Inputs/Date/InputDateTime";



export interface LicitacoesFilterProps {
    getRemoteLicitacoesList: (data: any) => void
}

const LicitacoesFilter = ({ getRemoteLicitacoesList }: LicitacoesFilterProps) => {
    const licitacoesService = new LicitacoesService()
    const clientesService = new ClientesService();

    const { handleSubmit, control, setValue, register, watch } = useForm<LicitacoesSearch>({ defaultValues: {} })

    const [showFilter, setShowFilter] = useState<boolean>(false);
    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };
    const [optModalidades, setOptModalidades] = useState<SelectOptions[]>([])
    const [optStatusLicitacoes, setOptStatusLicitacoes] = useState<SelectOptions[]>([])
    const [optStatusCompras, setOptStatusCompras] = useState<SelectOptions[]>([])
    

    const getLookupsLicitacoes = async (): Promise<void> => {
        const lookups = await licitacoesService.getLookupsLicitacoes()

        if (lookups) {
            let modalidade = new Array
            lookups.modalidades.map(item => { modalidade.push({ value: item.id, label: item.nome }) })
            setOptModalidades(modalidade)

            let statusLicitacoes = new Array
            lookups.statusLicitacoes.map(item => { statusLicitacoes.push({ value: item.id, label: item.nome }) })
            setOptStatusLicitacoes(statusLicitacoes)

            let statusCompras = new Array
            lookups.statusCompras.map(item => { statusCompras.push({ value: item.id, label: item.nome }) })
            setOptStatusCompras(statusCompras)
        }
    }
    const getListLicitacoes = async (inputValue: string): Promise<SelectOptions[]> => {
        const listLicitacoes = await licitacoesService.AsyncListLicitacoes({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listLicitacoes && listLicitacoes.map((item: LicitacoesModel) => {
            opt.push({ value: item.id, label: `${item.num_compra}/${item.exercicio}` })
        });

        return opt
    }
 
    const getListClientes = async (inputValue: string): Promise<SelectOptions[]> => {
        const listClientes = await clientesService.AsyncListClientes({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listClientes && listClientes.map((item: ClientesModel) => {
            opt.push({ value: item.id, label: `${item.codigo} - ${item.nome}` })
        });

        return opt
    }
    useEffect(() => {
        getLookupsLicitacoes()
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
                            <h4 className="mb-sm-0 ms-3">Licitacoes</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                            <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                            <BreadcrumbItem active> Licitacoes </BreadcrumbItem>
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
                                            <form onSubmit={handleSubmit(getRemoteLicitacoesList)} >
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
                                            <form className="px-0 my-0 m-2" id="form-search" name="form-search" onSubmit={handleSubmit(getRemoteLicitacoesList)}>
                                                <Row>
                                                    <Col md={2}>
                                                        <Label htmlFor="licitacao_id" className="form-label">Compras</Label>
                                                        <AsyncSelectListControlled<LicitacoesSearch>
                                                            callback={getListLicitacoes}
                                                            field={"licitacao_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                    <Col md={5}>
                                                        <Label htmlFor="cliente_id" className="form-label">Clientes</Label>
                                                        <AsyncSelectListControlled<LicitacoesSearch>
                                                            callback={getListClientes}
                                                            field={"cliente_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="modalidade_id" className="form-label">Modalidade</Label>
                                                            <SelectListControlled<LicitacoesSearch>
                                                                options={optModalidades}
                                                                field={"modalidade_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="status_licitacoes_id" className="form-label">Etapa</Label>
                                                            <SelectListControlled<LicitacoesSearch>
                                                                options={optStatusLicitacoes}
                                                                field={"status_licitacoes_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="status_compra_id" className="form-label">Status</Label>
                                                            <SelectListControlled<LicitacoesSearch>
                                                                options={optStatusCompras}
                                                                field={"status_compra_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_limite_proposta_inicio" className="form-label">Data Limite Início</Label>
                                                            <InputDate<LicitacoesSearch>
                                                                field={"data_limite_proposta_inicio"}
                                                                register={register} />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_limite_proposta_final" className="form-label">Data Limite Final</Label>
                                                            <InputDate<LicitacoesSearch>
                                                                field={"data_limite_proposta_final"}
                                                                register={register} />
                                                        </div>
                                                    </Col>
                                                {/* <Col md={6}>
                                                    <Label htmlFor="cliente_id" className="form-label">Clientes</Label>
                                                    <AsyncSelectListControlled<LicitacoesSearch>
                                                        callback={getListClientes}
                                                        field={"cliente_id"}
                                                        control={control}
                                                        required={required}
                                                        className="w-100"
                                                        // defaultValue={{value: licitacoes.cliente_id, label: licitacoes.cliente_nome}}
                                                    />
                                                </Col> */}
                                                    {/* <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="uf" className="form-label">UF</Label>
                                                            <SelectListControlled<LicitacoesSearch> 
                                                                options={optUF} 
                                                                field={"uf"} 
                                                                control={control} 
                                                            />
                                                        </div>
                                                    </Col>      
                                                    <Col md={2}>
                                                        <div className="ms-4 ">
                                                            <Label htmlFor="cidade" className="form-label">Cidade</Label>
                                                            <InputTextControlled<LicitacoesSearch> 
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
                                                                <InputTextControlled<LicitacoesSearch> field={"palavra_chave"} control={control} placeholder="Buscar..." />
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

export default LicitacoesFilter;     