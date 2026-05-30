import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { setActiveMenu } from 'helpers/system_helpers'
import { useNavegacao } from 'helpers/functions_helpers'
import {
    Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row, Spinner
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm'
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled'
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface'
import { ComposicaoProdutosModel } from 'interfaces/ComposicaoProdutos/ComposicaoProdutosInterface'
import { ProdutosList } from 'interfaces/Produtos/ProdutosInterface'
import { ProjetosImpressaoModel } from 'interfaces/ProjetosImpressao/ProjetosImpressaoInterface'
import { ComposicaoProdutosService } from 'services/ComposicaoProdutos/ComposicaoProdutosService'
import { ProdutosService } from 'services/ProdutosService/ProdutosService'
import { ProjetosImpressaoService } from 'services/ProjetosImpressao/ProjetosImpressaoService'
import { prepararPayloadSalvar } from '../hooks/useComposicaoProdutos'

interface ComposicaoFormFields {
    id_produto_base: string | number | null
    id_projeto_impressao: string | number | null
}

const ComposicaoProdutosForm = () => {
    const { id } = useParams()
    const { state } = useLocation()
    const navigate = useNavigate()
    const { voltarParaRotaAnterior } = useNavegacao()

    const composicaoService = new ComposicaoProdutosService()
    const produtosService = new ProdutosService()
    const projetosService = new ProjetosImpressaoService()

    const isEditing = Boolean(id)
    const [loading, setLoading] = useState(isEditing)
    const [salvando, setSalvando] = useState(false)

    const { control, setValue, handleSubmit } = useForm<ComposicaoFormFields>({
        defaultValues: {
            id_produto_base: null,
            id_projeto_impressao: null,
        },
    })

    const getListProdutos = async (inputValue: string): Promise<SelectOptions[]> => {
        const list = await produtosService.AsyncListProdutos({ palavra_chave: inputValue })
        if (!list) return [{ value: '', label: 'Selecione' }]
        return [
            { value: '', label: 'Selecione' },
            ...list.map((item: ProdutosList) => ({
                value: item.id,
                label: item.sku_base
                    ? `${item.sku_base} - ${item.descricao_produto || ''}`
                    : (item.descricao_produto || String(item.id)),
            })),
        ]
    }

    const getListProjetos = async (inputValue: string): Promise<SelectOptions[]> => {
        const list = await projetosService.AsyncListProjetosImpressao({ palavra_chave: inputValue })
        if (!list) return [{ value: '', label: 'Selecione' }]
        return [
            { value: '', label: 'Selecione' },
            ...list.map((item: ProjetosImpressaoModel) => ({
                value: item.id,
                label: [
                    item.codigo_projeto,
                    item.nome_original_projeto,
                    item.descricao_projeto,
                ].filter(Boolean).join(' - '),
            })),
        ]
    }

    const loadRecord = async () => {
        if (!id) return

        const registroId = Number(id)
        if (Number.isNaN(registroId)) return

        setLoading(true)
        try {
            const view = await composicaoService.getViewComposicaoProdutos({ id: registroId })
            if (!view) {
                toast.error('Composição não encontrada.')
                return
            }
            setValue('id_produto_base', view.id_produto_base || null)
            setValue('id_projeto_impressao', view.id_projeto_impressao || null)
        } catch (error) {
            console.error('Erro ao carregar composição:', error)
            toast.error('Erro ao carregar composição.')
        } finally {
            setLoading(false)
        }
    }

    const onSubmit = async (data: ComposicaoFormFields) => {
        setSalvando(true)
        try {
            const payload = prepararPayloadSalvar({
                id: isEditing ? Number(id) : null,
                id_produto_base: data.id_produto_base,
                id_projeto_impressao: data.id_projeto_impressao,
                configuracao_itens: [],
                variacoes_itens: [],
            } as ComposicaoProdutosModel)

            if (isEditing) {
                await composicaoService.editComposicaoProdutos(payload)
                toast.success('Composição atualizada com sucesso.')
                navigate(`/composicao-produtos/view/${id}`)
            } else {
                const newId = await composicaoService.createComposicaoProdutos(payload)
                toast.success('Composição cadastrada com sucesso.')
                if (newId != null) {
                    navigate(`/composicao-produtos/view/${newId}`)
                } else {
                    navigate('/composicao-produtos')
                }
            }
        } catch (error) {
            console.error('Erro ao salvar composição:', error)
            toast.error('Erro ao salvar composição.')
        } finally {
            setSalvando(false)
        }
    }

    useEffect(() => {
        setActiveMenu('/composicao-produtos')
    }, [])

    useEffect(() => {
        if (isEditing) {
            loadRecord()
        } else if (state && state.source) {
            setValue('id_produto_base', state.source.id_produto_base || null)
            setValue('id_projeto_impressao', state.source.id_projeto_impressao || null)
        }
    }, [id])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-sm-flex align-items-center justify-content-between">
                                    <Link to="/composicao-produtos"><i className="bx bx-arrow-back bx-sm"></i></Link>
                                    <h4 className="mb-sm-0 ms-3">
                                        {isEditing ? 'Editar' : 'Adicionar'} Composição do Produto
                                    </h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName="mb-sm-0 pt-1 py-2">
                                    <BreadcrumbItem><Link to="/dashboard"><i className="ri-home-5-fill"></i></Link></BreadcrumbItem>
                                    <BreadcrumbItem>Produtos</BreadcrumbItem>
                                    <BreadcrumbItem><Link to="/composicao-produtos">Composição do Produto</Link></BreadcrumbItem>
                                    <BreadcrumbItem active>
                                        {isEditing ? 'Editar' : 'Adicionar'}
                                    </BreadcrumbItem>
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
                                            <p className="text-muted mb-4">
                                                Informe o produto base e o projeto de impressão.
                                                Após salvar, você configurará cada parte na tela de visualização.
                                            </p>

                                            <Row>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_produto_base" className="form-label">Produto Base</Label>
                                                        <AsyncSelectListControlled<ComposicaoFormFields>
                                                            field="id_produto_base"
                                                            control={control}
                                                            callback={getListProdutos}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={6}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="id_projeto_impressao" className="form-label">Projeto de Impressão</Label>
                                                        <AsyncSelectListControlled<ComposicaoFormFields>
                                                            field="id_projeto_impressao"
                                                            control={control}
                                                            callback={getListProjetos}
                                                            required={required}
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

export default ComposicaoProdutosForm
