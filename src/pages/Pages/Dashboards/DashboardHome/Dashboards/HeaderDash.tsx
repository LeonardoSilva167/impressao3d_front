import React, { useEffect, useState } from 'react';
import { Button, Col, Row } from 'reactstrap';
import Flatpickr from "react-flatpickr";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";
import "flatpickr/dist/themes/material_blue.css";





export interface HeaderDashProps {
    rightClickBtn: () => void
    range: Date[]; 
    setRange: (value: Date[]) => void
}

const HeaderDash = ({ rightClickBtn,  range, setRange }: HeaderDashProps) => {
    useEffect(() => {
        if (typeof rightClickBtn === 'function') {
          rightClickBtn(false); // chama a função com false ao montar o componente
        }
      }, []);

    const today = new Date();
    const setHoje = () => {
        setRange([today, today]);
      };
      
      const setSemana = () => {
        const start = new Date(today);
        start.setDate(today.getDate() - 6);
        setRange([start, today]);
      };
      
      const setMes = () => {
        const first = new Date(today.getFullYear(), today.getMonth(), 1);
        setRange([first, today]);
      };
      const setAno = () => {
        const first = new Date(today.getFullYear(), 0, 1); // 1º de janeiro do ano atual
        setRange([first, today]); // até o dia atual
      };
    return (
        <React.Fragment>
             <Row className="mb-3 pb-1">
                <Col xs={12}>
                    <div className="d-flex align-items-lg-center flex-lg-row flex-column">
                    <div className="flex-grow-1">
                        <h4 className="fs-16 mb-1">Bom Dia, Will!</h4>
                        <p className="text-muted mb-0">Veja o que está acontecendo com sua loja hoje..</p>
                    </div>
                    <div className="mt-3 mt-lg-0">
                        <form action="#">
                            <Row className="g-3 mb-0 align-items-center">
                                <div className="col-auto">
                                    <Button color="info" size="sm" onClick={setHoje}>Hoje</Button>{' '}
                                    <Button color="info" size="sm" onClick={setSemana}>Semana</Button>{' '}
                                    <Button color="info" size="sm" onClick={setMes}>Mês</Button>{' '}
                                    <Button color="info" size="sm" onClick={setAno}>Ano</Button>
                                </div>
                                <div className="col-sm-auto">
                                    
                                    <div className="input-group">
                                        <Flatpickr
                                        className="form-control border-0 dash-filter-picker shadow"
                                        options={{
                                            mode: "range",
                                            dateFormat: "d/m/Y",
                                            locale: Portuguese
                                        }}
                                        value={range}
                                        onChange={setRange}
                                        />
                                        <div className="input-group-text bg-primary border-primary text-white">
                                        <i className="ri-calendar-2-line"></i>
                                        </div>
                                    </div>
                                </div>
                            </Row>
                            {/* <Row>
                                <div className="col-auto flex-end">
                                    <p>Periodo anterior</p>
                                </div>
                            </Row> */}
                        </form>
                    </div>
                    </div>
                </Col>
                </Row>
        </React.Fragment>
    );
};

export default HeaderDash;