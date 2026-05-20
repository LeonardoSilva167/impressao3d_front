import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
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
import { SubtipoProdutoDefaultValues, SubtipoProdutoModel } from 'interfaces/SubtipoProduto/SubtipoProdutoInterface';
import { SubtipoProdutoService } from 'services/SubtipoProdutoService';

const SubtipoProdutoForm = () => {
    const { state } = useLocation()
    const { idSubtipoProduto } = useParams()

    const [subtipoProduto, setSubtipoProduto] = useState<SubtipoProdutoModel>(state ? state.source : SubtipoProdutoDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<SubtipoProdutoModel>({
        defaultValues: subtipoProduto
    })

    const { voltarParaRotaAnterior } = useNavegacao();
    const [startFields, setStartFields] = useState<boolean>(true)
    const [display, setDisplay] = useState<boolean>(false)
    const [displayTipoContasBancaria, setDisplayTipoContasBancaria] = useState<boolean>(true)

    const [optTipoProdutos, setOptTipoProdutos] = useState<SelectOptions[]>([])
    const [optUsoPeriodo, setOptUsoPeriodo] = useState<SelectOptions[]>([])
    const [optSubtipoProduto, setOptSubtipoProduto] = useState<SelectOptions[]>([])
    // const [optHoraProtecao, setOptHoraProtecao] = useState<SelectOptions[]>([])

    const [disabledVencimento, setDisabledVencimento] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate()
    const subtipoProdutoService = new SubtipoProdutoService();

    const getLookupsSubtipoProdutos = async (): Promise<void> => {
        const lookups = await subtipoProdutoService.getLookupsSubtipoProduto()

        if (lookups) {
            let tipoProdutos = new Array
            lookups.tipo_produtos.map(item => { tipoProdutos.push({ value: item.id, label: `${item.nome}` }) })
            setOptTipoProdutos(tipoProdutos)

        }
    }

    const onSubmit: SubmitHandler<SubtipoProdutoModel> = async (data: any) => {
        try {
            if (idSubtipoProduto) {
                await subtipoProdutoService.editSubtipoProduto(data);
            } else {
                const id = await subtipoProdutoService.createSubtipoProduto(data);
                setValue('id', id);
            }
            navigate(`/subtipo-produto`);


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
        getLookupsSubtipoProdutos()
    }, [])
    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/SubtipoProduto')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <Link to="/subtipo-produto"> <i className="bx bx-arrow-back bx-sm"></i> </Link>
                                    <h4 className="mb-sm-0 ms-3">Adicionar Subtipo Produto</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Tipo Produto" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/subtipo-produto"> Subtipo Produto </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Subtipo Produto </BreadcrumbItem>
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
                                                        <InputCheckbox<SubtipoProdutoModel> field='ativo' register={register} role="switch" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="tipo_produtos_id" className="form-label">Tipo de Produto</Label>

                                                        <SelectListControlled<SubtipoProdutoModel>
                                                            options={optTipoProdutos}
                                                            field={"tipo_produtos_id"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="nome" className="form-label">Descrição</Label>
                                                        <InputTextControlled<SubtipoProdutoModel>
                                                            field={"nome"}
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

export default SubtipoProdutoForm;
