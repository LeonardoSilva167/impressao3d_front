import React, { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useNavegacao } from 'helpers/functions_helpers'; // Importe o hook personalizado


import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { UsuarioDefaultValues, UsuarioModel, UsuarioSearch } from 'interfaces/UsuarioInterface';
import { Breadcrumb, BreadcrumbItem, Card, CardBody, Col, Container, Label, Row } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { UsuarioService } from 'services/UsuarioService';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { InputDate } from 'Components/ComponentController/Inputs/Date/InputDate';
import { InputCheckbox } from 'Components/ComponentController/Inputs/Checkbox/InputCheckbox';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import ButtonToTop from 'Components/ComponentController/Buttons/ButtonToTop/ButtonToTop';
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled';
import { LancamentosModel } from 'interfaces/Lancamentos';
const UsuarioForm = () => {
    const { state } = useLocation()
    const [usuario, setProjeto] = useState<UsuarioModel>(state ? state.source : UsuarioDefaultValues)
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<UsuarioModel>({
        defaultValues: usuario
    })

    // Botão voltar
    const { voltarParaRotaAnterior } = useNavegacao();
    const [display, setDisplay] = useState<boolean>(false)
    const location = useLocation();
    const navigate = useNavigate()
    const parentRoute = location.pathname.split('/').slice(1, -1).join('/');
    const usuarioService = new UsuarioService()

    const optSexo: SelectOptions[] = [
        { value: 1, label: 'Feminino' },
        { value: 2, label: 'Masculino' },
        { value: 3, label: 'Outros' }
    ]


    const onSubmit: SubmitHandler<UsuarioModel> = async data => {
        try {
            if (usuario.id) {
                await usuarioService.editUsuario(data)
            } else {
                const id = await usuarioService.createUsuario(data)
                setValue('id', id)
            }
            navigate(`/usuarios/${getValues('id')}`)

        } catch (error: any) {
            throw error
        }

    };
    const getListDespesas = async (inputValue: string): Promise<SelectOptions[]> => {
        const listDespesas = await despesasService.AsyncListDespesass({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listDespesas && listDespesas.map((item: DespesasModel) => {
            let nome = `${item.nome}`

            opt.push({
                value: item.id,
                // label: item.nome 
                label:
                    (item.nome ? item.nome : '')
                // +
                // (item.matricula_laticinio ? ' | ' + item.matricula_laticinio : '') +
                // (item.nome_propriedade_rural ? ' | ' + item.nome_propriedade_rural : '') +
                // (item.nome_cidade ? ' | ' + item.nome_cidade : '') +
                // (item.sigla_uf ? ' | ' + item.sigla_uf : '') +
                // (item.nome_laticinio ? ' | ' + item.nome_laticinio : '')

            })
        });

        return opt
    }

    const geraLancamentoDespesa = async (): Promise<void> => {
        try {
            const despesa = await despesasService.getViewDespesas({ id: watchDespesas });
            let qtd_parcela = Number(despesa.qtd_parcela);
            let valor = Number(despesa.valor);
            const valor_parcela = Number(despesa.valor_parcela);
            // const valor_parcela = parseFloat(despesa.valor_parcela) / 100; 
            valor = qtd_parcela * valor_parcela;

            switch (Number(despesa.recorrencia_status_id)) {
                case 1:
                    break;
                case 3:
                    qtd_parcela = 12;
                    valor = qtd_parcela * Number(despesa.valor_parcela);
                    break;
                default:
                    break;
            }

            const acrescimo = 0;
            const desconto = 0;
            const subtotal = valor;
            const total = subtotal + acrescimo - desconto;

            // setValue('qtd_total_parcela', qtd_parcela.toString());
            // setValue('valor_parcela', valor_parcela.toString());
            // setValue('valor', valor.toString());
            // setValue('acrescimo', acrescimo.toString());
            // setValue('desconto', desconto.toString());
            // setValue('subtotal', subtotal.toString());
            // setValue('total', total.toString());



            // setLancamentos((prev) => ({
            //     ...prev,
            //     qtd_total_parcela: qtd_parcela.toString(),
            //     valor_parcela: valor_parcela.toString(),
            //     valor: valor.toString(),
            //     acrescimo: acrescimo.toString(),
            //     desconto: desconto.toString(),
            //     subtotal: subtotal.toString(),
            //     total: total.toString(),
            // }));
        } catch (error) {
            console.error('Erro ao gerar lançamento de despesa:', error);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/usuarios')
    }, [])

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <Link to="/usuarios"> <i className="bx bx-arrow-back bx-sm"></i> </Link>
                                    <h4 className="mb-sm-0 ms-3">Adicionar Usuário</h4>
                                </div>
                                <Breadcrumb pageTitle="" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/usuarios"> Usuários </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> Adicionar Usuário </BreadcrumbItem>
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
                                            <Row >
                                                <Col md={12} className='d-flex flex-row justify-content-end align-items-center'>
                                                    <div className="form-check form-switch form-switch-md mb-3 form-check-right mb-2">
                                                        <Label className="me-3" htmlFor="ativo">Ativo</Label>
                                                        <InputCheckbox<UsuarioModel> field='ativo' register={register} role="switch" />
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={7}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="qtd_parcela" className="form-label">Despesas</Label>
                                                        <div className="" style={{ display: 'flex', width: '100%' }}>
                                                            <div style={{ flex: 1 }}>
                                                                <AsyncSelectListControlled<LancamentosModel>
                                                                    callback={getListDespesas}
                                                                    field={"despesa_id"}
                                                                    control={control}
                                                                    className="w-100"
                                                                />
                                                            </div>
                                                            <button
                                                                onClick={(e) => geraLancamentoDespesa()}
                                                                className="btn btn-success" type="button" id="button-addon2">
                                                                <i className="ri-search-line align-middle me-1"></i> Buscar
                                                            </button>
                                                        </div>
                                                    </div>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={4}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="nome" className="form-label">Nome</Label>
                                                        <InputTextControlled<UsuarioModel> field={"nome"} control={control} placeholder="Nome" />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="nascimento" className="form-label">Nacimento</Label>
                                                        <InputDate<UsuarioModel> field={"nascimento"} register={register} />
                                                    </div>
                                                </Col>
                                                <Col md={3}>
                                                    <div className="mb-3">
                                                        <Label htmlFor="sexo" className="form-label">Sexo</Label>
                                                        <SelectListControlled<UsuarioModel> options={optSexo} field={"sexo"} control={control} />
                                                    </div>
                                                </Col>
                                            </Row>

                                            <br />
                                            <Row>
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
        </React.Fragment>
    );
};

export default UsuarioForm;
