import fetch from "isomorphic-fetch";

import React from "react";
import "./style.css";

export default class GetToken extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      message_sent: false
    };
  }

  emailChange = e => {
    this.setState({ email: e.target.value });
  };

  sendRequest = e => {
    this.props.requestToken.execute(
      this.state.email,
      this.props.projectId,
      this.props.targetUrl
    );
    this.setState({ message_sent: true });
    e.preventDefault();
  };

  renderMessageSent = () => {
    return (
      <div data-test="sent_message" className="col-md-offset-2 col-md-8">
        <h3 className="text-center">We&#39;ve sent an email to {this.state.email}</h3>
        <p className="text-center">
          This link will expire in 10 minutes, after which you will need to generate a new one.
        </p>

        <h4 className="text-center">
          Please check your email
        </h4>

        <p>
          Didn&#39;t receive an email? Check your spam and make sure you entered
          your email correctly. 
          If you are not pre-authorised, 
          please contact <a href="mailto:homes.england@notifications.service.gov.uk"> homes.england@notifications.service.gov.uk</a>
        </p>
      </div>
    );
  };

  landingMessage = () => {
      return (
        <div className="col-md-offset-2 col-md-8">

          <div id="message">
            <h3>
            Please enter your email to access this project
            </h3>

            <p>
              Use your email that is associated with this project.
              If you are not pre-authorised, please contact Homes England.
            </p>

            <div id='submitForm'>
              <form onSubmit={this.sendRequest}>
                <div className="form-group">
                  <input
                    data-test="email_input"
                    type="text"
                    className="form-control"
                    placeholder="email@example.com"
                    onChange={this.emailChange}
                  />
                </div>
                <button
                  data-test="submit_button"
                  type="submit"
                  className="btn btn-primary"
                >
                  Request Access
                </button>
              </form>
            </div>
            <div>
              <p>
                We&#39;ll send an email from homes.england at notifications.service.gov.uk .
                This email contains a magic link that you can use (click) to access the project.
              </p>

              <p>
                This link will expire in 10 minutes, after which you will need to generate a new one.
              </p>
            </div>
          </div>

        </div>
      );
  };

  render() {
    if (this.state.message_sent) {
      return this.renderMessageSent();
    } else {
      return this.landingMessage();
    }
  }
}


