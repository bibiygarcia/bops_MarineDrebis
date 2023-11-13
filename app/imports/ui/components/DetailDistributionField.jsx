import { useField } from 'uniforms';
import { SelectField, TextField } from 'uniforms-bootstrap5';
import React from 'react';
import PropTypes from 'prop-types';

const DetailDistributionField = ({ distributionValue, name }) => {
  const fieldProps = useField(name, {})[0];

  const distributionTypes = {
    1: 'Recycled',
    2: 'Reused',
    3: 'Turned into power',
  };

  const options = Object.keys(distributionTypes).map(key => ({
    label: distributionTypes[key],
    value: parseInt(key, 10),
  }));

  return (distributionValue !== null && distributionValue !== undefined) || fieldProps.value
    ? <SelectField name={name} options={options} onChange={v => fieldProps.onChange(v)} value={fieldProps.value} />
    : <TextField name={name} value="The event has not been distributed." disabled />;
};

DetailDistributionField.propTypes = {
  distributionValue: PropTypes.number,
  name: PropTypes.string.isRequired,
};

DetailDistributionField.defaultProps = {
  distributionValue: 0,
};

export default DetailDistributionField;
