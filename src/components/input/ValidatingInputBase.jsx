import React from 'react';
import RingaComponent from '../RingaComponent';
import ValidatorRequired from '../validation/ValidatorRequired';

export default class ValidatingInputBase extends RingaComponent {
  //-----------------------------------
  // Constructor
  //-----------------------------------
  constructor(props) {
    super(props, props.id);

    this.state = Object.assign({}, this.state);

    this.processProps(props);
  }

  //-----------------------------------
  // Properties
  //-----------------------------------
  get watchMouseEvents() {
    return true;
  }

  //-----------------------------------
  // Lifecycle
  //-----------------------------------
  componentWillReceiveProps(nextProps) {
    this.processProps(nextProps);
  }

  render() {
    return this.props.children;
  }

  //-----------------------------------
  // Methods
  //-----------------------------------
  processProps(props) {
    let controlled;
    let value;

    if (props.value !== undefined) {
      controlled = true;
      value = props.value;
    } else if (props.model && props.modelField) {
      controlled = true;
      let val;
      val = props.model[props.modelField];

      if (val !== undefined) {
        value = val.toString();
      } else {
        value = '';
      }
    } else {
      value = undefined;
    }

    let n = {
      value: controlled ? value || '' : undefined,
      controlled,
      valid: true
    };

    if (!this.mounted) {
      this.state = Object.assign(this.state, n);
    } else {
      this.setState(n);
    }

    if (!this.validatorsInitialized) {
      this.setupValidators(props);

      this.validatorsInitialized = true;
    }
  }

  tryUpdateModel(value) {
    const {model, modelField} = this.props;

    if (model && modelField) {
      model[modelField] = value;

      this.setState({
        value
      });
    }
  }

  getTooltipMessage() {
    if (!this.state.valid && this.state.invalidReasons) {
      return this.state.invalidReasons.map(reason => reason.message).join('\n');
    }

    return undefined;
  }

  getTooltipOptions() {
    if (!this.state.valid) {
      return {
        classes: 'error',
        maxWidth: 400
      };
    }

    return undefined;
  }

  /**
   * This method is designed to be called in the subclass constructor AFTER state has been set!
   *
   * See TextInput for an example.
   *
   * @param props The properties passed into the constructor.
   */
  setupValidators(props) {
    let validators = props.validators || [];

    if (props.required) {
      validators.unshift(new ValidatorRequired());
    }

    this.state = Object.assign({
      validators
    }, this.state);
  }

  /**
   * Validates the value using the validators on this component. Returns false if everything is valid, returns an
   * array of reasons if anything is invalid.
   *
   * @param value False if valid. Array of reasons if invalid.
   * @returns {*}
   */
  validate(value) {
    let {validators} = this.state;
    let {model, modelField} = this.props;

    if (model && modelField && model.propertyOptions[modelField].validators) {
      validators = model.propertyOptions[modelField].validators;
    }

    let invalidReasons = [];

    validators.forEach(validator => {
      let result = validator.validate(value);

      if (result) {
        invalidReasons.push(result);
      }
    });

    if (invalidReasons.length) {
      this.setState({
        valid: false,
        invalidReasons
      });

      return invalidReasons;
    }

    this.setState({
      valid: true,
      invalidReasons: undefined
    });

    return false;
  }
}
