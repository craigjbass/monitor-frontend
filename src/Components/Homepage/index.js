import runtimeEnv from "@mars/heroku-js-runtime-env";
import "./style.css";
import React from "react";

export default class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.env = runtimeEnv();
  }
  render() {
    return (
      <div className="row homepage">
        <div className="col-md-2" />
        <div className="col-md-8">
          <h1>Homes England Monitor</h1>
          <p>
            Welcome to the Homes England monitoring system. If you have not been
            provided with a link to a project you believe you should have access
            to, or have any feedback or queries please feel free to email{" "}
            <a href={"mailto:" + this.env.REACT_APP_SUPPORT_EMAIL}>
              {this.env.REACT_APP_SUPPORT_EMAIL}
            </a>
            .
          </p>
        </div>
        <div className="col-md-2" />
      </div>
    );
  }
}
