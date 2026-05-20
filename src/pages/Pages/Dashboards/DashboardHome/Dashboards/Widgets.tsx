// import { ecomWidgets } from 'common/data';
import { formatarParaMoedaSemSimbolo } from 'helpers/functions_helpers';
import React, { useEffect, useState } from 'react';
import CountUp from "react-countup";
import { Link } from 'react-router-dom';
import { Card, CardBody, Col } from 'reactstrap';
import { DashboardsService } from 'services/Dashboards';

const defaultWidgets = [
    {
        id: 1,
        cardColor: "primary",
        label: "Total lucro",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        percentage: "0",
        counter: 0,
        link: "Ver lucro líquido",
        route: "/fluxo-caixa",
        bgcolor: "success",
        icon: "bx bx-dollar-circle",
        decimals: 2,
        decimal: ",",
        prefix: "R$",
        separator: ",",
        suffix: ""
    },
    {
        id: 2,
        cardColor: "secondary",
        label: "Serviços",
        badge: "ri-arrow-right-down-line",
        badgeClass: "danger",
        percentage: "0",
        counter: 0,
        link: "Ver todos os serviços",
        route: "/fluxo-caixa",
        bgcolor: "info",
        icon: "bx bx-shopping-bag",
        decimals: 0,
        prefix: "",
        separator: ",",
        suffix: ""
    },
    {
        id: 3,
        cardColor: "success",
        label: "Clientes",
        badge: "ri-arrow-right-up-line",
        badgeClass: "success",
        percentage: "0",
        counter: 0,
        link: "Ver detalhes",
        route: "/clientes",
        bgcolor: "warning",
        icon: "bx bx-user-circle",
        decimals: 0,        
        prefix: "",
        suffix: ""
    },
    {
        id: 4,
        cardColor: "info",
        label: "Ticket Médio",
        badgeClass: "muted",
        percentage: "0",
        counter: 0,
        link: "Ver detalhes",
        route: "/fluxo-caixa",
        bgcolor: "primary",
        icon: "bx bx-wallet",
        decimals: 2,
        decimal: ",",
        prefix: "R$",
        suffix: ""
    },
];


export interface WidgetsProps {
    range: Date[]; 
}

const Widgets = ({range}: WidgetsProps) => {

    const dashboardsService = new DashboardsService();
    const [widgetsData, setWidgetsData] = useState(defaultWidgets);

    useEffect(() => {
        if (!range || range.length < 2) return;

        const [start, end] = range;

        const fetchWidgets = async () => {
            try {
                const dadosAPI = await dashboardsService.listWidgetsDashboards({
                    start_date: start.toISOString().split('T')[0],
                    end_date: end.toISOString().split('T')[0]
                });

                const atualizados = defaultWidgets.map(widget => {
                    const dado = dadosAPI.find(d => d.id === widget.id);
                    
                    return dado
                        ? {
                            ...widget,
                            counter: widget.suffix == "k" ? dado.counter / 1000 : dado.counter,
                            percentage: `${dado.percentage > 0 ? '+' : ''}${dado.percentage}`,
                            badgeClass: dado.percentage > 0 ? 'success' : (dado.percentage < 0 ? 'danger' : 'muted'),
                            badge: dado.percentage > 0
                                ? 'ri-arrow-right-up-line'
                                : (dado.percentage < 0 ? 'ri-arrow-right-down-line' : ''),
                        }
                        : widget;
                });

                setWidgetsData(atualizados);
            } catch (error) {
                console.error('Erro ao buscar widgets:', error);
            }
        };

        fetchWidgets();
    }, [range]);
    

    return (
        <React.Fragment>
            {widgetsData.map((item) => (
                <Col xl={3} md={6} key={item.id}>
                    <Card className="card-animate">
                        <CardBody>
                            <div className="d-flex align-items-center">
                                <div className="flex-grow-1 overflow-hidden">
                                    <p className="text-uppercase fw-medium text-muted text-truncate mb-0">{item.label}</p>
                                </div>
                                <div className="flex-shrink-0">
                                    <h5 className={`fs-14 mb-0 text-${item.badgeClass}`}>
                                        {item.badge && <i className={`fs-13 align-middle ${item.badge}`}></i>} {item.percentage} %
                                    </h5>
                                </div>
                            </div>
                            <div className="d-flex align-items-end justify-content-between mt-4">
                                <div>
                                    <h4 className="fs-22 fw-semibold ff-secondary mb-4">
                                        <CountUp
                                            start={0}
                                            prefix={item.prefix}
                                            suffix={item.suffix}
                                            separator={item.separator}
                                            end={item.counter}
                                            decimals={item.decimals}
                                            decimal={item.decimal}
                                            duration={2}
                                        />
                                    </h4>
                                    <Link to={item.route} className="text-decoration-underline">{item.link}</Link>
                                </div>
                                <div className="avatar-sm flex-shrink-0">
                                    <span className={`avatar-title rounded fs-3 bg-${item.bgcolor}-subtle`}>
                                        <i className={`text-${item.bgcolor} ${item.icon}`}></i>
                                    </span>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            ))}
        </React.Fragment>
    );
};

export default Widgets;