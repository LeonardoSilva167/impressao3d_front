// // Components/Clientes/ClientesFormPartial.tsx
// import { CaixaModel } from 'interfaces/MovimentoCaixa/MovimentoCaixaInterface';
// import React, { useEffect, useState } from 'react';
// import { Control, useForm, UseFormRegister } from 'react-hook-form';
// import { Button, Col, Row } from 'reactstrap';

// interface CaixaFormPartialProps {
//   register: UseFormRegister<CaixaModel>;
//   caixaAberto: boolean;
// }

// export const CaixaFormPartialAlterar: React.FC<CaixaFormPartialProps> = ({ register, caixaAberto }) => {
//   return (
//     <>
//       <Row className="text-center mt-3">
//         {caixaAberto ? (
//           <>
//             <p>Tem certeza que deseja fechar o caixa?</p>
//             <textarea className="form-control" placeholder="Observação (opcional)" {...register("observacao")} />
//             <Button color="primary" type="submit" className="mt-3">Fechar Caixa</Button>
            
//           </>
//         ) : (
//           <>
//             <p>Caixa fechado. Deseja abrir?</p>
//             <Button color="success" type="submit" className="mt-3">Abrir Caixa</Button>
//           </>
//         )}
//       </Row>
//     </>
//   );
// };


