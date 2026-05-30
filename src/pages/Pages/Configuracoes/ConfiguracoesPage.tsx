import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { invalidarCacheCustosProducaoConfig } from 'hooks/useCustosProducaoConfig'
import {
    Breadcrumb,
    BreadcrumbItem,
    Card,
    CardBody,
    Col,
    Container,
    Label,
    Row,
    Spinner,
} from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import {
    ConfiguracoesDefaultValues,
    ConfiguracoesModel,
} from 'interfaces/Configuracoes/ConfiguracoesInterface'
import { ConfiguracoesService } from 'services/Configuracoes/ConfiguracoesService'

const ConfiguracoesPage = () => {
    const { voltarParaRotaAnterior } = useNavegacao()
    const configuracoesService = new ConfiguracoesService()

    const { handleSubmit, register, reset } = useForm<ConfiguracoesModel>({
        defaultValues: ConfiguracoesDefaultValues,
    })

    const [loading, setLoading] = useState(true)
    const [salvando, setSalvando] = useState(false)

    const loadConfiguracoes = async () => {
        setLoading(true)
        try {
            const config = await configuracoesService.getConfiguracoes()
            if (config) {
                reset({
                    id: config.id ?? 1,
                    proximo_codigo_base: config.proximo_codigo_base,
                    custo_energia_kwh: config.custo_energia_kwh ?? 1.039,
                    custo_desgaste_hora: config.custo_desgaste_hora ?? 1.2,
                })
            } else {
                reset(ConfiguracoesDefaultValues)
            }
        } catch (error) {
            console.warn('Configurações não disponíveis, usando valores padrão:', error)
            reset(ConfiguracoesDefaultValues)
        } finally {
            setLoading(false)
        }
    }

    const onSubmit: SubmitHandler<ConfiguracoesModel> = async (data) => {
        setSalvando(true)
        try {
            const payload: ConfiguracoesModel = {
                id: data.id ?? 1,
                proximo_codigo_base: data.proximo_codigo_base,
                custo_energia_kwh: Number(data.custo_energia_kwh),
                custo_desgaste_hora: Number(data.custo_desgaste_hora),
            }

            await configuracoesService.editConfiguracoes(payload)
            invalidarCacheCustosProducaoConfig()
            toast.success('Configurações salvas com sucesso.')
            await loadConfiguracoes()
        } catch (error) {
            console.error('Erro ao salvar configurações:', error)
            toast.error('Erro ao salvar configurações.')
        } finally {
            setSalvando(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/configuracoes')
    }, [])

    useEffect(() => {
        loadConfiguracoes()
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/dashboard"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">Configurações</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem active>Configurações</BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>

                    <Row>
                        <Col xxl={12}>
                            <Card>
                                <CardBody>
                                    {loading ? (
                                        <div className="text-center py-5">
                                            <Spinner animation="border" variant="primary" />
                                        </div>
                                    ) : (
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <h5 className="mb-3">Custos de Produção</h5>
                                            <Row>
                                                <Col md={6} lg={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="custo_energia_kwh" className="form-label">
                                                            Custo Energia por KWH
                                                        </Label>
                                                        <InputNumber<ConfiguracoesModel>
                                                            field="custo_energia_kwh"
                                                            register={register}
                                                            required={required}
                                                            onlyPositive
                                                            step="0.001"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6} lg={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="custo_desgaste_hora" className="form-label">
                                                            Custo Desgaste por Hora
                                                        </Label>
                                                        <InputNumber<ConfiguracoesModel>
                                                            field="custo_desgaste_hora"
                                                            register={register}
                                                            required={required}
                                                            onlyPositive
                                                            step="0.01"
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <hr />
                                            <Row className="mt-4">
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        <button
                                                            type="submit"
                                                            className="btn btn-primary"
                                                            disabled={salvando}
                                                        >
                                                            {salvando ? 'Salvando...' : 'Salvar'}
                                                        </button>
                                                        <button
                                                            type="button"
                                                            className="btn btn-soft-success"
                                                            onClick={voltarParaRotaAnterior}
                                                        >
                                                            Voltar
                                                        </button>
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

export default ConfiguracoesPage
