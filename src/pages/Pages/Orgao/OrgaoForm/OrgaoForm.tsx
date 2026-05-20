import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ajustaMoedaBanco, AnosSelect, diasMesSelect, mesesSelect, numberFormat, UFEstadosSelect, useNavegacao, validarDiaMes } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { OrgaoDefaultValues, OrgaoModel } from 'interfaces/Orgao/OrgaoInterface';
import { OrgaoService } from 'services/OrgaoService/OrgaoService';
import { UnidadeCompradoraForm } from '../Components/UnidadeCompradora/UnidadeCompradoraForm';

const OrgaoForm = () => {
    const { state } = useLocation()

    const [orgao, setOrgao] = useState<OrgaoModel>(state ? state.source : OrgaoDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<OrgaoModel>({
        defaultValues: orgao
    })
    const { idOrgao } = useParams()

    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao();
    const location = useLocation();
    const navigate = useNavigate()
    const orgaoService = new OrgaoService();


    const getLookupsOrgao = async (): Promise<void> => {
        // const lookups = await OrgaoService.getLookupsOrgao()

        // if (lookups) {
        //     let banco = new Array
        //     lookups.bancos.map(item => { banco.push({ value: item.id, label: `${item.codigo} - ${item.nome}` }) })
        //     setOptbancos(banco)
        // }
    }
    const obterDadosOrgaoUnidades = async () => {
        if (!idOrgao) return;
    
        const response = await orgaoService.listIdOrgao(idOrgao);
    
        if (response) {
            setOrgao(response);
    
            reset({
                id: response.id,
                orgao_nome: response.orgao_nome,
                unidadeCompradora: response.unidadeCompradora ?? [],
            });
        }
    };
    
    const onSubmit: SubmitHandler<OrgaoModel> = async (data: any) => {
        try {
            if (idOrgao) {
                await orgaoService.editOrgao(data);
            } else {
                const id = await orgaoService.createOrgao(data);
                setValue('id', id);
            }

            navigate(`/orgao-participante`);
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
        // setLoading(true)
        const fetchData = async () => {

            obterDadosOrgaoUnidades()

        };
        fetchData();
        // setLoading(false)
    }, []);

    // useEffect(() => {
    //     setDisplayTipoContasBancaria(false)

    //     // resetCampos();

    //     if (watchTipoContasBancaria == '1') {
    //         setDisplayTipoContasBancaria(true)
    //     }
    // }, [watchTipoContasBancaria])


    useEffect(() => {
        getLookupsOrgao()
        console.log(state?.source)
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/Orgao')
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
                                    <h4 className="mb-sm-0 ms-3">Adicionar Orgao</h4>
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
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="orgao_nome" className="form-label">Nome Orgão</Label>
                                                        <InputTextControlled<OrgaoModel>
                                                            field={"orgao_nome"}
                                                            control={control}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr />
                                            <Row>

                                                <UnidadeCompradoraForm
                                                    control={control}
                                                    register={register}
                                                    getValues={getValues}
                                                    setValue={setValue}
                                                    setError={setError}
                                                    clearErrors={clearErrors}
                                                    watch={watch}
                                                    orgao={orgao}
                                                    errors={errors.unidadeCompradora}
                                                ></UnidadeCompradoraForm>
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

export default OrgaoForm;
