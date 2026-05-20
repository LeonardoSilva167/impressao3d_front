import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ajustaMoedaBanco, formatarParaMoedaSemSimbolo, sanitizeToNumber } from 'helpers/functions_helpers';
import classnames from "classnames";

import { useLocation, useNavigate } from 'react-router-dom';
import { setActiveMenu } from 'helpers/system_helpers';
import { Breadcrumb, BreadcrumbItem, Button, Card, CardBody, Col, Container, Label, Nav, NavItem, NavLink, Row, TabContent, Table, TabPane } from 'reactstrap';
import { SubmitHandler, useForm } from 'react-hook-form';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { SelectListControlled } from 'Components/ComponentController/Selects/Select/SelectListControlled';
import { SelectOptions } from 'interfaces/SystemInterfaces/SelectInterface';
import { required } from 'Components/ComponentController/ValidatorForm/ValidatorForm';
import { FormaPgto, VendaProds, VendasDefaultValues, VendasModel } from 'interfaces/Vendas/VendasInterface';
import { VendasService } from 'services/Vendas/VendasService';
import { ServicosService } from 'services/ServicosService';
import { ServicosModel } from 'interfaces/Servicos';
import { ClientesService } from 'services/Clientes';
import { ClientesModel } from 'interfaces/Clientes';
import { AsyncSelectListControlled } from 'Components/ComponentController/Selects/AsyncSelect/AsyncSelectListControlled';
import { InputNumber } from 'Components/ComponentController/Inputs/Number/InputNumber';
// import { CliestesFormModal } from 'Components/ComponentController/Modal/CliestesFormModal';
import { ServicosFormModal } from 'Components/ComponentController/Modal/ServicosFormModal';
import { AbreFechaCaixaModal } from 'Components/ComponentController/Modal/AbreFechaCaixaModal';
import { MovimentoCaixaService } from 'services/MovimentoCaixa';

export interface ServicoSelectOptions{
    value: any,
    label: string,
    preco: string,
}

const VendasForm = () => {
    // Recursos
    const { state } = useLocation()
    const navigate = useNavigate()
    const isFinalizandoRef = useRef(false);

    // Services
    const vendasService         = new VendasService();
    const servicosService       = new ServicosService();
    const clientesService       = new ClientesService();
    const movimentoCaixaService = new MovimentoCaixaService();

    // Presets
    const [vendas, setVendas]           = useState<VendasModel>(state ? state.source : VendasDefaultValues)
    const [vendaProds, setVendaprods]   = useState<VendaProds[]>(state ? state.source.vendaProds : []);
    const [formaPgto, setFormaPgto]     = useState<FormaPgto[]>(state ? state.source.formaPgto : []);
    const [totalTroco, setTotalTroco]   = useState((state ? state.source.troco : []));
    const [totalPago, setTotalPago]     = useState((state ? state.source.total : []));


    // Default
    const { register, handleSubmit, control, getValues, setValue, watch, reset, setError, clearErrors, formState: { errors, } } = useForm<VendasModel>({
        defaultValues: vendas
    })

    // Configuraçao
    const [display, setDisplay]                             = useState<boolean>(false)
    const [remoteErrors, setRemoteErrors]                   = useState<string>();
    const [modalIsOpenCliente, setModalIsOpenCliente]       = useState(false);
    const [modalIsOpen, setModalIsOpen]                     = useState(false);
    const [modalAberto, setModalAberto]                     = useState(false);
    const [modalIsOpenServico, setModalIsOpenServico]       = useState(false);
    const [disabledBloqueioValor, setDisabledBloqueioValor] = useState(true);
    const [isFinalizado, setIsFinalizado]                   = useState<any>(false);

    const [caixaAberto, setCaixaAberto] = useState<boolean | null>(null);
    const [valorAbertura, setValorAbertura] = useState(0);
    const [dadosCaixa, setDadosCaixa] = useState(null);

    // Dados
    const [optFormaPgto, setOptFormaPgto]       = useState<SelectOptions[]>([])
    const [optServicos, setOptServicos]         = useState<SelectOptions[]>([])
    const [totalProdutos, setTotalProdutos]     = useState(0);
    const [totalRestante, setTotalRestante]     = useState(0);
    const [nomeCliente, setNomeCliente]         = useState<string>('');
    const [idCliente, setIdCliente]             = useState<string>('');
    const [totalPagamentos, setTotalPagamentos] = useState(0);

    // Watchs
    const servicoWatch = watch('id_servico');
    const qtdWatch = watch('qtd');
    const precoWatch = watch('preco');
    const descontoPagamentoWatch = watch('desconto_pagamento');
    const acrescimoPagamentoWatch = watch('acrescimo_pagamento');
    const fretePagamentoWatch = watch('frete_pagamento');
    const formaPagamentoWatch = watch('id_forma_pagamento');
    
    const toggleModal = () => {
        setModalIsOpen(!modalIsOpen);
    };

    const toggleModalGeral = (tipoModal: string): void => {
        switch (tipoModal) {
            case 'cliente':
                setModalIsOpenCliente(!modalIsOpenCliente);                
                break;
            case 'servico':
                setModalIsOpenServico(!modalIsOpenServico);                
                break;
            default:
                break;
        }
    }

    const atualizaCliente = (cliente: any) => {
        setIdCliente(cliente.id_cliente)
        setNomeCliente(cliente.nome_cliente)
    }

    const handleSalvarCliente = (cliente: any) => { 
        setValue('id_cliente', cliente.id);
        setIdCliente(cliente.id)
        setNomeCliente(cliente.nome)
    };
    const handleSalvarServico = async (servicos: any) => {
        const list = await getListServicos();
      
        if (servicos) {
          setValue('id_servico', servicos.id);
        }
      };

    // totalPagamentos
    const calculaSubtotal = (): void => {
        const qtd = Number(getValues('qtd'));
        const precoUnitario = ajustaMoedaBanco(getValues('preco'));
        const subtotal = precoUnitario * qtd;
        setValue('subtotal', formatarParaMoedaSemSimbolo(subtotal));
      };

    const calculaTotalPagamentos = (): void => {
        const descontoPgto = descontoPagamentoWatch? descontoPagamentoWatch: "0";
        const acrescimoPgto = acrescimoPagamentoWatch? acrescimoPagamentoWatch: "0";
        const fretePgto = fretePagamentoWatch? fretePagamentoWatch: "0";
        const desconto = ajustaMoedaBanco(descontoPgto);
        const acrescimo = ajustaMoedaBanco(acrescimoPgto);
        const frete = ajustaMoedaBanco(fretePgto);
        const totalProdutos = vendaProds.reduce((acc, item) => {
            const valor = parseFloat(item.subtotal ?item.subtotal: '0');
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        const totalFinal = totalProdutos + acrescimo + frete - desconto;
        setTotalPagamentos(totalFinal);
    };

    const calculaTotalRestante = (): void => {
        const totalFormaPgto = formaPgto.reduce((acc, item) => {
            return acc + sanitizeToNumber(item.valor_pagamento);
          }, 0);
        setTotalPago(totalFormaPgto);
        let totalPgto = (totalPagamentos - totalFormaPgto) + totalTroco;
        setTotalRestante(totalPgto)
      };


    const adicionarForma = () => {

        const valor_pagamento = ajustaMoedaBanco(getValues("valor_pagamento"));
        if (!formaPgtoSelecionada || !valor_pagamento) return;
        
        const novaForma = {
            id_forma_pagamento: formaPgtoSelecionada.value,
            nome_forma_pagamento: formaPgtoSelecionada.label,
            valor_pagamento,
        };
        
        setFormaPgto((prev) => [...prev, novaForma]);
        resetFormas();
    };
    const calcularTroco = (troco: any) => {
        setTotalTroco("0")
        if(troco){
            setTotalTroco(troco)
        }
    };
    const adicionarItem = () => {
        const qtd = Number(getValues("qtd"));
        const preco_un = ajustaMoedaBanco(getValues("preco"));
        const subtotal = ajustaMoedaBanco(getValues("subtotal"));
        

        if (!servicoSelecionado || !qtd || !preco_un) return;
        
        const novoItem = {
            id_servico: servicoSelecionado.value,
            nome_servico: servicoSelecionado.label,
            qtd,
            descricao: servicoSelecionado.descricao,
            preco_un,
            subtotal,
        };
        setVendaprods((prev) => [...prev, novoItem]);
        resetItens();
       
    };

    const removerItem = (index: number) => {
        setVendaprods((prev) => prev.filter((_, i) => i !== index));
    };

    const removerForma = (index: number) => {
        setFormaPgto((prev) => prev.filter((_, i) => i !== index));
    };
    
    const resetItens = (): void => {
        setValue("id_servico", null);
        setValue("qtd", null);
        setValue("preco", "0");
        setValue("subtotal", "0");
        setRemoteErrors("")
    };
    const resetFormas = (): void => {
        setValue("id_forma_pagamento", null);
        setValue("valor_pagamento", "0");
    };

    const getLookupsVendas = async (): Promise<void> => {
        const lookups = await vendasService.getLookupsVendas()
        if (lookups) {
            let formaPagamento = new Array
            lookups.formaPagamentos.map(item => { formaPagamento.push({ value: item.id, label: item.descricao }) })
            setOptFormaPgto(formaPagamento)
        }
    }            
    
    
    const getListServicos = async (): Promise<SelectOptions[]> => {
        const listServicos = await servicosService.AsyncListServicos({})
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listServicos && listServicos.map((item: ServicosModel) => {
            opt.push({ 
                value: item.id, 
                label: `${item.nome} --- ${formatarParaMoedaSemSimbolo(item.preco)}`, 
                preco: item.preco, 
                descricao: item.descricao, 
            })
        });
        setOptServicos(opt)
    }

    const getListClientes = async (inputValue: string): Promise<SelectOptions[]> => {
        const listCliente = await clientesService.AsyncListClientes({ palavra_chave: inputValue })
        let opt = new Array
        opt.push({ value: '', label: 'Selecione' })

        listCliente && listCliente.map((item: ClientesModel) => {
            opt.push({ value: item.id, label: item.nome })
        });
        return opt
    }
    

    const onSubmit: SubmitHandler<VendasModel> = async (data: any) => {
        try {
            const estaAberto = await verificarCaixa();
            if (estaAberto) {

                let liberaVenda = false
                data.finalizado = isFinalizandoRef.current
                
                let cliente = getValues('id_cliente');

                setRemoteErrors("")
                if(!cliente){
                    setRemoteErrors("Para salvar a venda, é necessário adicionar ao menos um cliente.");
                }else if(totalProdutos === 0){
                    setRemoteErrors("Para salvar a venda, é necessário adicionar ao menos um serviço.");
                }else{
                    liberaVenda = true
                }
                if(liberaVenda){
                        data.acrescimo_pagamento    = ajustaMoedaBanco(data.acrescimo_pagamento);
                        data.desconto_pagamento     = ajustaMoedaBanco(data.desconto_pagamento);
                        data.frete_pagamento        = ajustaMoedaBanco(data.frete_pagamento);
                        data.subtotal_pagamento     = totalProdutos;
                        data.total_pagamento        = totalPagamentos;
                        data.troco_pagamento        = totalTroco;
                        data.venda_prods            = vendaProds;
                        data.forma_pgtos            = formaPgto;
                        
                    if (vendas.id_venda) {
                        await vendasService.editVendas(data);
                    } else {
                        const id = await vendasService.createVendas(data);
                        setValue('id', id);
                    }
                    
                    navigate(`/vendas`);
                }
            }
        } catch (error: any) {
            throw error;
        }
    };

    useEffect(() => {
        setTimeout(() => {
            setDisplay(true)
        }, 300);
    }, [])

    
    const servicoSelecionado: any  = useMemo(() => {
        if (!servicoWatch || !optServicos) return undefined;
        return optServicos.find(item => item.value === servicoWatch);
    }, [optServicos, servicoWatch]);
    
    const formaPgtoSelecionada: any  = useMemo(() => {
        if (!formaPagamentoWatch || !optFormaPgto) return undefined;
        return optFormaPgto.find(item => item.value === formaPagamentoWatch);
    }, [optFormaPgto, formaPagamentoWatch]);

    useEffect(() => {
        if (servicoSelecionado && servicoSelecionado.preco){
            setValue(`qtd`, 1);
            setValue(`preco`, formatarParaMoedaSemSimbolo(servicoSelecionado.preco));
        }else{
            setValue(`qtd`, 0);
            setValue(`preco`, '0');
        }
        calculaSubtotal();
    }, [servicoSelecionado ]);

    useEffect(() => {
        if(!qtdWatch){
            setValue(`qtd`, 0);
        }
        
        calculaSubtotal();
    }, [precoWatch,qtdWatch  ]);

    
    useEffect(() => {
        const total = vendaProds.reduce((acc, item) => {
            const valor = parseFloat(item.subtotal ?item.subtotal: '0');
            return acc + (isNaN(valor) ? 0 : valor);
        }, 0);
        
        setTotalProdutos(total);
        if(total){
            setTimeout(() => {
                calculaTotalPagamentos();                
                setDisabledBloqueioValor(false)
            }, 0);
        }
    }, [vendaProds]);
  
    useEffect(() => {
        calculaTotalPagamentos()
    }, [descontoPagamentoWatch, acrescimoPagamentoWatch, fretePagamentoWatch]);

    useEffect(() => {
        if (totalPagamentos || totalProdutos  ) {
            const totalPago = formaPgto.reduce((acc, item) => {
                return acc + sanitizeToNumber(item.valor_pagamento);
              }, 0);

            const troco = totalPago - totalPagamentos;
            setTotalTroco(troco > 0 ? troco : 0);
            calculaTotalRestante();

        } else {
            setTotalTroco(0);

        }

    }, [formaPgto, totalProdutos, totalPagamentos]);
     


    useEffect(() => {
        calculaTotalRestante();
   
    }, [totalTroco])

    useEffect(() => {
        if(!disabledBloqueioValor){
            setRemoteErrors("");
        }
    }, [disabledBloqueioValor])


    useEffect(() => {
        getLookupsVendas();
        getListServicos();
    }, [])

    useLayoutEffect(() => {
        if(vendas){
            atualizaCliente(vendas)
            setIsFinalizado(vendas.finalizado)
        }
    }, [vendas])

    // Seta o menu lateral
    useEffect(() => {
        setActiveMenu('/Vendas')
    }, [])

    const [topBorderTab, settopBorderTab] = useState<string>("1");
    const topBordertoggle = (tab : any) => {
        if (topBorderTab !== tab) {
            settopBorderTab(tab);
        }
    };
    const getCaixaStatus = async (): Promise<void> => {
        const status = await movimentoCaixaService.caixaStatus({});
        return status;
      };

    //   const verificarCaixa = async () => {
    //     const estaAberto = await getCaixaStatus();
    //     setCaixaAberto(estaAberto); // <-- armazena o status atual
    //     setModalAberto(true);       // <-- abre sempre que clicar no botão
    //   };
      
    // useEffect(() => {
    //     verificarCaixa();
    //   }, []);
    // const verificarCaixa = async () => {
    //     const estaAberto = await getCaixaStatus();
    //     setCaixaAberto(estaAberto);
    //     setModalAberto(true); // abre sempre que o botão for clicado
    //   };
    const verificarCaixa = async (): Promise<boolean> => {
        const estaAberto = await getCaixaStatus();
        setCaixaAberto(estaAberto);
        setModalAberto(true);
        return estaAberto;
      };

    useEffect(() => {
        const verificarAberturaInicial = async () => {
          const estaAberto = await getCaixaStatus();
          setCaixaAberto(estaAberto);
      
          if (!estaAberto) {
            setModalAberto(true); // abre automaticamente se estiver fechado
          }
        };
      
        verificarAberturaInicial();
      }, []);


    const onError = (errors: any) => {
        const camposComErro = Object.keys(errors);
        if (camposComErro.includes("id_cliente")) {
          setRemoteErrors("Para salvar a venda, é necessário adicionar ao menos um cliente.");
        }
      };

    useEffect(() => {
        
    }, []);

    // useEffect(() => {
    //     setModalAberto(true);
    //   }, []);

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <div className="page-title-box d-sm-flex align-items-center justify-content-between">
                                <div className="d-flex align-items-center">
                                    <Link to="/vendas" className="me-2">
                                        <i className="bx bx-arrow-back bx-sm"></i>
                                    </Link>
                                    <h4 className="mb-sm-0 ms-3">{`${vendas.id_venda? 'Editar' : 'Adicionar'}` } Venda</h4>
                                </div>
                                <Breadcrumb pageTitle="Adicionar Contas Bancarias" listClassName='mb-sm-0 pt-1 py-2'>
                                    <BreadcrumbItem> <Link to="/dashboard"> <i className="ri-home-5-fill"></i> </Link> </BreadcrumbItem>
                                    <BreadcrumbItem> <Link to="/vendas"> Vendas </Link> </BreadcrumbItem>
                                    <BreadcrumbItem active> {`${vendas.id_venda? 'Editar' : 'Adicionar'}` } Venda </BreadcrumbItem>
                                </Breadcrumb>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                    
                        <Col xs={12}>
                            <div className="d-flex flex-row justify-content-end align-items-center mb-4" >
                                <div className="mt-3 mt-lg-0">
                                    <div className="col-auto">
                                    <Button
                                        className="bg-dark"
                                        disabled={!caixaAberto} // desabilita se o caixa estiver fechado
                                        onClick={() => verificarCaixa()}
                                        >
                                        <i className="bx bx-lock"></i> Fechar Caixa
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col xxl={12}>
                            <Card >
                                {/* <Nav tabs className="nav nav-tabs nav-justified nav-border-top nav-border-top-primary mb-3"> */}
                                <Nav pills className="nav-justified nav-success  mb-3">
                                    <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={`${classnames({ active: topBorderTab === "1" })} fs-4`}
                                            onClick={() => topBordertoggle("1")}
                                        >
                                            <span className="d-block d-md-inline"><i className="ri-shopping-cart-fill align-middle me-1"></i> 1 - </span>
                                            <span className="d-block d-md-inline">Venda</span>
                                        </NavLink>
                                        </NavItem>

                                        <NavItem>
                                        <NavLink
                                            style={{ cursor: "pointer" }}
                                            className={`${classnames({ active: topBorderTab === "2" })} fs-4`}
                                            onClick={() => topBordertoggle("2")}
                                        >
                                            <span className="d-block d-md-inline"><i className="ri-currency-fill me-1 align-middle"></i> 2 - </span>
                                            <span className="d-block d-md-inline">Pagamento</span>
                                        </NavLink>
                                    </NavItem>

                                </Nav>
                                <CardBody>
                                    <div className="">
                                        <form onSubmit={handleSubmit(onSubmit, onError)}>
                                            <TabContent activeTab={topBorderTab} className="text-muted">
                                                <Col md={12}>
                                                <div className='mb-3 text-center'>
                                                    {/* <span className={`text-center fs-5 badge bg-${vendas.finalizado ? 'dark' : 'primary'}`}>{`${vendas.finalizado ? 'Finalizada' : 'Aberta'}`}</span> */}
                                                </div>
                                                </Col>

                                                <TabPane tabId="1" id="nav-border-justified-home">
                                                    <Row>
                                                        <Col xs={9} md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="id_cliente" className="form-label">Cliente</Label>
                                                                <AsyncSelectListControlled<VendasModel>
                                                                    callback={getListClientes}
                                                                    key={idCliente + nomeCliente}
                                                                    field={"id_cliente"}
                                                                    control={control}
                                                                    required={required} 
                                                                    className="w-100"
                                                                    defaultValue={idCliente ? { value: idCliente, label: nomeCliente } : undefined}
                                                                    errors={errors.id_cliente}
                                                                />


                                                            </div>
                                                        </Col> 
                                                        <Col xs={3} md={1} className="d-flex align-items-center" style={{paddingLeft: '0px', marginTop: '3px'}}>
                                                            <div>
                                                                <button type="button" className="btn btn-primary mt-2" 
                                                                    onClick={() => {
                                                                        toggleModalGeral('cliente');
                                                                    }}>
                                                                    <i className="ri-add-circle-line align-middle me-1"></i>Add
                                                                </button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <hr />
                                                    <Row className='mt-3'>
                                                        <Col xs={9} md={4}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="id_servico" className="form-label">Serviço</Label>
                                                                <SelectListControlled<VendasModel>
                                                                    options={optServicos}                                                                    
                                                                    field={"id_servico"}
                                                                    control={control}
                                                                    
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col xs={2} md={1} className="d-flex align-items-center" style={{paddingLeft: '0px', marginTop: '3px'}}>
                                                            <div>
                                                                <button type="button" className="btn btn-primary mt-2" 
                                                                onClick={() => {
                                                                    toggleModalGeral('servico');
                                                                }}>
                                                                    <i className="ri-add-circle-line align-middle me-1"></i>Add
                                                                </button>
                                                            </div>
                                                        </Col>
                                                        <Col xs={6} md={2}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="qtd" className="form-label">Qtd.</Label>
                                                                <InputNumber<VendasModel>
                                                                    field="qtd"
                                                                    register={register}                                                                                                                                           
                                                                    onlyPositive={true}
                                                                    errors={errors.qtd}
                                                                    
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col xs={6}  md={2}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="preco" className="form-label">Valor</Label>
                                                                <InputTextControlled<VendasModel>
                                                                    field={"preco"}
                                                                    control={control}
                                                                    mask='real'
                                                                    type="tel"
                                                                    placeholder="0,00"
                                                                    onlyPositive={true}
                                                                    errors={errors.preco}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col xs={9} md={2}>
                                                            <div className="mb-3">
                                                                <Label htmlFor="subtotal" className="form-label">Subtotal</Label>
                                                                <InputTextControlled<VendasModel>
                                                                    field={"subtotal"}
                                                                    placeholder="0,00"
                                                                    control={control}
                                                                    mask='real'
                                                                    disabled={true}
                                                                />
                                                            </div>
                                                        </Col>
                                                        <Col xs={2} md={1} className="d-flex align-items-center">
                                                            <div>
                                                                <Button type="button" className="btn btn-primary mt-2" onClick={adicionarItem}>
                                                                    <i className="las la-plus align-middle me-1 fs-3"></i>
                                                                </Button>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                    <Row className='mt-5'>
                                                        <Col md={12}>
                                                            <div className="table-responsive">
                                                                <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                                                                    <thead>
                                                                        <tr className="table-active">
                                                                            <th scope="col" style={{ width: "50px" }}>#</th>
                                                                            <th scope="col">Serviço</th>
                                                                            <th scope="col">Qtd</th>
                                                                            <th scope="col" className="text-end">Preço</th>
                                                                            <th scope="col" className="text-end">Subtotal</th>
                                                                            <th></th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody id="products-list">
                                                                        {vendaProds.map((item, index) => (
                                                                            <tr key={index}>
                                                                                <th scope="row">{index+1}</th>
                                                                                <td className="text-start">
                                                                                    <span className="fw-medium">{item.nome_servico}</span>
                                                                                    <p className="text-muted mb-0">{item.descricao}</p>
                                                                                </td>
                                                                                <td>
                                                                                    {item.qtd}
                                                                                </td>
                                                                                <td className="text-end">
                                                                                    {formatarParaMoedaSemSimbolo(item.preco_un)}
                                                                                </td>
                                                                                <td className="text-end">
                                                                                    {formatarParaMoedaSemSimbolo(item.subtotal)}
                                                                                </td>
                                                                                <td className="text-end">
                                                                                    <button type="button" className="btn btn-sm btn-danger" onClick={() => removerItem(index)}>
                                                                                        <i className="las la-trash-alt"></i>
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                
                                                                </tbody>
                                                                </Table>
                                                            </div>
                                                            <div className='text-center fs-4 mt-3'>
                                                                <strong>Subtotal: R$ {formatarParaMoedaSemSimbolo(totalProdutos)}</strong>
                                                            </div>
                                                        </Col>                            
                                                    </Row>
                                                    <Row className='mt-5'>
                                                        <Col md={12}>
                                                            <div className="d-flex flex-row row mt-3">
                                                                {remoteErrors && <div className="text-danger font-weight-bold pe-2">{remoteErrors}</div>}
                                                            </div>
                                                        </Col>                                                    
                                                        <Col md={12}>
                                                            <div className="position-relative w-100 mt-3">
                                                                <div className="d-flex justify-content-center gap-2">
                                                                    <Button 
                                                                        type="button"
                                                                        className="btn btn-success"
                                                                        onClick={() => topBordertoggle("2")}
                                                                    >Pagamento <i className="ri-arrow-right-line "></i></Button>
                                                                    {/* <Button type="submit" className="btn btn-primary"
                                                                        // onClick={() => setIsFinalizado(false)}
                                                                        onClick={() => isFinalizandoRef.current = false}
                                                                    >Apenas Salvar</Button> */}
                                                                </div>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                                <TabPane tabId="2" id="nav-border-justified-profile">
                                                    <Row className=''>
                                                        <Col lg={6}>       
                                                            <Row className=''>
                                                                <Col xs={6}  md={4}>
                                                                    <div className="mb-3">
                                                                        <Label htmlFor="desconto_pagamento" className="form-label">Desconto</Label>
                                                                        <InputTextControlled<VendasModel>
                                                                            field={"desconto_pagamento"}
                                                                            control={control}
                                                                            mask='real'
                                                                            type="tel"
                                                                            placeholder="0,00"
                                                                            onlyPositive={true}
                                                                            disabled={disabledBloqueioValor}
                                                                            errors={errors.desconto_pagamento}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={6} md={4}>
                                                                    <div className="mb-3">
                                                                        <Label htmlFor="acrescimo_pagamento" className="form-label">Acréscimo</Label>
                                                                        <InputTextControlled<VendasModel>
                                                                            field={"acrescimo_pagamento"}
                                                                            control={control}
                                                                            mask='real'
                                                                            type="tel"
                                                                            placeholder="0,00"
                                                                            onlyPositive={true}
                                                                            disabled={disabledBloqueioValor}
                                                                            errors={errors.acrescimo_pagamento}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={6}  md={4}>
                                                                    <div className="mb-3">
                                                                        <Label htmlFor="frete_pagamento" className="form-label">Frete</Label>
                                                                        <InputTextControlled<VendasModel>
                                                                            field={"frete_pagamento"}
                                                                            control={control}
                                                                            mask='real'
                                                                            type="tel"
                                                                            placeholder="0,00"
                                                                            onlyPositive={true}
                                                                            disabled={disabledBloqueioValor}
                                                                            errors={errors.frete_pagamento}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                            </Row>        
                                                            <Row className='text-center mb-4 mt-4'>
                                                                <Col md={1}></Col>
                                                                <Col xs={6}  md={5}>
                                                                    <div className="mb-3 border">
                                                                        <h4 className="text-muted">Subtotal: 
                                                                            <br />
                                                                            <span className="fw-medium text-dark mt-4`" id="">R$ {formatarParaMoedaSemSimbolo(totalProdutos)}</span>  
                                                                        </h4>     
                                                                    </div>
                                                                </Col>
                                                                <Col xs={6}  md={5}>
                                                                    <div className="mb-3">
                                                                        <h4 className={` ${totalPagamentos < 0 ? ' text-danger' : 'text-muted'}`}>Total:
                                                                            <br />
                                                                            <span className={`fw-medium ${totalPagamentos < 0 ? ' text-danger' : 'text-dark'}`} id="">R$ {formatarParaMoedaSemSimbolo(totalPagamentos)}</span>
                                                                        </h4>     
                                                                    </div>
                                                                </Col>
                                                                <Col md={1}></Col>
                                                            </Row>
                                                            <Row className='text-center mb-4 mt-4'>
                                                                <Col md={1}></Col>
                                                                <Col xs={6}  md={5}>
                                                                    <div className="mb-3">
                                                                        <h4 className="text-muted">Troco: 
                                                                            <br />
                                                                            <span className="fw-medium text-dark mt-4" id="">R$ {formatarParaMoedaSemSimbolo(totalTroco)}</span>  
                                                                        </h4>     
                                                                    </div>
                                                                </Col>
                                                                <Col xs={6}  md={5}>
                                                                    <div className="mb-3">
                                                                        <h4 className="text-muted">Total Restante:
                                                                            <br />
                                                                            <span className="fw-medium text-dark" id="">R$ {formatarParaMoedaSemSimbolo(totalRestante)}</span>
                                                                        </h4>     
                                                                    </div>
                                                                </Col>
                                                                <Col md={1}></Col>
                                                            </Row>
                                                        </Col>    
                                                        <Col lg={6}>  
                                                            <Row className=''>
                                                                <Col md={6}>
                                                                    <div className="mb-3">
                                                                        <Label htmlFor="id_forma_pagamento" className="form-label">Forma Pagamento</Label>
                                                                        <SelectListControlled<VendasModel>
                                                                            options={optFormaPgto}
                                                                            field={"id_forma_pagamento"}
                                                                            control={control}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={9} md={4}>
                                                                    <div className="mb-3">
                                                                        <Label htmlFor="valor_pagamento" className="form-label">Valor</Label>
                                                                        <InputTextControlled<VendasModel>
                                                                            field={"valor_pagamento"}
                                                                            defaultValue={totalProdutos}
                                                                            control={control}
                                                                            mask='real'
                                                                            type="tel"
                                                                            placeholder="0,00"
                                                                            onlyPositive={true}
                                                                            disabled={disabledBloqueioValor}
                                                                            errors={errors.valor_pagamento}
                                                                        />
                                                                    </div>
                                                                </Col>
                                                                <Col xs={3} md={2} className="d-flex align-items-center">
                                                                    <div>
                                                                        <button type="button" className="btn btn-primary mt-2" onClick={adicionarForma}>
                                                                            <i className="las la-plus align-middle me-1 fs-3"></i>
                                                                        </button>
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                            <Row className=''>
                                                                <Col md={12}>
                                                                    <div className="table-responsive mt-4 ">
                                                                        <Table className="table-borderless text-center table-nowrap align-middle mb-0">
                                                                            <thead>
                                                                                <tr className="table-active">
                                                                                    <th scope="col" style={{ width: "50px" }}>#</th>
                                                                                    <th scope="col">Forma</th>
                                                                                    <th scope="col" className="text-end">Valor</th>
                                                                                    <th></th>
                                                                                </tr>
                                                                            </thead>
                                                                            <tbody id="products-list">
                                                                                {formaPgto.map((item, index) => (
                                                                                    <tr key={index}>
                                                                                        <th scope="row">{index+1}</th>
                                                                                        <td className="text-center">
                                                                                            <span className="fw-medium">{item.nome_forma_pagamento}</span>
                                                                                        </td>
                                                                                        <td className="text-end">
                                                                                            {formatarParaMoedaSemSimbolo(item.valor_pagamento)}
                                                                                        </td>
                                                                                        <td className="text-end">
                                                                                            <button type="button" className="btn btn-sm btn-danger" onClick={() => removerForma(index)}>
                                                                                                <i className="las la-trash-alt"></i>
                                                                                            </button>
                                                                                        </td>
                                                                                    </tr>
                                                                                ))}
                                                                        
                                                                            </tbody>
                                                                        </Table>
                                                                    </div>
                                                                    <div className='text-center fs-4 mt-3'>
                                                                        <strong>Total Recebido: R$ {formatarParaMoedaSemSimbolo(totalPago)}</strong>
                                                                    </div>
                                                                </Col>                          
                                                            </Row>
                                                        </Col>   
                                                    </Row>
                                                     <hr />                           
                                                    <Row className='mt-5'>
                                                        <Table className="table table-borderless table-nowrap align-middle mb-0 ms-auto" style={{ width: "250px" }}>
                                                            <tbody>
                                                            <tr>
                                                                <td>Subtotal</td>
                                                                <td className="text-end">R$ {formatarParaMoedaSemSimbolo(totalProdutos)}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Desconto 
                                                                    {/* <small className="text-muted">(VELZON15)</small> */}
                                                                </td>
                                                                <td className="text-end">- R$ {formatarParaMoedaSemSimbolo(ajustaMoedaBanco(getValues('desconto_pagamento')))}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Acréscimo 
                                                                    {/* <small className="text-muted">(12.5%)</small> */}
                                                                </td>
                                                                <td className="text-end">R$ {formatarParaMoedaSemSimbolo(ajustaMoedaBanco(getValues('acrescimo_pagamento')))}</td>
                                                            </tr>
                                                            <tr>
                                                                <td>Frete</td>
                                                                <td className="text-end">R$ {formatarParaMoedaSemSimbolo(ajustaMoedaBanco(getValues('frete_pagamento')))}</td>
                                                            </tr>
                                                            <tr className="border-top border-top-dashed fs-15">
                                                                <th scope="row">Total</th>
                                                                <th className="text-end">R$ {formatarParaMoedaSemSimbolo(totalPagamentos)}</th>
                                                            </tr>
                                                            </tbody>
                                                        </Table>
                                                    </Row>
                                                    <hr />
                                                    <Row>
                                                        <Col md={12}>
                                                            <div className="d-flex flex-row row mt-3">
                                                                {remoteErrors && <div className="text-danger font-weight-bold pe-2">{remoteErrors}</div>}
                                                            </div>
                                                        </Col>                                                    
                                                        <Col md={12} className="mt-3">
                                                            {/* Layout para telas md em diante */}
                                                            <div className="d-none d-md-flex justify-content-center gap-2 position-relative">
                                                                <Button 
                                                                    type="button"
                                                                    className="btn btn-success"
                                                                    onClick={() => topBordertoggle("1")}
                                                                ><i className="ri-arrow-left-line"></i> Venda
                                                                </Button>

                                                                {/* <Button 
                                                                    type="submit" 
                                                                    className="btn btn-primary"
                                                                    onClick={() => isFinalizandoRef.current = false}
                                                                >Apenas Salvar
                                                                </Button> */}
                                                                 <button 
                                                                    type="submit" 
                                                                    className="btn btn-primary position-absolute"
                                                                    style={{ right: 0 }}
                                                                    onClick={() => isFinalizandoRef.current = true}
                                                                >Finalizar
                                                                </button>

                                                                {/* {!isFinalizado && (
                                                                <button 
                                                                    type="submit" 
                                                                    className="btn btn-primary position-absolute fs-4"
                                                                    style={{ right: 0 }}
                                                                    onClick={() => isFinalizandoRef.current = true}
                                                                >Finalizar
                                                                </button>
                                                                )} */}
                                                            </div>

                                                            {/* Layout para mobile (xs até sm) */}
                                                            <div className="d-md-none">
                                                                <Row className="g-2">
                                                                    <Col xs={6}>
                                                                        <Button 
                                                                        type="button"
                                                                        className="btn btn-success w-100"
                                                                        onClick={() => topBordertoggle("1")}
                                                                        >
                                                                        <i className="ri-arrow-left-line"></i> Venda
                                                                        </Button>
                                                                    </Col>
                                                                    <Col xs={6}>
                                                                        {/* <Button 
                                                                        type="submit" 
                                                                        className="btn btn-primary w-100"
                                                                        onClick={() => isFinalizandoRef.current = false}
                                                                        >
                                                                        Apenas Salvar
                                                                        </Button> */}
                                                                         <button 
                                                                            type="submit" 
                                                                            className="btn btn-primary w-100"
                                                                            onClick={() => isFinalizandoRef.current = true}
                                                                        >
                                                                            Finalizar
                                                                        </button>
                                                                        
                                                                    </Col>
                                                                    {!isFinalizado && (
                                                                        <Col xs={12}>
                                                                        {/* <button 
                                                                            type="submit" 
                                                                            className="btn btn-primary w-100 fs-4"
                                                                            onClick={() => isFinalizandoRef.current = true}
                                                                        >
                                                                            Finalizar
                                                                        </button> */}
                                                                    </Col>
                                                                    )}
                                                                </Row>
                                                            </div>
                                                        </Col>
                                                    </Row>
                                                </TabPane>
                                            </TabContent>
                                        </form>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>                      
                    {/* <CliestesFormModal
                        isOpen={modalIsOpenCliente}
                        toggle={() => toggleModalGeral('cliente')} 
                        onSave={handleSalvarCliente}
                    /> */}
                    <ServicosFormModal
                        isOpen={modalIsOpenServico}
                        toggle={() => toggleModalGeral('servico')} 
                        onSave={handleSalvarServico}
                    />
                    <AbreFechaCaixaModal
                    isOpen={modalAberto}
                    toggle={() => setModalAberto(!modalAberto)}
                    onSave={(dadosCaixa) => {
                        console.log("Caixa atualizado:", dadosCaixa);
                        setCaixaAberto(!caixaAberto)
                    }}
                    statusInicialCaixa={caixaAberto ? true : false}
                    />
                </Container>
            </div>
        </React.Fragment >
    );
};

export default VendasForm;
