import UiContent from "Components/Common/UiContent";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Breadcrumb, BreadcrumbItem, Button, ButtonGroup, Card, CardBody, CardHeader, Col, Collapse, DropdownItem, DropdownMenu, DropdownToggle, Form, Input, Label, Modal, ModalBody, ModalHeader, Row, UncontrolledDropdown } from "reactstrap";
import { InputTextControlled } from "Components/ComponentController/Inputs/Text/InputTextControlled";
import { InputDate } from "Components/ComponentController/Inputs/Date/InputDate";
import { SelectListControlled } from "Components/ComponentController/Selects/Select/SelectListControlled";
import { SelectOptions } from "interfaces/SystemInterfaces/SelectInterface";
import { AsyncSelectListControlled } from "Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled";
import { ClientesService } from "services/Clientes";
import { ClientesModel } from "interfaces/Clientes";
import { required } from "Components/ComponentController/ValidatorForm/ValidatorForm";
import { InputDateTime } from "Components/ComponentController/Inputs/Date/InputDateTime";
import { LicitacoesService } from "services/Licitacoes";
import { LicitacoesItensModel, LicitacoesItensSearch } from "interfaces/Licitacoes";



export interface LicitacoesItensFilterProps {
    getRemoteLicitacoesItensList: (data: any) => void
}

const LicitacoesItensFilter = ({ getRemoteLicitacoesItensList }: LicitacoesItensFilterProps) => {
    const licitacoesService = new LicitacoesService()
    const clientesService = new ClientesService();

    const { handleSubmit, control, setValue, register, watch } = useForm<LicitacoesItensSearch>({ defaultValues: {} })

    const { idLicitacao } = useParams();


    const {state} = useLocation();

    const [showFilter, setShowFilter] = useState<boolean>(false);
    const handleShowFilter = () => {
        setShowFilter(!showFilter);
    };
    const [optModalidades, setOptModalidades] = useState<SelectOptions[]>([])
    const [optStatusLicitacoesItens, setOptStatusLicitacoesItens] = useState<SelectOptions[]>([])
    const [optStatusCompras, setOptStatusCompras] = useState<SelectOptions[]>([])
    

    const getLookupsLicitacoesItens = async (): Promise<void> => {
        // const lookups = await licitacoesService.getLookupsLicitacoesItens()

        // if (lookups) {
            // let modalidade = new Array
            // lookups.modalidades.map(item => { modalidade.push({ value: item.id, label: item.nome }) })
            // setOptModalidades(modalidade)

            // let statusLicitacoesItens = new Array
            // lookups.statusLicitacoesItens.map(item => { statusLicitacoesItens.push({ value: item.id, label: item.nome }) })
            // setOptStatusLicitacoesItens(statusLicitacoesItens)

            // let statusCompras = new Array
            // lookups.statusCompras.map(item => { statusCompras.push({ value: item.id, label: item.nome }) })
            // setOptStatusCompras(statusCompras)
        // }
    }
    const getListLicitacoesItens = async (inputValue: string): Promise<SelectOptions[]> => {
        const listLicitacoesItens = await licitacoesService.AsyncListLicitacoesItens({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listLicitacoesItens && listLicitacoesItens.map((item: LicitacoesItensModel) => {
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
        getLookupsLicitacoesItens()
    }, [])
    useEffect(() => {
        setValue('licitacao_id', idLicitacao);
    }, [idLicitacao])

    return (
        <React.Fragment>
            <UiContent />
            {/* Breadcrumb */}
            <Row>
                <Col xs={12}>
                    <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                        <div className='d-sm-flex align-items-center justify-content-between'>
                            <Link to="/licitacoes"> <i className="bx bx-arrow-back bx-sm"></i> </Link>
                            <h4 className="mb-sm-0 ms-3">{`Licitacoes / Itens `}</h4>
                        </div>
                        <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                            <BreadcrumbItem> <Link to="/licitacoes"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                            <BreadcrumbItem active> Licitacoes / Itens </BreadcrumbItem>
                        </Breadcrumb>
                    </div>
                </Col>
            </Row>
            {/* Filter */}
            <Row>
                <Card >
                    <CardBody>
                        <Col xs={12}>
                            <div className="d-flex flex-row justify-content-start align-items-center mb-4" >
                                <div className="mt-3 mt-lg-0">
                                    <div className="col-auto">
                                        <h4 className="text-left mb-sm-0 ms-3">{`${state.source.modalidade_nome} ${state.source.num_compra}/${state.source.exercicio} ${state.source.cliente_codigo} - ${state.source.cliente_nome}  - ${state.source.cliente_cidade}/${state.source.cliente_uf}`}</h4>
                                        <hr />
                                        <h6 className="text-left mb-sm-0 ms-3 mt-1">{`Data Limíte: ${state.source.data_limite_proposta_format} - ${state.source.status_licitacao} `}</h6>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </CardBody>
                </Card>
                <Col xs={12}>
                    <div className="d-flex flex-row justify-content-end align-items-center mb-4" >
                        <div className="mt-3 mt-lg-0">
                            <div className="col-auto">
                                <Link to={`/licitacoes/itens/${idLicitacao}/add`} state={{ source: state.source }} type="button" className="btn btn-primary"><i className="ri-add-circle-line align-middle me-1"></i> Add</Link>
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
                                            <form onSubmit={handleSubmit(getRemoteLicitacoesItensList)} >
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
                                            <form className="px-0 my-0 m-2" id="form-search" name="form-search" onSubmit={handleSubmit(getRemoteLicitacoesItensList)}>
                                                <Row>
                                                    {/* <Col md={2}>
                                                        <Label htmlFor="licitacao_id" className="form-label">Compras</Label>
                                                        <AsyncSelectListControlled<LicitacoesItensSearch>
                                                            callback={getListLicitacoesItens}
                                                            field={"licitacao_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                    <Col md={5}>
                                                        <Label htmlFor="cliente_id" className="form-label">Clientes</Label>
                                                        <AsyncSelectListControlled<LicitacoesItensSearch>
                                                            callback={getListClientes}
                                                            field={"cliente_id"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="modalidade_id" className="form-label">Modalidade</Label>
                                                            <SelectListControlled<LicitacoesItensSearch>
                                                                options={optModalidades}
                                                                field={"modalidade_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="status_licitacoesItens_id" className="form-label">Etapa</Label>
                                                            <SelectListControlled<LicitacoesItensSearch>
                                                                options={optStatusLicitacoesItens}
                                                                field={"status_licitacoesItens_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="status_compra_id" className="form-label">Status</Label>
                                                            <SelectListControlled<LicitacoesItensSearch>
                                                                options={optStatusCompras}
                                                                field={"status_compra_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_limite_proposta_inicio" className="form-label">Data Limite Início</Label>
                                                            <InputDate<LicitacoesItensSearch>
                                                                field={"data_limite_proposta_inicio"}
                                                                register={register} />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_limite_proposta_final" className="form-label">Data Limite Final</Label>
                                                            <InputDate<LicitacoesItensSearch>
                                                                field={"data_limite_proposta_final"}
                                                                register={register} />
                                                        </div>
                                                    </Col> */}
                                                {/* <Col md={6}>
                                                    <Label htmlFor="cliente_id" className="form-label">Clientes</Label>
                                                    <AsyncSelectListControlled<LicitacoesItensSearch>
                                                        callback={getListClientes}
                                                        field={"cliente_id"}
                                                        control={control}
                                                        required={required}
                                                        className="w-100"
                                                        // defaultValue={{value: licitacoesItens.cliente_id, label: licitacoesItens.cliente_nome}}
                                                    />
                                                </Col> */}
                                                    {/* <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="uf" className="form-label">UF</Label>
                                                            <SelectListControlled<LicitacoesItensSearch> 
                                                                options={optUF} 
                                                                field={"uf"} 
                                                                control={control} 
                                                            />
                                                        </div>
                                                    </Col>      
                                                    <Col md={2}>
                                                        <div className="ms-4 ">
                                                            <Label htmlFor="cidade" className="form-label">Cidade</Label>
                                                            <InputTextControlled<LicitacoesItensSearch> 
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
                                                                <InputTextControlled<LicitacoesItensSearch> field={"palavra_chave"} control={control} placeholder="Buscar..." />
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

export default LicitacoesItensFilter;     