import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap'
import { SubmitHandler, useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled'
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { FilamentosDefaultValues, FilamentosModel } from 'interfaces/Filamentos/FilamentosInterface'
import { FilamentosService } from 'services/Filamentos/FilamentosService'
import { TipoMaterialService } from 'services/TipoMaterial/TipoMaterialService'
import { CoresService } from 'services/Cores/CoresService'
import { LinhasMarcasService } from 'services/LinhasMarcas/LinhasMarcasService'
import { MarcasService } from 'services/MarcasService/MarcasService'

const FilamentosForm = () => {
    const { state } = useLocation()
    const [record, setRecord] = useState<FilamentosModel>(state ? state.source : FilamentosDefaultValues)
    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm<FilamentosModel>({
        defaultValues: record
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao()
    const navigate = useNavigate()
    const filamentosService = new FilamentosService()

    const tipoMaterialService = new TipoMaterialService()
    const coresService = new CoresService()
    const linhasMarcasService = new LinhasMarcasService()
    const marcasService = new MarcasService()

    const [tiposMaterial, setTiposMaterial] = useState<SelectOptions[]>([])
    const [cores, setCores] = useState<SelectOptions[]>([])
    const [linhasMarcas, setLinhasMarcas] = useState<SelectOptions[]>([])
    const [marcas, setMarcas] = useState<SelectOptions[]>([])

    const getLookups = async (): Promise<void> => {
        try {
            const resTipoMaterial = await tipoMaterialService.AsyncListTipoMaterial({})
            const resCores = await coresService.AsyncListCores({})
            const resLinhasMarcas = await linhasMarcasService.AsyncListLinhasMarcas({})
            const resMarcas = await marcasService.AsyncListMarcas({})

            if (resTipoMaterial) setTiposMaterial(resTipoMaterial.map((el: any) => ({ value: el.id, label: el.descricao })))
            if (resCores) setCores(resCores.map((el: any) => ({ value: el.id, label: el.descricao })))
            if (resLinhasMarcas) setLinhasMarcas(resLinhasMarcas.map((el: any) => ({ value: el.id, label: el.descricao })))
            if (resMarcas) setMarcas(resMarcas.map((el: any) => ({ value: el.id, label: el.descricao })))
        } catch (error) {
            console.error("Erro ao carregar lookups:", error)
        }
    }

    const watchTipoMaterial = watch("id_tipo_material")
    const watchCor = watch("id_cor")
    const watchLinhaMarca = watch("id_linha_marca")
    const watchMarca = watch("id_marca")

    useEffect(() => {
        const tMatObj = tiposMaterial.find(t => String(t.value) === String(watchTipoMaterial))
        const tMat = tMatObj ? tMatObj.label : ""
        
        const corObj = cores.find(c => String(c.value) === String(watchCor))
        const cor = corObj ? corObj.label : ""
        
        const lMarObj = linhasMarcas.find(l => String(l.value) === String(watchLinhaMarca))
        const lMar = lMarObj ? lMarObj.label : ""
        
        const marObj = marcas.find(m => String(m.value) === String(watchMarca))
        const mar = marObj ? marObj.label : ""

        const parts = [tMat, cor, lMar, mar].filter(Boolean)
        const novoResumo = parts.join(" ")

        setValue("resumo", novoResumo)
    }, [watchTipoMaterial, watchCor, watchLinhaMarca, watchMarca, tiposMaterial, cores, linhasMarcas, marcas, setValue])

    const onSubmit: SubmitHandler<FilamentosModel> = async (data: any) => {
        try {
            if (record.id) {
                const res: any = await filamentosService.editFilamentos(data)
                if (res && res.error) {
                    toast.error(res.message || "Erro ao editar filamento", { autoClose: false, theme: "colored", position: "bottom-right" })
                    return
                }
            } else {
                const res: any = await filamentosService.createFilamentos(data)
                if (res && res.error) {
                    toast.error(res.message || "Erro ao cadastrar filamento", { autoClose: false, theme: "colored", position: "bottom-right" })
                    return
                }
                setValue('id', res)
            }
            navigate(`/filamentos`)
        } catch (error: any) {
            const apiMessage = (error && error.errors && error.errors.message) ? error.errors.message : (error && error.message)
            toast.error(apiMessage || "Ocorreu um erro inesperado. Tente novamente em breve!", { autoClose: false, theme: "colored", position: "bottom-right" })
        }
    }

    useEffect(() => {
        setTimeout(() => setDisplay(true), 300)
    }, [])

    useEffect(() => {
        getLookups()
    }, [])

    useEffect(() => {
        setActiveMenu('/filamentos')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/filamentos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {record.id ? 'Editar' : 'Adicionar'} Filamentos
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/filamentos">Filamentos</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {record.id ? 'Editar' : 'Adicionar'} Filamentos
                                    </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    {display && (
                        <Row>
                            <Col xxl={12}>
                                <Card>
                                    <CardBody>
                                        <form onSubmit={handleSubmit(onSubmit)}>
                                            <Row>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Tipo de Material</Label>
                                                        <SelectListControlled<FilamentosModel>
                                                            control={control}
                                                            field="id_tipo_material"
                                                            options={tiposMaterial}
                                                            errors={errors.id_tipo_material}
                                                            required={required}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Cor</Label>
                                                        <SelectListControlled<FilamentosModel>
                                                            control={control}
                                                            field="id_cor"
                                                            options={cores}
                                                            errors={errors.id_cor}
                                                            required={required}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Linha/Marca</Label>
                                                        <SelectListControlled<FilamentosModel>
                                                            control={control}
                                                            field="id_linha_marca"
                                                            options={linhasMarcas}
                                                            errors={errors.id_linha_marca}
                                                            required={required}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label className="form-label">Marca</Label>
                                                        <SelectListControlled<FilamentosModel>
                                                            control={control}
                                                            field="id_marca"
                                                            options={marcas}
                                                            errors={errors.id_marca}
                                                            required={required}
                                                            placeholder="Selecione..."
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="codigo" className="form-label">Código</Label>
                                                        <InputTextControlled<FilamentosModel>
                                                            field={"codigo"}
                                                            control={control}                                                            
                                                            placeholder="Gerado automaticamente"
                                                            disabled={true} 
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={9}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="resumo" className="form-label">Resumo</Label>
                                                        <InputTextControlled<FilamentosModel>
                                                            field={"resumo"}
                                                            control={control}
                                                            readOnly={true}
                                                            placeholder="Preenchido automaticamente"
                                                            disabled={true} 
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="qtd" className="form-label">Quantidade</Label>
                                                        <InputTextControlled<FilamentosModel>
                                                            field={"qtd"}
                                                            type="number"
                                                            control={control}
                                                            disabled={true} 
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="preco_medio_grama" className="form-label">Preço Médio por Grama</Label>
                                                        <InputTextControlled<FilamentosModel>
                                                            field={"preco_medio_grama"}
                                                            type="number"
                                                            control={control}
                                                            disabled={true} 
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
                    )}
                </Container>
            </div>
        </React.Fragment>
    )
}

export default FilamentosForm
