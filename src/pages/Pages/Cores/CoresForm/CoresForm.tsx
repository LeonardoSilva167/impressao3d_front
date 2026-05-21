import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { CoresDefaultValues, CoresModel } from 'interfaces/Cores/CoresInterface'
import { CoresService } from 'services/Cores/CoresService'

const CoresForm = () => {
    const { state } = useLocation()
    const [record] = useState<CoresModel>(state ? state.source : CoresDefaultValues)
    const { handleSubmit, control, setValue } = useForm<CoresModel>({
        defaultValues: record
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const coresService = new CoresService()

    const onSubmit: SubmitHandler<CoresModel> = async (data: any) => {
        try {
            if (record.id) {
                await coresService.editCores(data)
            } else {
                const id = await coresService.createCores(data)
                setValue('id', id)
            }
            navigate(`/cores`)
        } catch (error: any) {
            throw error
        }
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        setActiveMenu('/cores')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/cores"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Cor
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/filamentos">Filamentos</Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/cores">Cores</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Cor
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
                                            <Col md={4}>
                                                <div className="mb-3">
                                                    <Label htmlFor="descricao" className="form-label">Descrição</Label>
                                                    <InputTextControlled<CoresModel>
                                                        field={"descricao"}
                                                        control={control}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label htmlFor="codigo" className="form-label">Código</Label>
                                                    <InputTextControlled<CoresModel>
                                                        field={"codigo"}
                                                        control={control}
                                                    />
                                                </div>
                                            </Col>
                                            <Col md={2}>
                                                <div className="mb-3">
                                                    <Label htmlFor="hexadecimal" className="form-label">Hexadecimal</Label>
                                                    <InputTextControlled<CoresModel>
                                                        field={"hexadecimal"}
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

export default CoresForm
