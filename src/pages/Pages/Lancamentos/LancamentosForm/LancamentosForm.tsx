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
import { LancamentosDefaultValues, LancamentosModel } from 'interfaces/Lancamentos';
import { LancamentosService } from 'services/LancamentosServicve/LancamentosService';
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled';
import { DespesasModel } from 'interfaces/Despesas';
import { DespesasService } from 'services/DespesasService';
import { InputDateTime } from 'Components/ComponentController/Inputs/Date/InputDateTime';
import { ReceitasModel } from 'interfaces/Receitas';
import { ReceitasService } from 'services/ReceitasService';

const LancamentosForm = () => {
    const { state } = useLocation()


    const optTipoLancamento: SelectOptions[] = [
        { value: 0, label: 'Entrada' },
        { value: 1, label: 'Saida' },
    ]

    const optEntradas: SelectOptions[] = [
        { value: 1, label: 'Pró Labore' },
        { value: 2, label: 'Distribuição de Lucros' },
        { value: 3, label: 'Dividendo Recebido' },
        { value: 4, label: 'Pix' },
        { value: 5, label: 'Pagamento Recebido' },
    ]

    const optContaBancos: SelectOptions[] = [
        { value: 1, label: 'Nubank' },
        { value: 2, label: 'Sofisa Direto' },
        { value: 3, label: 'Reserva de Emergência' },
        { value: 4, label: 'Mercado Pago' },
        { value: 5, label: '99Pay' },
        { value: 6, label: 'C6 CPF' },
        { value: 7, label: 'C6 CNPJ' },
        { value: 8, label: 'PicPay' },
        { value: 9, label: 'Binance' },
    ]



    const [lancamentos, setLancamentos] = useState<LancamentosModel>(state ? state.source : LancamentosDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<LancamentosModel>({
        defaultValues: lancamentos
    })

    const { voltarParaRotaAnterior } = useNavegacao();
    const [startFields, setStartFields] = useState<boolean>(true)
    const [display, setDisplay] = useState<boolean>(false)
    const [displayTipoLancamento, setDisplayTipoLancamento] = useState<boolean>(true)
    const [optBancos, setOptbancos] = useState<SelectOptions[]>([])

    const [disabledVencimento, setDisabledVencimento] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate()
    const lancamentosService = new LancamentosService()
    const despesasService = new DespesasService()
    const receitasService = new ReceitasService()

    // const watchDespesas = watch('despesa_id')
    const watchTipoLancamento = watch('tipo_lancamento')

    const resetCampos = async (): Promise<void> => {
        // setValue('receita_id', null);
        // setValue('destino_id', null);
    }
    const getLookupsLancamentos = async (): Promise<void> => {
        const lookups = await lancamentosService.getLookupsLancamentos()

        if (lookups) {
            let conta_bancaria = new Array
            lookups.contas_bancarias.map(item => { conta_bancaria.push({ value: item.id, label: item.apelido }) })
            setOptbancos(conta_bancaria)
        }
    }

    // const geraLancamentoDespesaOld = async (): Promise<void> => {
    //     const despesa = await despesasService.getViewDespesas({ id: watchDespesas });

    //     let valor: number;

    //     let qtd_parcela = Number(despesa.qtd_parcela);
    //     valor = Number(despesa.valor);
    //     let valor_parcela = Number(despesa.valor_parcela);
    //     // let valor_parcela = parseFloat(despesa.valor_parcela) / 100;


    //     setValue('qtd_total_parcela', qtd_parcela.toString());

    //     // valor = qtd_parcela * Number(despesa.valor_parcela);
    //     valor = qtd_parcela * valor_parcela;
    //     switch (Number(despesa.recorrencia_status_id)) {
    //         case 1:

    //             break;
    //         case 3:
    //             qtd_parcela = 12;
    //             valor = qtd_parcela * valor_parcela;
    //             setValue('qtd_total_parcela', qtd_parcela.toString());
    //             break;

    //         default:
    //             break;
    //     }
    //     const acrescimo = 0;
    //     const desconto = 0;
    //     const subtotal = valor;
    //     const total = valor + acrescimo - desconto;

    //     setValue('qtd_total_parcela', qtd_parcela.toString());
    //     setValue('valor_parcela', valor_parcela.toString());
    //     setValue('valor', valor.toString());
    //     setValue('acrescimo', acrescimo.toString());
    //     setValue('desconto', desconto.toString());
    //     setValue('subtotal', subtotal.toString());
    //     setValue('total', total.toString());

    //     setLancamentos((prev) => ({
    //         ...prev,
    //         qtd_total_parcela: qtd_parcela.toString(),
    //         valor_parcela: despesa.valor_parcela,
    //         valor: valor.toString(),
    //         acrescimo: acrescimo.toString(),
    //         desconto: desconto.toString(),
    //         subtotal: subtotal.toString(),
    //         total: total.toString(),
    //     }));

    // };

    const getListEntradas = async (inputValue: string): Promise<SelectOptions[]> => {
        return optEntradas
    }

    const getListContaBancos = async (inputValue: string): Promise<SelectOptions[]> => {
        return optContaBancos
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

    const getListReceitas = async (inputValue: string): Promise<SelectOptions[]> => {

        const listDespesas = await receitasService.AsyncListReceitas({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listDespesas && listDespesas.map((item: ReceitasModel) => {
            opt.push({ value: item.id, label: item.descricao })
        });

        return opt
    }

    const onSubmit: SubmitHandler<LancamentosModel> = async (data: any) => {
        try {
            // console.log(data)
            data.valor = ajustaMoedaBanco(data.valor);

            if (lancamentos.lancamento_id) {
                await lancamentosService.editLancamentos(data);
            } else {
                const id = await lancamentosService.createLancamentos(data);
                setValue('id', id);
            }

            navigate(`/lancamentos`);
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
    //     setDisplayTipoLancamento(false)

    //     // resetCampos();

    //     if (watchTipoLancamento == '1') {
    //         setDisplayTipoLancamento(true)
    //     }
    // }, [watchTipoLancamento])

    useEffect(() => {
        setDisplayTipoLancamento(watchTipoLancamento === '1');
    }, [watchTipoLancamento]);

    useEffect(() => {
        getLookupsLancamentos()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        if (startFields && !lancamentos.lancamento_id) {

            setStartFields(false)
        }

        setActiveMenu('/lancamentos')
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
                                    <h4 className="mb-sm-0 ms-3">Adicionar Lancamentos</h4>
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

                                            <Row>

                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="tipo_lancamento" className="form-label">Tipo</Label>
                                                        <SelectListControlled<LancamentosModel>
                                                            options={optTipoLancamento}
                                                            required={required}
                                                            field={"tipo_lancamento"}
                                                            control={control}
                                                            defaultValue={{ value: 1, label: lancamentos.nome_despesa }}
                                                        />
                                                    </div>
                                                </Col>


                                                <Col md={4}>
                                                   
                                                    <div className="mb-3">
                                                        <div style={{ display: watchTipoLancamento ? 'block' : 'none' }}>
                                                            <Label htmlFor="despesa_id" className="form-label">Despesa</Label>
                                                            <AsyncSelectListControlled<LancamentosModel>
                                                                callback={getListDespesas}
                                                                field={"despesa_id"}
                                                                control={control}
                                                                className="w-100"
                                                                defaultValue={{ value: lancamentos.despesa_id, label: lancamentos.nome_despesa }}
                                                            />
                                                        </div>
                                                        <div style={{ display: !watchTipoLancamento ? 'block' : 'none' }}>
                                                            <Label htmlFor="receita_id" className="form-label">Receitas</Label>
                                                            <AsyncSelectListControlled<LancamentosModel>
                                                                callback={getListReceitas}
                                                                field={"receita_id"}
                                                                control={control}
                                                                className="w-100"
                                                                defaultValue={{ value: lancamentos.receita_id, label: lancamentos.nome_receita }}
                                                            />
                                                        </div>
                                                    </div>

                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="dthr_lancamento" className="form-label">Data</Label>
                                                        <InputDateTime<LancamentosModel>
                                                            field={"dthr_lancamento"}
                                                            required={required}
                                                            register={register} />
                                                    </div>
                                                </Col>

                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="valor" className="form-label">Valor</Label>
                                                        <InputTextControlled<LancamentosModel>
                                                            field={"valor"}
                                                            control={control}
                                                            required={required}
                                                            placeholder="Valor"
                                                            mask={'real'}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="contas_bancaria_origem_id" className="form-label">Origem</Label>
                                                        <SelectListControlled<LancamentosModel>
                                                            options={optBancos}
                                                            field={"contas_bancaria_origem_id"}
                                                            control={control}

                                                        />
                                                    </div>
                                                </Col>

                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="contas_bancaria_destino_id" className="form-label">Destino</Label>
                                                        <SelectListControlled<LancamentosModel>
                                                            options={optBancos}
                                                            field={"contas_bancaria_destino_id"}
                                                            control={control}

                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                        <InputTextControlled<LancamentosModel>
                                                            placeholder="Descrição"
                                                            field={"descricao"}
                                                            control={control}
                                                            required={required}
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

export default LancamentosForm;
