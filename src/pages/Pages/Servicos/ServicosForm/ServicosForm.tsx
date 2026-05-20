import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { ServicosDefaultValues, ServicosModel } from 'interfaces/Servicos';
import { ajustaMoedaBanco, useNavegacao } from 'helpers/functions_helpers';
import { ServicosService } from 'services/ServicosService';
import { InputTextArea } from 'Components/ComponentController/Inputs/Text/InputTextArea';
import { ServicosFormPartial } from './ServicosFormPartial';
import { ServicosFormSubmit } from './ServicosFormSubmit';

const ServicosForm = () => {
    const { state } = useLocation()

    const [Servicos, setServicos] = useState<ServicosModel>(state ? state.source : ServicosDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<ServicosModel>({
        defaultValues: Servicos
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao();
    const location = useLocation();
    const navigate = useNavigate()
    const servicosService = new ServicosService();

    // const onSubmit: SubmitHandler<ServicosModel> = async (data: any) => {
    //     try {

    //         data.preco = ajustaMoedaBanco(data.preco);

    //         if (Servicos.id_servico) {
    //             await servicosService.editServicos(data);
    //         } else {
    //             const id = await servicosService.editServicos(data);
    //             setValue('id', id);
    //         }

    //         navigate(`/Servicos`);
    //     } catch (error: any) {
    //         throw error;
    //     }
    // };
    const onSubmit: SubmitHandler<ServicosModel> = async (data) => {
        try {
            await ServicosFormSubmit(data, setValue, () => navigate('/servicos'));
            navigate(`/servicos`);
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
        setActiveMenu('/Servicos')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Link to="/servicos" className="me-2">
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-0">Adicionar Servicos</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Servicos" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/servicos"> Servicos</Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Servicos</BreadcrumbItem>
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
                                        <ServicosFormPartial control={control} errors={errors} register={register} />

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

export default ServicosForm;
