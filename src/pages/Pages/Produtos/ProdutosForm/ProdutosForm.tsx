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
import { ProdutosDefaultValues, ProdutosModel } from 'interfaces/Produtos/ProdutosInterface';
import { ProdutosService } from 'services/ProdutosService';

const ProdutosForm = () => {
    const { state } = useLocation()

    const [produtos, setProdutos] = useState<ProdutosModel>(state ? state.source : ProdutosDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<ProdutosModel>({
        defaultValues: produtos
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
    const produtosService = new ProdutosService();

    const onSubmit: SubmitHandler<ProdutosModel> = async (data: any) => {
        try {
            console.log(produtos);
            if (produtos.codigo_base) {
                await produtosService.editProdutos(data);
            } else {
                const codigo_base = await produtosService.createProdutos(data);
                setValue('codigo_base', codigo_base);
            }

            navigate(`/produtos`);
        } catch (error: any) {
            throw error;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/produtos')
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
                                    <h4 className="mb-sm-0 ms-3">Adicionar Produtos</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Produtos" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/contas-a-pagar"> Produtos </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Produtos </BreadcrumbItem>
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
                                                        <InputCheckbox<ProdutosModel> field='ativo' register={register} role="switch" />
                                                    </div>
                                                </Col> */}
                                            </Row>
                                            <Row>

                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="codigo_base" className="form-label">Código Base</Label>
                                                        <InputTextControlled<ProdutosModel>
                                                            field={"codigo_base"}
                                                            control={control}
                                                            disabled={true}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={9}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                        <InputTextControlled<ProdutosModel>
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

export default ProdutosForm;
