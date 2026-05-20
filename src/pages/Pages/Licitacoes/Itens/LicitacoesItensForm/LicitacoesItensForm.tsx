import React, { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ajustaMoedaBanco, AnosSelect, diasMesSelect, mesesSelect, numberFormat, NumeroSelect, UFEstadosSelect, useNavegacao, validarDiaMes } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled';
import { ClientesModel } from 'interfaces/Clientes/ClientesInterface';
import { ClientesService } from 'services/Clientes/ClientesService';
import { InputDateTime } from 'Components/ComponentController/Inputs/Date/InputDateTime';
import { ContasBancariasModel } from 'interfaces/ContasBancarias/ContasBancariasInterface';
import { LicitacoesService } from 'services/Licitacoes';
import { LicitacoesItensDefaultValues, LicitacoesItensModel } from 'interfaces/Licitacoes';
import { InputTextArea } from 'Components/ComponentController/Inputs/Text/InputTextArea';
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber';

const LicitacoesItensForm = () => {
    const { state } = useLocation()
    console.log(state.source)
    const { idLicitacao } = useParams()
    const [licitacoesItens, setLicitacoesItens] = useState<LicitacoesItensModel>(state ? state.source : LicitacoesItensDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<LicitacoesItensModel>({
        defaultValues: licitacoesItens
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao();
    const location = useLocation();
    const navigate = useNavigate()
    const licitacoesItensService = new LicitacoesService();
    const clientesService = new ClientesService();

    const [optGrupoNumero, setOptGrupoNumero] = useState<SelectOptions[]>(NumeroSelect())
    const [optStatusClassificacoes, setOptStatusClassificacoes] = useState<SelectOptions[]>([])

    const getLookupsLicitacoesItens = async (): Promise<void> => {
        const lookups = await licitacoesItensService.getLookupsLicitacoesItens()

            if (lookups) {
                let statusClassificacoes = new Array
                lookups.statusClassificacoes.map(item => { statusClassificacoes.push({ value: item.id, label: item.nome }) })
                setOptStatusClassificacoes(statusClassificacoes)
            }
    }
 
    const getListClientes = async (inputValue: string): Promise<SelectOptions[]> => {
        const listClientes = await clientesService.AsyncListClientes({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listClientes && listClientes.map((item: ClientesModel) => {
            opt.push({ value: item.id, label: `${item.codigo} - ${item.nome}` })
        });

        return opt
    }


    const onSubmit: SubmitHandler<LicitacoesItensModel> = async (data: any) => {
        try {
            data.data_limite_proposta = new Date(data.data_limite_proposta).toISOString()

            if (licitacoesItens.licitacao_id) {
                await licitacoesItensService.editLicitacoesItens(data);
            } else {
                const id = await licitacoesItensService.createLicitacoesItens(data);
                setValue('id', id);
            }

            navigate(`/licitacoesItens`);
        } catch (error: any) {
            throw error;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])



    // useEffect(() => {
    //     setDisplayTipoContasBancaria(false)

    //     // resetCampos();

    //     if (watchTipoContasBancaria == '1') {
    //         setDisplayTipoContasBancaria(true)
    //     }
    // }, [watchTipoContasBancaria])


    useEffect(() => {
        console.log(errors)
    }, [errors])

    useEffect(() => {
        getLookupsLicitacoesItens()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu(`/licitacoesItens/itens/${idLicitacao}`)
    }, [])

    return (
        <React.Fragment>
            
            <div className="page-content">
                <Container fluid>
                    
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <Link to={`/licitacoes/itens/${idLicitacao}`}  state={{ source: state.source }}> <i className="bx bx-arrow-back bx-sm"></i> </Link>
                                    <h4 className="mb-sm-0 ms-3">Adicionar Itens</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Contas Bancarias" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/licitacoes"> Licitacões </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Itens </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Card >
                            <CardBody>
                                <Col xs={12}>
                                    <div className="d-flex flex-row justify-content-start align-items-center mb-4" >
                                        <div className="mt-3 mt-lg-0">
                                            <div className="col-auto">
                                                <h4 className="text-left mb-sm-0 ms-3">{`${state.source.modalidade_nome} ${state.source.num_compra}/${state.source.exercicio} ${state.source.cliente_codigo} - ${state.source.cliente_nome}  - ${state.source.cliente_cidade}/${state.source.cliente_uf}`}</h4>
                                                <hr />
                                                <h6 className="text-left mb-sm-0 ms-3 mt-1">{`Data Limíte: ${state.source.data_limite_proposta_format} - ${state.source.status_licitacao} `}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </CardBody>
                        </Card>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col xxl={6}>
                                    <Card >
                                        <CardBody>
                                            <div className="">
                                                <h4>Informações do Item</h4>
                                                <hr />
                                                <Row>
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="grupo_item_id" className="form-label">Grupo</Label>
                                                            <SelectListControlled<LicitacoesItensModel>
                                                                options={optGrupoNumero}
                                                                required={required}
                                                                field={"grupo_item_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>    
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="numero_item" className="form-label">Número Item</Label>                                        
                                                            <InputNumber<LicitacoesItensModel>
                                                                    field="numero_item"
                                                                    register={register}
                                                                    required={required}                                                                        
                                                                    onlyPositive={true}
                                                                    errors={errors.numero_item}
                                                                />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>                                                       
                                                    <Col md={5}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="titulo_item" className="form-label">Título</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"titulo_item"}
                                                                control={control}
                                                                register={register}
                                                                required={required}
                                                                errors={errors.titulo_item}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={7}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="apelido_item" className="form-label">Apelido</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"apelido_item"}
                                                                control={control}
                                                                register={register}
                                                                required={required}
                                                                errors={errors.apelido_item}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>                                                            
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="qtd" className="form-label">Qtde Solicitada</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"qtd"}
                                                                control={control}
                                                                register={register}
                                                                required={required}
                                                                errors={errors.qtd}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={4}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="preco_teto" className="form-label">Preço Teto</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"preco_teto"}
                                                                control={control}
                                                                register={register}
                                                                required={required}
                                                                errors={errors.preco_teto}
                                                                mask={'real'}
                                                                />
                                                        </div>
                                                    </Col>
                                                    <Col md={5}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="total_teto" className="form-label">Total Teto</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"total_teto"}
                                                                control={control}
                                                                register={register}
                                                                disabled={true}
                                                                errors={errors.total_teto}
                                                                mask={'real'}
                                                                />
                                                        </div>
                                                    </Col>
                                                    <Col md={12}>                                            
                                                        <div className="mb-3">
                                                            <Label htmlFor="descricao" className="form-label">Descrição Detalhada</Label>
                                                            <InputTextArea<LicitacoesItensModel>
                                                                field={"descricao"}
                                                                control={control}
                                                                rows={5}
                                                                register={register}
                                                                errors={errors.descricao}
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <div className="">
                                                    <h4>Informações do Edital</h4>
                                                    <hr />
                                                    <Row>
                                                        <Col md={3}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="numero_item_edital" className="form-label">Número Item Edital</Label>
                                                                <InputTextControlled<LicitacoesItensModel>
                                                                    field={"numero_item_edital"}
                                                                    control={control}
                                                                    register={register}
                                                                    required={required}
                                                                    errors={errors.numero_item_edital}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="valor_lance" className="form-label">Valor Lance</Label>
                                                                <InputTextControlled<LicitacoesItensModel>
                                                                    field={"valor_lance"}
                                                                    control={control}            
                                                                    required={required}
                                                                    mask={'real'}
                                                                    errors={errors.valor_lance}                                                
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="total_lance" className="form-label">Total Lance</Label>
                                                                <InputTextControlled<LicitacoesItensModel>
                                                                    field={"total_lance"}
                                                                    control={control}                                                            
                                                                    disabled={true}
                                                                    mask={'real'}
                                                                    errors={errors.total_lance}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="valor_negociado" className="form-label">Valor Negociado</Label>
                                                                <InputTextControlled<LicitacoesItensModel>
                                                                    field={"valor_negociado"}
                                                                    control={control}
                                                                    mask={'real'}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="total_negociado" className="form-label">Total Negociado</Label>
                                                                <InputTextControlled<LicitacoesItensModel>
                                                                    field={"total_negociado"}
                                                                    control={control}
                                                                    disabled={true}
                                                                    mask={'real'}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col md={12}>                                            
                                                            <div className="mb-3">
                                                                <Label htmlFor="descricao" className="form-label">Descrição Detalhada</Label>
                                                                <InputTextArea<LicitacoesItensModel>
                                                                    field={"descricao"}
                                                                    control={control}
                                                                    rows={5}
                                                                    register={register}
                                                                    errors={errors.descricao_edital}
                                                                />
                                                            </div>
                                                        </Col>
                                                    
                                                    </Row>
                                                </div>     
                                                </Row>
                                            </div>                                         
                                        </CardBody>
                                    </Card>
                                </Col>

                                <Col xxl={6}>
                                    <Card>                                
                                        <div className="card-body">
                                                                           
                                        </div>
                                    </Card>
                                </Col>
                            </Row>
                            <Col xxl={12}>
                                <Card >
                                    <CardBody>
                                        <div className="">
                                                <h4>Informações do Item</h4>
                                                <hr />
                                                <Row>
                                                    <Col lg={6}>
                                                        <h5>Informações da Plataforn</h5>
                                                        <Row>
                                                            <Col md={3}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="numero_item" className="form-label">Número Item</Label>
                                                                    {/* <InputTextControlled<LicitacoesItensModel>
                                                                        field={"numero_item"}
                                                                        control={control}
                                                                        register={register}
                                                                        required={required}
                                                                        errors={errors.numero_item}
                                                                    /> */}
                                                                    <InputNumber<LicitacoesItensModel>
                                                                            field="numero_item"
                                                                            register={register}
                                                                            required={required}                                                                        
                                                                            onlyPositive={true}
                                                                            errors={errors.numero_item}
                                                                        />
                                                                </div>
                                                            </Col>
                                                
                                                            <Col md={4}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="titulo_item" className="form-label">Título</Label>
                                                                    <InputTextControlled<LicitacoesItensModel>
                                                                        field={"titulo_item"}
                                                                        control={control}
                                                                        register={register}
                                                                        required={required}
                                                                        errors={errors.titulo_item}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col md={5}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="apelido_item" className="form-label">Apelido</Label>
                                                                    <InputTextControlled<LicitacoesItensModel>
                                                                        field={"apelido_item"}
                                                                        control={control}
                                                                        register={register}
                                                                        required={required}
                                                                        errors={errors.apelido_item}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            </Row>
                                                        <Row>                                                            
                                                            <Col md={3}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="qtd" className="form-label">Qtde Solicitada</Label>
                                                                    <InputTextControlled<LicitacoesItensModel>
                                                                        field={"qtd"}
                                                                        control={control}
                                                                        register={register}
                                                                        required={required}
                                                                        errors={errors.qtd}
                                                                    />
                                                                </div>
                                                            </Col>
                                                            <Col md={4}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="preco_teto" className="form-label">Preço Teto</Label>
                                                                    <InputTextControlled<LicitacoesItensModel>
                                                                        field={"preco_teto"}
                                                                        control={control}
                                                                        register={register}
                                                                        required={required}
                                                                        errors={errors.preco_teto}
                                                                        mask={'real'}
                                                                        />
                                                                </div>
                                                            </Col>
                                                            <Col md={4}>
                                                                <div className="mb-3">
                                                                    <Label htmlFor="total_teto" className="form-label">Total Teto</Label>
                                                                    <InputTextControlled<LicitacoesItensModel>
                                                                        field={"total_teto"}
                                                                        control={control}
                                                                        register={register}
                                                                        disabled={true}
                                                                        errors={errors.total_teto}
                                                                        mask={'real'}
                                                                        />
                                                                </div>
                                                            </Col>
                                                            <Col md={12}>                                            
                                                                <div className="mb-3">
                                                                    <Label htmlFor="descricao" className="form-label">Descrição Detalhada</Label>
                                                                    <InputTextArea<LicitacoesItensModel>
                                                                        field={"descricao"}
                                                                        control={control}
                                                                        rows={5}
                                                                        register={register}
                                                                        errors={errors.descricao}
                                                                    />
                                                                </div>
                                                            </Col>
                                                        </Row>
                                                <Row>
                                                    <div className="mt-4 mb-4">
                                                        <h4>Informações do Item - Edital</h4>
                                                        <hr />
                                                    </div>
                                                </Row>
                                                <Row>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="numero_item_edital" className="form-label">Número Item Edital</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"numero_item_edital"}
                                                                control={control}
                                                                register={register}
                                                                required={required}
                                                                errors={errors.numero_item_edital}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="valor_lance" className="form-label">Valor Lance</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"valor_lance"}
                                                                control={control}            
                                                                required={required}
                                                                mask={'real'}
                                                                errors={errors.valor_lance}                                                
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="total_lance" className="form-label">Total Lance</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"total_lance"}
                                                                control={control}                                                            
                                                                disabled={true}
                                                                mask={'real'}
                                                                errors={errors.total_lance}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={12}>                                            
                                                        <div className="mb-3">
                                                            <Label htmlFor="descricao" className="form-label">Descrição Detalhada</Label>
                                                            <InputTextArea<LicitacoesItensModel>
                                                                field={"descricao"}
                                                                control={control}
                                                                rows={5}
                                                                register={register}
                                                                errors={errors.descricao_edital}
                                                            />
                                                        </div>
                                                    </Col>

                                                </Row>
                                                </Col>
                                                    <Col lg={6}>
                                                        <h5>Informações do Item</h5>
                                                    </Col>
                                                </Row>
                                                <Row>

                                                    <div className="mt-4 mb-4">
                                                        <h4>Andamento - Edital</h4>
                                                        <hr />
                                                    </div>
                                                </Row>
                                                <Row>               
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="status_classificacao_id" className="form-label">Classificação</Label>
                                                            <SelectListControlled<LicitacoesItensModel>
                                                                options={optStatusClassificacoes}
                                                                required={required}
                                                                field={"status_classificacao_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>                                 
                               
                                                
                                                </Row>
                                                        
                                                <Row>
                            
                                                </Row>
                                                {/* <Row>
                                                <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="modalidade_id" className="form-label">Modalidade</Label>
                                                            <SelectListControlled<LicitacoesItensModel>
                                                                options={optModalidades}
                                                                required={required}
                                                                field={"modalidade_id"}
                                                                control={control}                                                            
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Label htmlFor="cliente_id" className="form-label">Clientes</Label>
                                                        <AsyncSelectListControlled<LicitacoesItensModel>
                                                            callback={getListClientes}
                                                            field={"cliente_id"}
                                                            control={control}
                                                            required={required}
                                                            className="w-100"
                                                            defaultValue={{value: licitacoesItens.cliente_id, label: `${licitacoesItens.cliente_codigo} - ${licitacoesItens.cliente_nome}`}}
                                                        />
                                                    </Col>
                                                    <Col md={2}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="exercicio" className="form-label">Exercício</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"exercicio"}
                                                                control={control}
                                                                required={required}
                                                            />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="data_limite_proposta" className="form-label">Data Limite</Label>
                                                            <InputDateTime<LicitacoesItensModel>
                                                                field={"data_limite_proposta"}
                                                                required={required}
                                                                register={register} />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="status_licitacao_id" className="form-label">Etapa</Label>
                                                            <SelectListControlled<LicitacoesItensModel>
                                                                options={optStatusLicitacoesItens}
                                                                required={required}
                                                                field={"status_licitacoesItens_id"}
                                                                control={control}                                                          
                                                                
                                                                />
                                                        </div>
                                                    </Col>
                                                    <Col md={3}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="status_compra_id" className="form-label">Status</Label>
                                                            <SelectListControlled<LicitacoesItensModel>
                                                                options={optStatusCompras}
                                                                field={"status_compra_id"}
                                                                control={control}                                                          
                                                            
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col md={12}>
                                                        <div className="mb-3">
                                                            <Label htmlFor="link_pcnp" className="form-label">Link PNCP</Label>
                                                            <InputTextControlled<LicitacoesItensModel>
                                                                field={"link_pcnp"}
                                                                control={control}
                                                                required={required}
                                                                
                                                            />
                                                        </div>
                                                    </Col>
                                                </Row> */}
                                                <hr />
                                                <Row className='mt-5'>
                                                    <Col md={12}>
                                                        <div className="hstack gap-2 justify-content-end">
                                                            <button type="submit" className="btn btn-primary">Salvar</button>
                                                            <button type="button" className="btn btn-soft-success" onClick={voltarParaRotaAnterior}>Voltar</button>
                                                        </div>
                                                    </Col>
                                                </Row>
                                        </div>
                                    </CardBody>
                                </Card>
                            </Col>
                        </form>
                    </Row>
                </Container>
            </div>
        </React.Fragment >
    );
};

export default LicitacoesItensForm;
