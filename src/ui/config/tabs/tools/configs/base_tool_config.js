import { css, html, LitElement } from "lit";
import { camelize } from "../../../../../helpers";

class BaseToolConfig extends LitElement {
  static styles = css`
    #main {
      color: rgb(156 163 175);
      padding: 0.5rem;
    }

    h2 {
      text-align: center;
      font-size: small;
      font-weight: normal;
      margin-top: 0px;
    }

    .group {
      display: flex;
      gap: 0.5rem;
    }

    .group-sm {
      display: flex;
      gap: 0.25rem;
    }

    .title {
      padding: 0px;
      font-size: x-small;
      margin: 0px;
    }
  `;

  constructor(config, properties) {
    super();
    this.config = config;
    this.properties = properties;

    this._setupMethods();
    this._setupCallbacks();
  }

  connectedCallback() {
    super.connectedCallback();

    Object.keys(this.properties).forEach(property => {
      this[property] = this.config.get(property);
    })
  }

  render() {
    return html`
      <div id="main">
        <h2>Base Tool</h2>
      </div>
    `;
  }

  _setupMethods() {
    Object.entries(this.properties).map(([property, options]) => {
      const name = camelize(`on ${property} ${options.type}`);
      this[`_${name}`] = function (event) {
        if (options.type === "toggle") {
          this.config.set(property, event.detail.toggle);
        } else if (options.number) {
          this.config.set(property, Number(event.detail.name));
        } else {
          this.config.set(property, event.detail.name);
        }
      }
    })
  }

  _setupCallbacks() {
    Object.keys(this.properties).forEach(property => {
      this.config.addEventListener(`${property}-change`, event => {
        this[property] = event.detail;
      })
    });
  }
}

export default BaseToolConfig;
