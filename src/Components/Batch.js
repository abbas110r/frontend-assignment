import React from 'react';
import '../CSS/Batch.css';
function Batch(props) {
  return (
    <tr className="scale">
      <td>{props.name}</td>
      <td>{props.batch}</td>
      <td>{props.stock}</td>
      <td> {props.deal}</td>
      <td>{props.free}</td>
      <td>{props.mrp}</td>
      <td>{props.rate}</td>
      <td>{props.exp}</td>
    </tr>
  );
}
export default Batch;
