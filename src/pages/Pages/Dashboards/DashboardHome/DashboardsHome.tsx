import BestSellingProducts from "pages/DashboardEcommerce/BestSellingProducts";
import RecentActivity from "pages/DashboardEcommerce/RecentActivity";
import Revenue from "pages/DashboardEcommerce/Revenue";
import Section from "pages/DashboardEcommerce/Section";
import TopSellers from "pages/DashboardEcommerce/TopSellers";
import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import Widgets from "./Dashboards/Widgets";
import HeaderDash from "./Dashboards/HeaderDash";
import FinanceiroReceita from "./Dashboards/Financeiro/FinanceiroReceita";
import RankingServicosDash from "./Dashboards/RankingServicosDash";
import RetornoClientesDash from "./Dashboards/RetornoClientesDash";

const DashboardsHome = () => {
  // document.title = "Dashboard | Velzon - React Admin & Dashboard Template";

  const [rightColumn, setRightColumn] = useState<boolean>(true);
  const toggleRightColumn = () => {
    setRightColumn(!rightColumn);
  };

  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);


  const [range, setRange] = useState([firstDay, today]);

  useEffect(() => {
    if(range){
      console.log(range)
    }
  }, [range])
  

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col>
              <div className="h-100">
                <HeaderDash rightClickBtn={toggleRightColumn} range={range} setRange={setRange} />
                <Row>
                  <Widgets range={range} />
                </Row>
                <Row>
                  <Col xl={12}>
                    <FinanceiroReceita range={range}/>
                  </Col>
                  {/* <SalesByLocations /> */}
                </Row>
                <Row>
                  <RankingServicosDash range={range} />
                  <RetornoClientesDash range={range} />
                </Row>
                {/* <Row>
                  <StoreVisits />
                  <RecentOrders />
                </Row> */}
              </div>
            </Col>
            {/* <RecentActivity rightColumn={rightColumn} hideRightColumn={toggleRightColumn} /> */}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default DashboardsHome;
