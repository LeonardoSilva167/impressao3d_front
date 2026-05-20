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
import { LinhasProdutosService } from 'services/LinhasProdutosService';
import { LinhasProdutosDefaultValues, LinhasProdutosModel } from 'interfaces/LinhasProdutos/LinhasProdutosInterface';
import { MarcasService } from 'services/MarcasService';
import { ReceitasService } from 'services/ReceitasService';
import { MarcasModel } from 'interfaces/Marcas';

const LinhasProdutosForm = () => {
    const { state } = useLocation()

    const [linhasProdutos, setLinhasProdutos] = useState<LinhasProdutosModel>(state ? state.source : LinhasProdutosDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<LinhasProdutosModel>({
        defaultValues: linhasProdutos
    })

    const { voltarParaRotaAnterior } = useNavegacao();
    const [startFields, setStartFields] = useState<boolean>(true)
    const [display, setDisplay] = useState<boolean>(false)
    const [displayTipoContasBancaria, setDisplayTipoContasBancaria] = useState<boolean>(true)

    const [optMarcas, setOptMarcas] = useState<SelectOptions[]>([])
    const [optUsoPeriodo, setOptUsoPeriodo] = useState<SelectOptions[]>([])
    const [optTipoProduto, setOptTipoProduto] = useState<SelectOptions[]>([])
    // const [optHoraProtecao, setOptHoraProtecao] = useState<SelectOptions[]>([])

    const [disabledVencimento, setDisabledVencimento] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate()
    const linhasProdutosService = new LinhasProdutosService();


    const watchNome = watch('nome')
    // const watchTipoContasBancaria = watch('tipo_ContasBancaria')


    const getLookupsLinhasProdutos = async (): Promise<void> => {
        const lookups = await linhasProdutosService.getLookupsLinhasProdutos()

        if (lookups) {
            let marca = new Array
            lookups.marcas.map(item => { marca.push({ value: item.id, label: `${item.nome} - ${item.codigo}` }) })
            setOptMarcas(marca)

            let usoPeriodo = new Array
            lookups.usoPeriodos.map(item => { usoPeriodo.push({ value: item.id, label: `${item.descricao}` }) })
            setOptUsoPeriodo(usoPeriodo)

            let tipoProduto = new Array
            lookups.tipoProdutos.map(item => { tipoProduto.push({ value: item.id, label: `${item.descricao}` }) })
            setOptTipoProduto(tipoProduto)
        }
    }

    const onSubmit: SubmitHandler<LinhasProdutosModel> = async (data: any) => {
        try {
            // console.log(linhasProdutos);
            if (linhasProdutos.id) {
                await linhasProdutosService.editLinhasProdutos(data);
            } else {
                const id = await linhasProdutosService.createLinhasProdutos(data);
                setValue('id', id);
            }

            navigate(`/linha-produto`);
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
        if (watchNome) {
            const abreviacao = watchNome
            .split(" ") // Divide a string em palavras
            .filter(word => word.length > 0) // Remove espaços extras
            .map(word => word[0].toUpperCase()) // Pega a primeira letra de cada palavra
            .join(""); // Junta tudo em uma única string
        // console.log(abreviacao)
        setValue('codigo', abreviacao);
        // setIniciais(abreviacao);   
        }
    }, [watchNome])


    useEffect(() => {
        getLookupsLinhasProdutos()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/linha-produto')
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
                                    <h4 className="mb-sm-0 ms-3">Adicionar Linha Produto</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Linha Produto" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/contas-a-pagar"> Linha Produto </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Linha Produto </BreadcrumbItem>
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
                                                {/* <Col md={12} className='d-flex flex-row justify-content-end align-items-center'>
                                                    <div className="form-check form-switch form-switch-md mb-3 form-check-right mb-2">
                                                        <Label className="me-3" htmlFor="ativo">Ativo</Label>
                                                        <InputCheckbox<LinhasProdutosModel> field='ativo' register={register} role="switch" />
                                                    </div>
                                                </Col> */}
                                            </Row>
                                            <Row>

                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="marca_id" className="form-label">Marca</Label>
                                                        <SelectListControlled<LinhasProdutosModel>
                                                            options={optMarcas}
                                                            required={required}
                                                            field={"marca_id"}
                                                            control={control}
                                                        // defaultValue={{ value: 1, label: contasBancarias.nome_despesa }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={5}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="nome" className="form-label">Nome </Label>
                                                        <InputTextControlled<LinhasProdutosModel>
                                                            field={"nome"}
                                                            control={control}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="codigo" className="form-label">Código Linha</Label>
                                                        <InputTextControlled<LinhasProdutosModel>
                                                            field={"codigo"}
                                                            control={control}
                                                            // disabled={true}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="uso_periodo_id" className="form-label">Usabilidade</Label>
                                                        <SelectListControlled<LinhasProdutosModel>
                                                            options={optUsoPeriodo}
                                                            required={required}
                                                            field={"uso_periodo_id"}
                                                            control={control}
                                                        // defaultValue={{ value: 1, label: lancamentos.nome_despesa }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="tipo_id" className="form-label">Tipo</Label>
                                                        <SelectListControlled<LinhasProdutosModel>
                                                            options={optTipoProduto}
                                                            required={required}
                                                            field={"tipo_id"}
                                                            control={control}
                                                        // defaultValue={{ value: 1, label: lancamentos.nome_despesa }}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="hora_protecao" className="form-label">Duração</Label>
                                                        <InputTextControlled<LinhasProdutosModel>
                                                            field={"hora_protecao"}
                                                            control={control}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                                {/* <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="descricao" className="form-label">Apelido</Label>
                                                        <InputTextControlled<LinhasProdutosModel>
                                                            placeholder="Apelido"
                                                            field={"apelido"}
                                                            control={control}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="saldo" className="form-label">Saldo Inicial </Label>
                                                        <InputTextControlled<LinhasProdutosModel>
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

export default LinhasProdutosForm;
