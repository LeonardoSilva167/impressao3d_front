import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { diasMesSelect, mesesSelect, useNavegacao, validarDiaMes } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { InputDate } from 'Components/ComponentController/Inputs/Date/InputDate';
import { InputCheckbox } from 'Components/ComponentController/Inputs/Checkbox/InputCheckbox';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import ButtonToTop from 'Components/ComponentController/Buttons/ButtonToTop/ButtonToTop';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { ContasPagarDefaultValues, ContasPagarModel } from 'interfaces/ContasPagar';
import { ContasPagarService } from 'services/ContasPagarService';

const ContasPagarForm = () => {
    const { state } = useLocation()
    const [contasPagar, setContasPagar] = useState<ContasPagarModel>(state ? state.source : ContasPagarDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<ContasPagarModel>({
        defaultValues: contasPagar
    })
    const { voltarParaRotaAnterior } = useNavegacao();
    const [display, setDisplay] = useState<boolean>(false)
    const [displayVencimento, setDisplayVencimento] = useState<number>(0)
    const [disabledParcela, setDisabledParcela] = useState<boolean>(false)
    const [disabledVencimento, setDisabledVencimento] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate()
    const parentRoute = location.pathname.split('/').slice(1, -1).join('/');
    const contasPagarService = new ContasPagarService()
    const [optRecorrencia, setOptRecorrencia] = useState<SelectOptions[]>([])
    const [optDiaVencimento, setOptDiaVencimento] = useState<SelectOptions[]>(diasMesSelect())
    const [optMesesVencimento, setOptMesesVencimento] = useState<SelectOptions[]>(mesesSelect())

    const watchRecorrencia = watch('recorrencia_status_id')
    const getLookupsContasPagar = async (): Promise<void> => {
        const lookups = await contasPagarService.getLookupsContasPagar()

        if (lookups) {

            let recorrencia = new Array
            lookups.recorrencias.map(item => { recorrencia.push({ value: item.id, label: item.descricao }) })
            setOptRecorrencia(recorrencia)
        }
    }


    const onSubmit: SubmitHandler<ContasPagarModel> = async (data: any) => {
        try {
            const numericValue = data.valor.replace(/[^0-9]/g, '');
            const valor = parseFloat(numericValue) / 100;
            data.valor = valor;
            let validado = true

            if (data.recorrencia_status_id == 4) {
                const anoAtual = new Date().getFullYear();
                const diaValido = validarDiaMes(data.dia_vencimento, data.mes_vencimento, anoAtual);

                if (!diaValido) {
                    console.log('deu erro')
                    setError('dia_vencimento', { type: "remote", message: "A data informada é inválida. Por favor, verifique o dia e o mês." })
                    setError('mes_vencimento', { type: "remote", message: "A data informada é inválida. Por favor, verifique o dia e o mês." })
                    validado = false;
                    return;
                }
            }

            if (validado) {

                if (contasPagar.id) {
                    await contasPagarService.editContasPagar(data);
                } else {
                    const id = await contasPagarService.createContasPagar(data);
                    setValue('id', id);
                }

                navigate(`/contas-a-pagar`);
            }
        } catch (error: any) {
            throw error;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])



    useEffect(() => {

        setDisabledParcela(false)
        setValue('qtd_parcela', '');
        switch (Number(watchRecorrencia)) {
            case 1:
                setDisplayVencimento(2)
                break;
            case 2:
                setDisabledParcela(true)
                setDisplayVencimento(1)
                break;
            case 3:
                setDisplayVencimento(1)
                break;
            case 4:
                setDisplayVencimento(3)
                break;
            case 5:
                setDisplayVencimento(0)
                break;
            default:
                setDisplayVencimento(0)
                setDisabledParcela(false)
                break;
        }
    }, [watchRecorrencia])

    useEffect(() => {
        getLookupsContasPagar()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/contas-a-pagar')
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
                                    <h4 className="mb-sm-0 ms-3">Adicionar ContasPagar</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Contas a Pagar" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/contas-a-pagar"> Contas a Pagar </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Contas a Pagar </BreadcrumbItem>
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
                                                        <InputCheckbox<ContasPagarModel> field='ativo' register={register} role="switch" />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={8}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="nome" className="form-label">Nome</Label>
                                                        <InputTextControlled<ContasPagarModel> field={"nome"} control={control} required={required} placeholder="Nome" />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="valor" className="form-label">Valor</Label>
                                                        <InputTextControlled<ContasPagarModel> field={"valor"} control={control} required={required} placeholder="Valor" mask={'real'} />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="recorrencia_status_id" className="form-label">Recorrência</Label>
                                                        <SelectListControlled<ContasPagarModel> options={optRecorrencia} required={required} field={"recorrencia_status_id"}
                                                            control={control} disabled={disabledVencimento} />
                                                    </div>
                                                </Col>
                                                {displayVencimento == 1 ? (
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="dia_vencimento" className="form-label">Dia Vencimento</Label>
                                                            <SelectListControlled<ContasPagarModel> options={optDiaVencimento} required={required} field={"dia_vencimento"} control={control} disabled={disabledVencimento} defaultValue={{ value: 1, label: 1 }} />
                                                        </div>
                                                    </Col>
                                                ) : displayVencimento == 3 ? (
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_vencimento_dia_mes" className="form-label">
                                                                Dia/Mês Vencimento
                                                            </Label>
                                                            <div className="row g-2">
                                                                <div className="col-5">
                                                                    <SelectListControlled<ContasPagarModel>
                                                                        options={optDiaVencimento}
                                                                        required={required}
                                                                        field={"dia_vencimento"}
                                                                        control={control}
                                                                        disabled={disabledVencimento}
                                                                        defaultValue={{ value: '1', label: '1' }}
                                                                        errors={errors.dia_vencimento}
                                                                    />
                                                                </div>
                                                                <div className="col-7">
                                                                    <SelectListControlled<ContasPagarModel>
                                                                        options={optMesesVencimento}
                                                                        required={required}
                                                                        field={"mes_vencimento"}
                                                                        control={control}
                                                                        errors={errors.mes_vencimento}
                                                                        disabled={disabledVencimento}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </Col>


                                                ) : (displayVencimento == 2 || displayVencimento == 4) ? (
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_vencimento" className="form-label">Vencimento</Label>
                                                            <InputDate<ContasPagarModel> field={"data_vencimento"} required={required} register={register} />
                                                        </div>
                                                    </Col>
                                                ) : ''}
                                                {disabledParcela && (
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="qtd_parcela" className="form-label">Qtd. Parcela</Label>
                                                            <InputTextControlled<ContasPagarModel> field={"qtd_parcela"} control={control} placeholder="Qtd. Parcela" mask={'numero'} />
                                                        </div>
                                                    </Col>
                                                )}
                                            </Row>

                                            <br />
                                            <Row>
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

export default ContasPagarForm;
