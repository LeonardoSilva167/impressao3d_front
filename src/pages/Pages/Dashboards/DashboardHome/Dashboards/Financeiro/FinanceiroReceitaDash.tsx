import { formatarParaMoedaSemSimbolo, getChartColorsArray } from "helpers/functions_helpers";
import React, { useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { format, eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';


const FinanceiroReceitaDash = ({ dataColors, series, range, modo  } : any) => {

  
  const gerarCategorias = (start: Date, end: Date, modo: 'dia' | 'semana' | 'mes') => {
    if (modo === 'dia') {
      return eachDayOfInterval({ start, end }).map(date =>
        format(date, 'dd/MM', { locale: ptBR })
      );
    }
  
    if (modo === 'semana') {
      return eachWeekOfInterval({ start, end }).map((_, i) => `Semana ${i + 1}`);
    }
  
    return eachMonthOfInterval({ start, end }).map(date =>
      format(date, 'MMM', { locale: ptBR })
    );
  };
  
  
  const categorias = useMemo(() => {
    if (!range || range.length < 2) return [];
    const [start, end] = range;
    return gerarCategorias(start, end, modo);
  }, [range, modo]);

  // const categorias = gerarCategorias(range[0], range[1], modo);
  const linechartcustomerColors = getChartColorsArray(dataColors);
  // var linechartcustomerColors = getChartColorsArray(dataColors);

  var options : any = {
    chart: {
      height: 370,
      type: "line",
      toolbar: {
        show: false,
      },
    },
    stroke: {
      curve: "straight",
      dashArray: [0, 0, 8],
      width: [2, 0, 2.2],
    },
    fill: {
      opacity: [0.1, 0.9, 1],
    },
    markers: {
      size: [0, 0, 0],
      strokeWidth: 2,
      hover: {
        size: 4,
      },
    },
    xaxis: {
      categories: categorias,
      axisTicks: {
        show: false,
      },
      axisBorder: {
        show: false,
      },
    },
    grid: {
      show: true,
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: false,
        },
      },
      padding: {
        top: 0,
        right: -2,
        bottom: 15,
        left: 10,
      },
    },
    legend: {
      show: true,
      horizontalAlign: "center",
      offsetX: 0,
      offsetY: -5,
      markers: {
        width: 9,
        height: 9,
        radius: 6,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 0,
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "30%",
        barHeight: "70%",
      },
    },
    colors: linechartcustomerColors,
    tooltip: {
      shared: true,
      y: [
        {
          formatter: function (y : any) {
            if (typeof y !== "undefined") {
              return "R$ " + formatarParaMoedaSemSimbolo(y) + "";
            }
            return y;
          },
        },
        {
          formatter: function (y : any) {
            if (typeof y !== "undefined") {
              return "R$ " + formatarParaMoedaSemSimbolo(y) + "";
            }
            return y;
          },
        },
        {
          formatter: function (y : any) {
            if (typeof y !== "undefined") {
              return "R$ " + formatarParaMoedaSemSimbolo(y) + "";
            }
            return y;
          },
        },
      ],
    },
  };
  
  return (
    <React.Fragment>
      <ReactApexChart dir="ltr"
        options={options}
        series={series}
        type="line"
        height="370"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

const StoreVisitsCharts = ({ dataColors } : any) => {
  var chartDonutBasicColors = getChartColorsArray(dataColors);
  const series = [44, 55, 41, 17, 15];
  var options : any = {
    labels: ["Direct", "Social", "Email", "Other", "Referrals"],
    chart: {
      height: 333,
      type: "donut",
    },
    legend: {
      position: "bottom",
    },
    stroke: {
      show: false,
    },
    dataLabels: {
      dropShadow: {
        enabled: false,
      },
    },
    colors: chartDonutBasicColors,
  };
  return (
    <React.Fragment>
      <ReactApexChart dir="ltr"
        options={options}
        series={series}
        type="donut"
        height="333"
        className="apex-charts"
      />
    </React.Fragment>
  );
};

export { FinanceiroReceitaDash, StoreVisitsCharts };
