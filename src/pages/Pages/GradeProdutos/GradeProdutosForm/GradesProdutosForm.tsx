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
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled';

import { InputCheckbox } from 'Components/ComponentController/Inputs/Checkbox/InputCheckbox';
import { MarcasService } from 'services/MarcasService';
import { ReceitasService } from 'services/ReceitasService';
import { MarcasModel } from 'interfaces/Marcas';
import { GradesProdutosDefaultValues, GradesProdutosModel } from 'interfaces/GradesProdutos/GradesProdutosInterface';
import { GradesProdutosService } from 'services/GradesProdutosService/GradesProdutosService';
import { ProdutosService } from 'services/ProdutosService';
import { ProdutosModel } from 'interfaces/Produtos/ProdutosInterface';
import { LinhasProdutosService } from 'services/LinhasProdutosService';
import { LinhasProdutosModel } from 'interfaces/LinhasProdutos';
import { GradeProdutoUnidade } from '../GradeProdutosUnidades/GradeProdutoUnidade';

const GradesProdutosForm = () => {
    const { state } = useLocation()

    const [gradesProdutos, setGradesProdutos] = useState<GradesProdutosModel>(state ? state.source : GradesProdutosDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<GradesProdutosModel>({
        defaultValues: gradesProdutos
    })

    const { voltarParaRotaAnterior } = useNavegacao();
    const [startFields, setStartFields] = useState<boolean>(true)
    const [display, setDisplay] = useState<boolean>(false)
    const [displayTipoContasBancaria, setDisplayTipoContasBancaria] = useState<boolean>(true)

    const [optTamanhoList, setOptTamanhos] = useState<SelectOptions[]>([])
    const [optUnidadeList, setOptUnidade] = useState<SelectOptions[]>([])
    const [optTipoProduto, setOptTipoProduto] = useState<SelectOptions[]>([])
    // const [optHoraProtecao, setOptHoraProtecao] = useState<SelectOptions[]>([])

    const [disabledVencimento, setDisabledVencimento] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate()
    const gradesProdutosService = new GradesProdutosService();
    const produtosService = new ProdutosService()
    const linhasProdutosService = new LinhasProdutosService()
    const watchTamanho = watch('tamanho');
    // const watchTipoContasBancaria = watch('tipo_ContasBancaria')


    const getLookupsGradesProdutos = async (): Promise<void> => {
        const lookups = await gradesProdutosService.getLookupsGradesProdutos()

        if (lookups) {
            let tamanho = new Array
            lookups.tamanhos.map(item => { tamanho.push({ value: item.id, label: `${item.tamanho}` }) })
            setOptTamanhos(tamanho)
            console.log(tamanho)

            let unidade = new Array
            lookups.unidades.map(item => { unidade.push({ value: item.id, label: `${item.descricao}` }) })
            setOptUnidade(unidade)

            //         let tipoProduto = new Array
            //         lookups.tipoProdutos.map(item => { tipoProduto.push({ value: item.id, label: `${item.descricao}` }) })
            //         setOptTipoProduto(tipoProduto)
        }
    }

    const getListProdutos = async (inputValue: string): Promise<SelectOptions[]> => {
        const listLinha = await produtosService.AsyncListProdutos({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listLinha && listLinha.map((item: ProdutosModel) => {
            opt.push({ value: item.codigo_base, label: `${item.codigo_base} - ${item.descricao}` })
        });

        return opt
    }

    const getListLinhaProdutos = async (inputValue: string): Promise<SelectOptions[]> => {
        const listLinha = await linhasProdutosService.AsyncListLinhasProdutos({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listLinha && listLinha.map((item: LinhasProdutosModel) => {
            opt.push({ value: item.codigo, label: `${item.marca_nome} - ${item.nome}` })
        });

        return opt
    }

    const onSubmit: SubmitHandler<GradesProdutosModel> = async (data: any) => {
        try {

            if (gradesProdutos.codigo) {
                await gradesProdutosService.editGradesProdutos(data);
            } else {
                const codigo = await gradesProdutosService.createGradesProdutos(data);
                setValue('codigo', codigo);
            }

            navigate(`/grade-produto`);
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
        getLookupsGradesProdutos()
    }, [])

    useEffect(() => {
        console.log(watchTamanho)
    }, [watchTamanho])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/grade-produto')
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
                                    <h4 className="mb-sm-0 ms-3">Adicionar Grade Produto</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Grade Produto" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/contas-a-pagar"> Grade Produto </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Grade Produto </BreadcrumbItem>
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
                                            {/* <Row >
                                                <Col md={12} className='d-flex flex-row justify-content-end align-items-center'>
                                                    <div className="form-check form-switch form-switch-md mb-3 form-check-right mb-2">
                                                        <Label className="me-3" htmlFor="ativo">Ativo</Label>
                                                        <InputCheckbox<GradesProdutosModel> field='ativo' register={register} role="switch" />
                                                    </div>
                                                </Col>
                                            </Row> */}
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="produto_codigo_base" className="form-label">Produto</Label>

                                                        <AsyncSelectListControlled<GradesProdutosModel>
                                                            callback={getListProdutos}
                                                            field={"produto_codigo_base"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </div>
                                                </Col>

                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="produto_codigo_base" className="form-label">Linha</Label>

                                                        <AsyncSelectListControlled<GradesProdutosModel>
                                                            callback={getListLinhaProdutos}
                                                            field={"produto_codigo_base"}
                                                            control={control}
                                                            className="w-100"
                                                        />
                                                    </div>
                                                </Col>

                                                <Col md={1}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="unidade_id" className="form-label">Unidade</Label>

                                                        <SelectListControlled<GradesProdutosModel>
                                                            options={optUnidadeList}
                                                            field={"unidade_id"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row className='mt-5'>
                                                <GradeProdutoUnidade control={control} register={register} getValues={getValues} setValue={setValue} setError={setError} clearErrors={clearErrors}
                                                    // date={watchDtInicio} 
                                                    // radioApenasAgendamento={watchAgendasPorAgendamentoOnly == 1} 
                                                    errors={errors.tamanhosUnidades} 
                                                    gradesProdutos={getValues()}
                                                    tamanhoList = {optTamanhoList}
                                                    lookups={{optTamanhoList}} 
                                                ></GradeProdutoUnidade>
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

export default GradesProdutosForm;
