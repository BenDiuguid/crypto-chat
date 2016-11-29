import React, { Component, PropTypes } from 'react';

class InputWithButton extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.clearInput = this.clearInput.bind(this);

    this.state = {
      text: '',
    };
  }

  handleChange(event) {
    this.setState({
      text: event.target.value,
    });
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.text);
    this.clearInput();
  }

  clearInput() {
    this.setState({
      text: '',
    });
  }

  render() {
    return (
      <form onSubmit={this.onSubmit}>
        <input
          type="text"
          value={this.state.text}
          onChange={this.handleChange}
        />
        <button
          type="submit"
          disabled={(this.state.text.length === 0)}
          >
          {this.props.buttonText}
        </button>
      </form>
    );
  }

}

InputWithButton.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  buttonText: PropTypes.string.isRequired,
};

export default InputWithButton;
