import React, { useState, useEffect } from "react";
import { Card, CardBody, CardHeader, Col, Row } from "reactstrap";
import CountUp from "react-countup";
import { useSelector, useDispatch } from "react-redux";
// import { RevenueCharts } from "./DashboardEcommerceCharts";
// import { getRevenueChartsData } from "../../slices/thunks";
import { createSelector } from "reselect";
import { FinanceiroReceitaDash } from "./FinanceiroReceitaDash";
import { DashboardsService } from "services/Dashboards";

const defaultWidgets = [
  {
      id: 1,
      label: "Lucro Bruto",
      start: 0,
      counter: 0,
      decimals: 2,
      decimal: ",",
      bgcolor: "",
      prefix: "R$",
      suffix: "",
  },
  {
      id: 2,
      label: "Despesas",
      start: 0,
      counter: 0,
      decimals: 2,
      decimal: ",",
      bgcolor: "",
      prefix: "R$",
      suffix: "",

  },
  {
      id: 3,
      label: "Lucro Líquido",
      start: 0,
      counter: 0,
      decimals: 2,
      decimal: ",",
      bgcolor: "",
      prefix: "R$",
      suffix: "",
  },
  {
      id: 4,
      label: "Margem de Lucro",
      start: 0,
      counter: 0,
      decimals: 2,
      decimal: ",",
      bgcolor: "success",
      prefix: "",
      suffix: "%",
  },
]

export interface FinanceiroReceitaProps {
  range: Date[]; 
}
const FinanceiroReceita = ({range}: FinanceiroReceitaProps) => {
  
  const dashboardsService = new DashboardsService();

  const dispatch:any = useDispatch();
  const [chartData, setchartData] = useState<any>([]);
  const [widgetsData, setWidgetsData] = useState(defaultWidgets);
  
useEffect(() => {
  if (!range || range.length < 2) return;

  const [start, end] = range;

  const fetchWidgets = async () => {
      try {
          const dadosAPI = await dashboardsService.listFinanceiroReceitaDashboards({
              start_date: start.toISOString().split('T')[0],
              end_date: end.toISOString().split('T')[0]
          });

          const atualizados = defaultWidgets.map(widget => {
              const dado = dadosAPI.widgetDash.find(d => d.id === widget.id);
              return dado
                  ? {
                      ...widget,
                      counter: widget.suffix == "k" ? dado.counter / 1000 : dado.counter,
                  }
                  : widget;
          });
          setWidgetsData(atualizados);
          setchartData(dadosAPI.dash);
      } catch (error) {
          console.error('Erro ao buscar widgets:', error);
      }
  };

  fetchWidgets();
}, [range]);

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="border-0 align-items-center d-flex">
          <h4 className="card-title mb-0 flex-grow-1">Receita</h4>
          <div className="d-flex gap-1">
            {/* <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("all"); }}>
              ALL
            </button>
            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("month"); }}>
              1M
            </button>
            <button type="button" className="btn btn-soft-secondary btn-sm" onClick={() => { onChangeChartPeriod("halfyear"); }}>
              6M
            </button>
            <button type="button" className="btn btn-soft-primary btn-sm" onClick={() => { onChangeChartPeriod("year"); }}>
              1Y
            </button> */}
          </div>
        </CardHeader>

        <CardHeader className="p-0 border-0 bg-light-subtle">
          <Row className="g-0 text-center">
          {widgetsData.map((item) => (
            <Col xs={6} sm={3}>
              <div className="p-3 border border-dashed border-start-0">
                <h5 className={`mb-1 text-${item.bgcolor}`}>
                  <CountUp
                      start={0}
                      end={item.counter}
                      duration={2}
                      suffix={item.suffix}
                      decimals={item.decimals}
                      decimal={item.decimal}
                      prefix={item.prefix}
                  />
                </h5>
                <p className="text-muted mb-0">{item.label}</p>
              </div>
            </Col>
          ))}
          </Row>
        </CardHeader>
        <CardBody className="p-0 pb-2">
          <div className="w-100">
            <div dir="ltr">
              <FinanceiroReceitaDash series={chartData} dataColors='["--vz-primary", "--vz-success", "--vz-danger"]' range={range} // vindo do HeaderDash
              modo="mes"/>
            </div>
          </div>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default FinanceiroReceita;
