import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { MarcasDefaultValues, MarcasModel } from 'interfaces/Marcas/MarcasInterface'
import { MarcasService } from 'services/MarcasService/MarcasService'

const MarcasForm = () => {
    const { state } = useLocation()
    const [record] = useState<MarcasModel>(state ? state.source : MarcasDefaultValues)
    const { handleSubmit, control, setValue } = useForm<MarcasModel>({
        defaultValues: record
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const marcasService = new MarcasService()

    const onSubmit: SubmitHandler<MarcasModel> = async (data: any) => {
        try {
            if (record.id) {
                await marcasService.editMarcas(data)
            } else {
                const id = await marcasService.createMarcas(data)
                setValue('id', id)
            }
            navigate(`/marcas`)
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        setActiveMenu('/marcas')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/marcas"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Marca
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/produtos">Produtos</Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/marcas">Marcas</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Marca
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {display && (
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <Row>
                                            <Col md={6}>
                                                <div className="mb-3">
                                                    <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                    <InputTextControlled<MarcasModel>
                                                        field={"descricao"}
                                                        control={control}
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
                                    )}
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default MarcasForm
