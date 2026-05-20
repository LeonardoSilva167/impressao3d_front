import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ajustaMoedaBanco, AnosSelect, diasMesSelect, mesesSelect, numberFormat, useNavegacao, validarDiaMes } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { ContasBancariasDefaultValues, ContasBancariasModel } from 'interfaces/ContasBancarias';
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled';
import { DespesasModel } from 'interfaces/Despesas';
import { DespesasService } from 'services/DespesasService';
import { InputDateTime } from 'Components/ComponentController/Inputs/Date/InputDateTime';
import { ReceitasModel } from 'interfaces/Receitas';
import { ReceitasService } from 'services/ReceitasService';
import { ContasBancariasService } from 'services/ContasBancatiasService';
import { InputCheckbox } from 'Components/ComponentController/Inputs/Checkbox/InputCheckbox';

const ContasBancariasForm = () => {
    const { state } = useLocation()

    const [contasBancarias, setContasBancarias] = useState<ContasBancariasModel>(state ? state.source : ContasBancariasDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<ContasBancariasModel>({
        defaultValues: contasBancarias
    })

    const { voltarParaRotaAnterior } = useNavegacao();
    const [startFields, setStartFields] = useState<boolean>(true)
    const [display, setDisplay] = useState<boolean>(false)
    const [displayTipoContasBancaria, setDisplayTipoContasBancaria] = useState<boolean>(true)
    const [optBancos, setOptbancos] = useState<SelectOptions[]>([])

    const [disabledVencimento, setDisabledVencimento] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate()
    const contasBancariasService = new ContasBancariasService();
    const despesasService = new DespesasService()
    const receitasService = new ReceitasService()

    // const watchDespesas = watch('despesa_id')
    // const watchTipoContasBancaria = watch('tipo_ContasBancaria')

    const optTipoConta: SelectOptions[] = [
        { value: '0', label: 'PF' },
        { value: '1', label: 'PJ' },
    ]

    const getLookupsContasBancarias = async (): Promise<void> => {
        const lookups = await contasBancariasService.getLookupsContasBancarias()

        if (lookups) {
            let banco = new Array
            lookups.bancos.map(item => { banco.push({ value: item.id, label: `${item.codigo} - ${item.nome}` }) })
            setOptbancos(banco)
        }
    }

    const getListDespesas = async (inputValue: string): Promise<SelectOptions[]> => {
        const listDespesas = await despesasService.AsyncListDespesas({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listDespesas && listDespesas.map((item: DespesasModel) => {
            opt.push({ value: item.id, label: item.nome })
        });

        return opt
    }


    const onSubmit: SubmitHandler<ContasBancariasModel> = async (data: any) => {
        try {
            // console.log(data)
            data.saldo = ajustaMoedaBanco(data.saldo);

            if (contasBancarias.contas_bancaria_id) {
                await contasBancariasService.editContasBancarias(data);
            } else {
                const id = await contasBancariasService.createContasBancarias(data);
                setValue('id', id);
            }

            navigate(`/contas-bancarias`);
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
        getLookupsContasBancarias()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/ContasBancarias')
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
                                    <h4 className="mb-sm-0 ms-3">Adicionar Contas Bancarias</h4>
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
                                            <Row >
                                                <Col md={12} className='d-flex flex-row justify-content-end align-items-center'>
                                                    <div className="form-check form-switch form-switch-md mb-3 form-check-right mb-2">
                                                        <Label className="me-3" htmlFor="ativo">Ativo</Label>
                                                        <InputCheckbox<ContasBancariasModel> field='ativo' register={register} role="switch" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>

                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="tipo_ContasBancaria" className="form-label">Banco</Label>
                                                        <SelectListControlled<ContasBancariasModel>
                                                            options={optBancos}
                                                            required={required}
                                                            field={"banco_id"}
                                                            control={control}
                                                        // defaultValue={{ value: 1, label: contasBancarias.nome_despesa }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="descricao" className="form-label">Apelido</Label>
                                                        <InputTextControlled<ContasBancariasModel>
                                                            placeholder="Apelido"
                                                            field={"apelido"}
                                                            control={control}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="conta_pj" className="form-label">Tipo Conta</Label>
                                                        <SelectListControlled<ContasBancariasModel>
                                                            options={optTipoConta}
                                                            required={required}
                                                            field={"conta_pj"}
                                                            control={control}
                                                        // defaultValue={{ value: 1, label: lancamentos.nome_despesa }}
                                                        />
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
                                                </Col>
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

export default ContasBancariasForm;
