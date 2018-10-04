import React from "react";
import "./style.css";

export default class HorizontalFields extends React.Component {
  constructor(props) {
    super(props);

    this.state = { ...props.formData };
  }

  onChange = (name, value) => {
    this.setState({ [name]: value }, () => this.props.onChange(this.state));
  };

  requiredProperty(key) {
    if (!this.props.schema.required) {
      return false;
    }
    return this.props.schema.required.indexOf(key) >= 0;
  }

  renderLabel(schemaKey, property) {
    if (this.requiredProperty(schemaKey)) {
      return (
        <label htmlFor={schemaKey} data-test={`${schemaKey}-label`}>
          {property.title} *
        </label>
      );
    }

    return (
      <label htmlFor={schemaKey} data-test={`${schemaKey}-label`}>
        {property.title}
      </label>
    );
  }

  renderSelect = (propertyName, schema) => (
    <select
      onChange={e => this.onChange(propertyName, e.target.value)}
      value={this.state[propertyName] || schema.default}
      data-test={`${propertyName}-input`}
    >
      {schema.enum.map(optionValue => (
        <option key={optionValue}>{optionValue}</option>
      ))}
    </select>
  );

  renderItem = (k, v) => {
    if (v.type === "string" && v.enum) {
      return this.renderSelect(k, v)
    } else {
      return (
        <input
          id={k}
          disabled={v.readonly}
          data-test={`${k}-input`}
          value={this.state[k]}
          onChange={e => this.onChange(k, e.target.value)}
        />
      );
    }
  };

  renderItems = () =>
    Object.entries(this.props.schema.properties).map(([k, v]) => {
      if (!v.hidden) {
        return (
          <div key={k} data-test="form-field" className="horizontal-item">
            {this.renderLabel(k, v)}
            {this.renderItem(k, v)}
          </div>
        );
      }
    });

  render() {
    return (
      <div className="horizontal-row">
        <h4 className="horizontal-title" data-test="form-title">
          {this.props.schema.title}
        </h4>
        <div className="horizontal-items">{this.renderItems()}</div>
      </div>
    );
  }
}
