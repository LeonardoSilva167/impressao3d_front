import React from 'react';
import { Control } from 'react-hook-form';
import { Row, Col, Label } from 'reactstrap';
import { InputTextControlled } from 'Components/ComponentController/Inputs/Text/InputTextControlled';
import { ServicosModel } from 'interfaces/Servicos';
import { InputTextArea } from 'Components/ComponentController/Inputs/Text/InputTextArea';

interface ServicosFormPartialProps {
    control: Control<ServicosModel>;
    errors: any;
    register: any;
  }
  
  export const ServicosFormPartial: React.FC<ServicosFormPartialProps> = ({ control, errors, register }) => {
    return (
      <>    
        <Row>
          <Col md={4}>
            <div className="mb-3">
              <Label htmlFor="nome" className="form-label">Nome</Label>
              <InputTextControlled<ServicosModel>
                field="nome"
                control={control}
                errors={errors.nome}
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <Label htmlFor="preco" className="form-label">Preço</Label>
              <InputTextControlled<ServicosModel>
                field="preco"
                control={control}
                mask="real"
                type="tel"
                placeholder="0,00"
                onlyPositive={true}
                errors={errors.preco}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <div className="mb-3">
              <Label htmlFor="descricao" className="form-label">Descrição</Label>
              <InputTextArea<ServicosModel>
                field="descricao"
                control={control}
                rows={3}
                register={register}
                errors={errors.descricao}
              />
            </div>
          </Col>
        </Row>
      </>
    );
  };
  