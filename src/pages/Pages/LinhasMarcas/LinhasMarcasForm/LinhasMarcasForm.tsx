import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { LinhasMarcasDefaultValues, LinhasMarcasModel } from 'interfaces/LinhasMarcas/LinhasMarcasInterface'
import { LinhasMarcasService } from 'services/LinhasMarcas/LinhasMarcasService'

const LinhasMarcasForm = () => {
    const { state } = useLocation()
    const [record, setRecord] = useState<LinhasMarcasModel>(state ? state.source : LinhasMarcasDefaultValues)
    const { register, handleSubmit, control, setValue, watch, reset, formState: { errors } } = useForm<LinhasMarcasModel>({
        defaultValues: record
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const linhasMarcasService = new LinhasMarcasService()

    const onSubmit: SubmitHandler<LinhasMarcasModel> = async (data: any) => {
        try {
            if (record.id) {
                await linhasMarcasService.editLinhasMarcas(data)
            } else {
                const id = await linhasMarcasService.createLinhasMarcas(data)
                setValue('id', id)
            }
            navigate(`/linhas-marcas`)
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        setActiveMenu('/linhas-marcas')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/linhas-marcas"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Linhas de Marcas
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/linhas-marcas">Linhas de Marcas</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Linhas de Marcas
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                    <InputTextControlled<LinhasMarcasModel>
                                                        field={"descricao"}
                                                        control={control}
                                                        rules={required}
                                                    />
                                                </div>
                                            </Col>
                                        </Row>
                                        <hr />
                                        <Row className="mt-5">
                                            <Col md={12}>
                                                <div className="hstack gap-2 justify-content-end">
                                                    <button type="submit" className="btn btn-primary">Salvar</button>
                                                    <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>Voltar</button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default LinhasMarcasForm
