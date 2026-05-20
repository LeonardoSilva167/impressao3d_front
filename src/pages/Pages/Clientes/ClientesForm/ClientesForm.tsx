import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ajustaMoedaBanco, AnosSelect, diasMesSelect, mesesSelect, numberFormat, UFEstadosSelect, useNavegacao, validarDiaMes } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { ClientesDefaultValues, ClientesModel } from 'interfaces/Clientes/ClientesInterface';
import { ClientesService } from 'services/Clientes/ClientesService';

const ClientesForm = () => {
    const { state } = useLocation()

    const [clientes, setClientes] = useState<ClientesModel>(state ? state.source : ClientesDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<ClientesModel>({
        defaultValues: clientes
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao();
    const location = useLocation();
    const navigate = useNavigate()
    const clientesService = new ClientesService();

    const [optUF, setOptUF] = useState<SelectOptions[]>(UFEstadosSelect())

    const getLookupsClientes = async (): Promise<void> => {
        // const lookups = await clientesService.getLookupsClientes()

        // if (lookups) {
        //     let banco = new Array
        //     lookups.bancos.map(item => { banco.push({ value: item.id, label: `${item.codigo} - ${item.nome}` }) })
        //     setOptbancos(banco)
        // }
    }

    const onSubmit: SubmitHandler<ClientesModel> = async (data: any) => {
        try {
            if (clientes.cliente_id) {
                await clientesService.editClientes(data);
            } else {
                const id = await clientesService.createClientes(data);
                setValue('id', id);
            }

            navigate(`/clientes`);
        } catch (error: any) {
            throw error;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])



    // useEffect(() => {
    //     setDisplayTipoContasBancaria(false)

    //     // resetCampos();

    //     if (watchTipoContasBancaria == '1') {
    //         setDisplayTipoContasBancaria(true)
    //     }
    // }, [watchTipoContasBancaria])


    useEffect(() => {
        getLookupsClientes()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/clientes')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <Link to="/contas-a-pagar"> <i className="bx bx-arrow-back bx-sm"></i> </Link>
                                    <h4 className="mb-sm-0 ms-3">Adicionar Clientes</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Contas Bancarias" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/contas-a-pagar"> Contas Bancarias </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Contas Bancarias </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xxl={12}>
                            <Card >
                                <CardBody>
                                    <div className="">
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="codigo" className="form-label">Código</Label>
                                                        <InputTextControlled<ClientesModel>
                                                            field={"codigo"}
                                                            control={control}
                                                            placeholder="0000000"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={5}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="nome" className="form-label">Nome</Label>
                                                        <InputTextControlled<ClientesModel>
                                                            field={"nome"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="uf" className="form-label">UF</Label>
                                                        <SelectListControlled<ClientesModel>
                                                            options={optUF}
                                                            required={required}
                                                            field={"uf"}
                                                            control={control}
                                                        // defaultValue={{ value: 1, label: lancamentos.nome_despesa }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="cidade" className="form-label">Cidade</Label>
                                                        <InputTextControlled<ClientesModel>
                                                            field={"cidade"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                                {/* 
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="conta_pj" className="form-label">Tipo Conta</Label>
                                                        
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="saldo" className="form-label">Saldo Inicial </Label>
                                                        <InputTextControlled<ContasBancariasModel>
                                                            field={"saldo"}
                                                            control={control}
                                                            placeholder="0,00"
                                                            mask={'real'}
                                                        />
                                                    </div>
                                                </Col> */}
                                            </Row>
                                            <hr />
                                            <Row className='mt-5'>
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button type="submit" className="btn btn-primary">Salvar</button>
                                                        <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>Voltar</button>
                                                    </div>
                                                </Col>
                                            </Row>
                                        </form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default ClientesForm;
