// Components/Clientes/ClientesFormPartial.tsx
import React from 'react';
import { Control } from 'react-hook-form';
import { ClientesModel } from 'interfaces/Clientes/ClientesInterface';
import { Row, Col, Label } from 'reactstrap';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';

interface ClientesFormPartialProps {
  control: Control<ClientesModel>;
}

export const ClientesFormPartialAlterarr: React.FC<ClientesFormPartialProps> = ({ control }) => {
  return (
    <>
      <Row>
        {/* <Col xs={12} md={7} lg={5}> */}
        <Col xs={12} md={7} sm={5}>
          <div className="mb-3">
            <Label htmlFor="nome" className="form-label">Nome</Label>
            <InputTextControlled<ClientesModel>
              field="nome"
              control={control}
            />
          </div>
        </Col>
        {/* <Col xs={12} md={5} xl={3}> */}
        <Col xs={12} sm={5} >
          <div className="mb-3">
            <Label htmlFor="telefone" className="form-label">Celular</Label>
            <InputTextControlled<ClientesModel>
              field="telefone"
              control={control}
              mask="tel"
            />
          </div>
        </Col>
      </Row>
    </>
  );
};
