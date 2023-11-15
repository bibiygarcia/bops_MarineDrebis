import { useField } from 'uniforms';
import { SelectField, TextField } from 'uniforms-bootstrap5';
import React from 'react';
import PropTypes from 'prop-types';

const DetailProtocolField = ({ protocolValue, name }) => {
  const fieldProps = useField(name, {})[0];

  const protocolNames = {
    1: 'Measure and Dispose',
    2: 'Four Corners',
    3: 'One of All',
    4: 'Hybrid',
    5: 'Disentanglement',
    6: 'Reverse Engineer',
  };

  const options = Object.keys(protocolNames).map(key => ({
    label: protocolNames[key],
    value: parseInt(key, 10),
  }));

  return (protocolValue !== null && protocolValue !== undefined) || fieldProps.value
    ? <SelectField name={name} options={options} onChange={v => fieldProps.onChange(v)} value={fieldProps.value} />
    : <TextField name={name} value="The event does not have samples yet." disabled />;
};

DetailProtocolField.propTypes = {
  protocolValue: PropTypes.number,
  name: PropTypes.string.isRequired,
};

DetailProtocolField.defaultProps = {
  protocolValue: 0,
};

export default DetailProtocolField;
