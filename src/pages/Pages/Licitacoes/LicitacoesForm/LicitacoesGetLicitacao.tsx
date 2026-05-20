import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ajustaMoedaBanco, AnosSelect, diasMesSelect, formatCpfCnpj, formatDateTimeBR, mesesSelect, numberFormat, UFEstadosSelect, useNavegacao, validarDiaMes } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled';
import { DefaultUnidadeCompradoraOption, LicitacoesDefaultValues, LicitacoesModel } from 'interfaces/Licitacoes';
import { LicitacoesService } from 'services/Licitacoes/LicitacoesService';
import { ClientesModel } from 'interfaces/Clientes/ClientesInterface';
import { ClientesService } from 'services/Clientes/ClientesService';
import { InputDateTime } from 'Components/ComponentController/Inputs/Date/InputDateTime';
import { ContasBancariasModel } from 'interfaces/ContasBancarias/ContasBancariasInterface';
import { OrgaoService } from 'services/OrgaoService';
import { PcnpService } from 'services/PncpService';

const LicitacoesGetLicitacao = () => {
    const { state } = useLocation()

    // const [licitacoes, setLicitacoes] = useState<LicitacoesModel>(state ? state.source : LicitacoesDefaultValues)
    const [licitacoes, setLicitacoes] = useState<LicitacoesModel>(state ? state.source : LicitacoesDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<LicitacoesModel>({
        defaultValues: licitacoes
    })
    const [display, setDisplay] = useState<boolean>(false)
    const { voltarParaRotaAnterior } = useNavegacao();
    const location = useLocation();
    const navigate = useNavigate()
    const licitacoesService = new LicitacoesService();
    const clientesService = new ClientesService();
    const servicePncp = new PcnpService();
    const serviceOrgao = new OrgaoService();

    const [optModalidades, setOptModalidades] = useState<SelectOptions[]>([])
    const [optStatusLicitacoes, setOptStatusLicitacoes] = useState<SelectOptions[]>([])
    const [optStatusCompras, setOptStatusCompras] = useState<SelectOptions[]>([])


    const [pncpData, setPncpData] = useState<any>([]);
    // const [defaultUnidadeCompradora, setDefaultUnidadeCompradora] = useState<DefaultUnidadeCompradoraOption | null>(null);





    const getLookupsLicitacoes = async (): Promise<void> => {
        const lookups = await licitacoesService.getLookupsLicitacoes()

        if (lookups) {
            let modalidade = new Array
            lookups.modalidades.map(item => { modalidade.push({ value: item.id, label: item.nome }) })
            setOptModalidades(modalidade)

            let statusLicitacoes = new Array
            lookups.statusLicitacoes.map(item => { statusLicitacoes.push({ value: item.id, label: item.nome }) })
            setOptStatusLicitacoes(statusLicitacoes)

            let statusCompras = new Array
            lookups.statusCompras.map(item => { statusCompras.push({ value: item.id, label: item.nome }) })
            setOptStatusCompras(statusCompras)
        }
    }

    // const getListUnidadesCompradoras = async (inputValue: string): Promise<SelectOptions[]> => {
    //     const listClientes = await serviceOrgao.AsyncListUnidadeCompradora({ palavra_chave: inputValue })
    //     let opt = new Array
    //     opt.push({ value: '', label: 'Selecione' })

    //     listClientes && listClientes.map((item: ClientesModel) => {
    //         opt.push({ value: item.id, label: `${item.codigo} - ${item.nome}` })
    //     });

    //     return opt
    // }

    const handleBuscarPncp = async (e: any) => {
        e.preventDefault();
        const link_compra = getValues('link_pcnp');


        const listPncp = await servicePncp.getCompraPcnp({ link: link_compra })
        let modalidade_id = listPncp.modalidade.modalidadeId == '8' ? 1 : listPncp.modalidade.modalidadeId == '6' ? 2 : null
        // setValue('num_compra', listPncp.compra.numeroCompra)
        // setValue('exercicio', listPncp.compra.anoCompra)
        // setValue('data_limite_proposta', listPncp.datas.fim_recebimento_propostas)
        const dataFormatada = listPncp.datas.fim_recebimento_propostas
            .slice(0, 16); // remove os :ss

        // setValue('data_limite_proposta', dataFormatada);


        // console.log(listPncp.datas.fim_recebimento_propostas)

        if (listPncp.unidade_compradora) {
            const unidade_compradora = {
                value: null,
                label: `${listPncp.unidade_compradora.codigo} - ${listPncp.unidade_compradora.nome} - ${listPncp.unidade_compradora.cidade}/${listPncp.unidade_compradora.uf}`,
            };
            const orgao = {
                value: null,
                label: `${listPncp.orgao.nome} - ${formatCpfCnpj(listPncp.orgao.cnpj)}`,
                // label: `${listPncp.orgao.nome} ${listPncp.orgao.cnpj}`,
            };


            // // Atualiza o React Hook Form
            // setValue('unidade_compradoras_id', option, {
            //     shouldDirty: false,
            //     shouldTouch: false,
            //     shouldValidate: false,
            // });

            // Se quiser manter no estado também (opcional)




            setPncpData({
                modalidade_id: modalidade_id,
                num_compra: listPncp.compra.numeroCompra,
                exercicio: listPncp.compra.anoCompra,
                data_limite_proposta: dataFormatada,
                status_licitacoes_id: listPncp.proposta.status_licitacoes_id,
                status_compra_id: listPncp.proposta.status_compra_id,
                proposta_id: listPncp.proposta.id,
                link_pcnp: listPncp.proposta.link_pcnp,
                orgaos_id: listPncp.proposta.orgaos_id ? listPncp.proposta.orgaos_id : null,
                orgaos_cnpj: listPncp.orgao.cnpj,
                orgaos_nome: listPncp.orgao.nome,
                orgaos_label: orgao.label,
                unidade_compradoras_id: listPncp.proposta.unidade_compradoras_id ? listPncp.proposta.unidade_compradoras_id : null,
                unidade_compradoras_codigo: listPncp.unidade_compradora.codigo,
                unidade_compradoras_nome: listPncp.unidade_compradora.nome,
                unidade_compradoras_uf: listPncp.unidade_compradora.uf,
                unidade_compradoras_cidade: listPncp.unidade_compradora.cidade,
                unidade_compradoras_label: unidade_compradora.label,
            });





        }
    }



    const onSubmit: SubmitHandler<LicitacoesModel> = async (data: any) => {
        try {
            data.data_limite_proposta = new Date(data.data_limite_proposta).toISOString()

            if (licitacoes.licitacao_id) {
                await licitacoesService.editLicitacoes(data);
            } else {
                const id = await licitacoesService.createLicitacoes(data);
                setValue('id', id);
            }

            navigate(`/Licitacoes`);
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
        getLookupsLicitacoes()
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/licitacoes')

    }, [])

    useEffect(() => {
        setValue('num_compra', pncpData.num_compra)
        setValue('modalidade_id', pncpData.modalidade_id)
        setValue('data_limite_proposta', pncpData.data_limite_proposta)
        setValue('orgaos_id', pncpData.orgaos_id)
        setValue('orgaos_nome', pncpData.orgaos_nome)
        setValue('orgaos_cnpj', pncpData.orgaos_cnpj)
        setValue('unidade_compradoras_id', pncpData.unidade_compradoras_id)
        setValue('unidade_compradoras_codigo', pncpData.unidade_compradoras_codigo)
        setValue('unidade_compradoras_nome', pncpData.unidade_compradoras_nome)
        setValue('unidade_compradoras_cidade', pncpData.unidade_compradoras_cidade)
        setValue('unidade_compradoras_uf', pncpData.unidade_compradoras_uf)
        
    }, [pncpData])


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <Link to="/licitacoes"> <i className="bx bx-arrow-back bx-sm"></i> </Link>
                                    <h4 className="mb-sm-0 ms-3">Adicionar Licitacões</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Contas Bancarias" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/licitacoes"> Licitacões </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Licitacões </BreadcrumbItem>
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
                                                {/* <Col md={10}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="link_pcnp" className="form-label">Link PNCP</Label>
                                                        <InputTextControlled<LicitacoesModel>
                                                            field={"link_pcnp"}
                                                            control={control}
                                                            required={required}

                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={10}>
                                                <div className="mb-3"> */}
                                                <Col md={12}>
                                                    <div className="mb-3">
                                                        <div className="input-group">
                                                            <InputTextControlled<LicitacoesModel>
                                                                field={"link_pcnp"}
                                                                control={control}
                                                                required={required}
                                                                placeholder="https://pncp.gov.br/app/editais/..."
                                                            />
                                                            <button
                                                                onClick={(e) => handleBuscarPncp(e)}
                                                                className="btn btn-success" type="submit" id="button-addon2"><i className="ri-search-line align-middle me-1"></i> Buscar Licitação</button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <hr className='mb-3 mt-3' />
                                            <Row>
                                                <Col md={3}>

                                                    <div className="mb-3">
                                                        <Label htmlFor="modalidade_id" className="form-label">Modalidade:</Label>
                                                        <span className='ms-1'>
                                                            {/* {optModalidades.find(opt => opt.value === pncpData.modalidade_id).label : ""} */}
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col md={3}>

                                                    <div className="mb-3">
                                                        <Label htmlFor="num_compra" className="form-label">Número da Compra:</Label>
                                                        <span className='ms-1'>
                                                            {pncpData.num_compra && pncpData.exercicio
                                                                ? `${pncpData.num_compra}/${pncpData.exercicio}`
                                                                : ""}
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col md={3}>

                                                    <div className="mb-3">
                                                        <Label htmlFor="data_limite_proposta" className="form-label">Data Limite</Label>
                                                        <span className='ms-1'>
                                                            {pncpData.data_limite_proposta ? `${formatDateTimeBR(pncpData.data_limite_proposta)}` : ""}
                                                        </span>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>

                                                <Col md={6}>

                                                    <div className="mb-3">
                                                        <Label htmlFor="unidade_compradoras_id" className="form-label">Orgão:</Label>
                                                        <span className='ms-1'>
                                                            {pncpData.orgaos_label}
                                                        </span>
                                                    </div>
                                                </Col>
                                                <Col md={6}>

                                                    <div className="mb-3">
                                                        <Label htmlFor="unidade_compradoras_id" className="form-label">Unidade Compradora:</Label>
                                                        <span className='ms-1'>
                                                            {pncpData.unidade_compradoras_nome}
                                                        </span>
                                                    </div>
                                                </Col>
                                                {/* <div>

                                                    {defaultUnidadeCompradora &&
                                                        defaultUnidadeCompradora.unidade_compradoras_nome}
                                                </div>
                                                <Col md={6}>
                                                    <Label htmlFor="unidade_compradoras_id" className="form-label">Unidade Compradora</Label>
                                                    <AsyncSelectListControlled<LicitacoesModel>
                                                        callback={getListUnidadesCompradoras}
                                                        field={"unidade_compradoras_id"}
                                                        control={control}
                                                        required={required}
                                                        className="w-100"
                                                        defaultValue={{ value: licitacoes.unidade_compradoras_id, label: `${licitacoes.unidade_compradoras_id} - ${licitacoes.unidade_compradoras_nome}` }}
                                                    />
                                                </Col>

                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="num_compra" className="form-label">Número da Compra</Label>
                                                        <InputTextControlled<LicitacoesModel>
                                                            field={"num_compra"}
                                                            control={control}
                                                            required={required}
                                                            placeholder="000000"
                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={2}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="exercicio" className="form-label">Exercício</Label>
                                                        <InputTextControlled<LicitacoesModel>
                                                            field={"exercicio"}
                                                            control={control}
                                                            required={required}
                                                        />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="data_limite_proposta" className="form-label">Data Limite</Label>
                                                        <InputDateTime<LicitacoesModel>
                                                            field={"data_limite_proposta"}
                                                            required={required}
                                                            register={register} />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status_licitacao_id" className="form-label">Etapa</Label>
                                                        <SelectListControlled<LicitacoesModel>
                                                            options={optStatusLicitacoes}
                                                            required={required}
                                                            field={"status_licitacoes_id"}
                                                            control={control}

                                                        />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="status_compra_id" className="form-label">Status</Label>
                                                        <SelectListControlled<LicitacoesModel>
                                                            options={optStatusCompras}
                                                            field={"status_compra_id"}
                                                            control={control}

                                                        />
                                                    </div>
                                                </Col> */}
                                            </Row>

                                            {/* <hr /> */}
                                            <Row className='mt-5'>
                                                <Col md={12}>
                                                    <div className="hstack gap-2 justify-content-end">
                                                        {pncpData.proposta_id ? (
                                                            <Link
                                                                className='btn btn-warning'
                                                                to={`/licitacoes/edit/${pncpData.proposta_id}`}
                                                                state={{ source: pncpData }}
                                                            >
                                                                Ir para Licitação
                                                            </Link>
                                                        ) : (
                                                            pncpData.num_compra && (
                                                                <button type="submit" className="btn btn-primary">
                                                                    Cadastrar Licitação
                                                                </button>
                                                            )
                                                        )}
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

export default LicitacoesGetLicitacao;
