import React, { useEffect, useState } from 'react';
import { Link,  } from 'react-router-dom';
import { ajustaMoedaBanco, useNavegacao } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { MovimentoCaixaDefaultValues, MovimentoCaixaModel } from 'interfaces/MovimentoCaixa/MovimentoCaixaInterface';
import { MovimentoCaixaService } from 'services/MovimentoCaixa/MovimentoCaixaService';
import { TipoOrigemPagamentosService } from 'services/TipoOrigemPagamentosServices';
import { InputTextArea } from 'Components/ComponentController/Inputs/Text/InputTextArea';

const MovimentoCaixaForm = () => {
    const { state } = useLocation()

    const [movimentoCaixa, setMovimentoCaixa] = useState<MovimentoCaixaModel>(state ? state.source : MovimentoCaixaDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<MovimentoCaixaModel>({
        defaultValues: movimentoCaixa
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao();
    const location = useLocation();
    const navigate = useNavigate()
    const movimentoCaixaService = new MovimentoCaixaService();
    const tipoOrigemPagamentosService = new TipoOrigemPagamentosService();

    // const [optTipoMovimentaocao, setOptTipoMovimentaocao] = useState<SelectOptions[]>([
    //     { value: 1, label: 'Despesa' },
    //     { value: 2, label: 'Sangria' },
    //     { value: 3, label: 'Suprimento' },
    // ]);
    const [optFormaPgto, setOptFormaPgto] = useState<SelectOptions[]>([])
    const [optTipoMovimentaocao, setOptTipoMovimentaocao] = useState<SelectOptions[]>([])


    const getLookupsMovimentoCaixa = async (): Promise<void> => {
        const lookups = await movimentoCaixaService.getLookupsMovimentoCaixa()
        if (lookups) {
            let formaPagamento = new Array
            lookups.formaPagamentos.map(item => { formaPagamento.push({ value: item.id, label: item.descricao }) })
            setOptFormaPgto(formaPagamento)
        }
    }

    const getTipoOrigemPgtos = async (): Promise<SelectOptions[]> => {
        const listTipoOrigem = await tipoOrigemPagamentosService.AsyncListTipoOrigemPagamentos({
          tipo_operacao: [3,4,5]
        })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listTipoOrigem && listTipoOrigem.map((item: MovimentoCaixaModel) => {
            opt.push({ 
                value: item.id, 
                label: item.descricao, 
                tipo_pgto: item.tipo_pgto, 
            })
        });
        setOptTipoMovimentaocao(opt)
    }

    const onSubmit: SubmitHandler<MovimentoCaixaModel> = async (data: any) => {
        try {
            data.valor = ajustaMoedaBanco(data.valor);

            if (movimentoCaixa.id_movimento_caixas) {
                await movimentoCaixaService.editMovimentoCaixa(data);
            } else {
                const id = await movimentoCaixaService.createMovimentoCaixa(data);
                setValue('id', id);
            }

            navigate(`/movimento-caixa`);
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
        getLookupsMovimentoCaixa()
        getTipoOrigemPgtos()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/caixa-sangria-suprimento-despesa')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Link to="/movimento-caixa" className="me-2">
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-0">Adicionar Movimentação de Caixa</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Contas Bancarias" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="movimento-caixa"> Movimentações de Caixa  </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Movimentação de Caixa </BreadcrumbItem>
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
                                                        <Label htmlFor="id_tipo_origem_pagamento" className="form-label">Operação</Label>
                                                        <SelectListControlled<MovimentoCaixaModel>
                                                            options={optTipoMovimentaocao}
                                                            required={required}
                                                            field={"id_tipo_origem_pagamento"}
                                                            control={control}
                                                            errors={errors.id_tipo_origem_pagamento}
                                                        />
                                                    </div>
                                                </Col>        
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_forma_pagamento" className="form-label">Forma de Pagamento</Label>
                                                        <SelectListControlled<MovimentoCaixaModel>
                                                            options={optFormaPgto}
                                                            required={required}
                                                            field={"id_forma_pagamento"}
                                                            control={control}
                                                            errors={errors.id_forma_pagamento}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="valor" className="form-label">Valor</Label>
                                                        <InputTextControlled<MovimentoCaixaModel>
                                                            field={"valor"}
                                                            control={control}
                                                            mask='real'
                                                            type="tel"
                                                            placeholder="0,00"
                                                            errors={errors.valor}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="observacao" className="form-label">Observação</Label>
                                                        <InputTextArea<MovimentoCaixaModel>
                                                            field={"observacao"}
                                                            control={control}
                                                            rows={1}
                                                            register={register}
                                                            errors={errors.descricao}
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

export default MovimentoCaixaForm;
