import { css, html, LitElement } from "lit";

class PartToggle extends LitElement {
  static styles = css`
    :host {
      display: block;
      --scale: 0.6;
      --gap: 0.25rem;
    }

    #parts {
      display: flex;
      flex-direction: column;
      align-items: center;
      image-rendering: pixelated;
      gap: var(--gap);
    }

    #parts > div {
      display: flex;
      justify-content: center;
      gap: var(--gap);
    }

    #parts ncrs-toggle {
      display: block;
      background-size: contain;
      background-repeat: no-repeat;
      outline: 1px solid white;
      background-image: var(--background-image-disabled);
    }

    #parts ncrs-toggle[toggled] {
      background-image: var(--background-image-enabled);
    }

    #parts ncrs-toggle::part(button) {
      width: 100%;
      height: 100%;
    }

    #toggle-head {
      width: calc(32px * var(--scale));
      height: calc(32px * var(--scale));
      --background-image-enabled: url("/images/skin_parts/head_enabled.png");
      --background-image-disabled: url("/images/skin_parts/head_disabled.png");
    }

    #toggle-rarm {
      width: calc(16px * var(--scale));
      height: calc(48px * var(--scale));
      --background-image-enabled: url("/images/skin_parts/right_arm_enabled.png");
      --background-image-disabled: url("/images/skin_parts/right_arm_disabled.png");
    }

    #toggle-torso {
      width: calc(32px * var(--scale));
      height: calc(48px * var(--scale));
      --background-image-enabled: url("/images/skin_parts/torso_enabled.png");
      --background-image-disabled: url("/images/skin_parts/torso_disabled.png");
    }

    #toggle-larm {
      width: calc(16px * var(--scale));
      height: calc(48px * var(--scale));
      --background-image-enabled: url("/images/skin_parts/left_arm_enabled.png");
      --background-image-disabled: url("/images/skin_parts/left_arm_disabled.png");
    }

    #toggle-rleg {
      width: calc(16px * var(--scale));
      height: calc(48px * var(--scale));
      --background-image-enabled: url("/images/skin_parts/right_leg_enabled.png");
      --background-image-disabled: url("/images/skin_parts/right_leg_disabled.png");
    }

    #toggle-lleg {
      width: calc(16px * var(--scale));
      height: calc(48px * var(--scale));
      --background-image-enabled: url("/images/skin_parts/left_leg_enabled.png");
      --background-image-disabled: url("/images/skin_parts/left_leg_disabled.png");
    }
  `

  constructor(editor) {
    super();
    
    this.editor = editor;
  }

  render() {
    return html`
      <div id="parts">
        <ncrs-toggle id="toggle-head" title="Toggle head." toggled @toggle=${this._toggleHeadPart}></ncrs-toggle>
        <div>
          <ncrs-toggle id="toggle-rarm" title="Toggle right arm." toggled @toggle=${this._toggleRArmPart}></ncrs-toggle>
          <ncrs-toggle id="toggle-torso" title="Toggle torso." toggled @toggle=${this._toggleTorsoPart}></ncrs-toggle>
          <ncrs-toggle id="toggle-larm" title="Toggle left arm." toggled @toggle=${this._toggleLArmPart}></ncrs-toggle>
        </div>
        <div>
          <ncrs-toggle id="toggle-rleg" title="Toggle right leg." toggled @toggle=${this._toggleRLegPart}></ncrs-toggle>
          <ncrs-toggle id="toggle-lleg" title="Toggle left leg." toggled @toggle=${this._toggleLLegPart}></ncrs-toggle>
        </div>
      </div>
    `
  }

  _toggleHeadPart(event) {
    this.editor.setPartVisible("head", event.detail);
  }

  _toggleRArmPart(event) {
    this.editor.setPartVisible("arm_right", event.detail);
  }

  _toggleTorsoPart(event) {
    this.editor.setPartVisible("torso", event.detail);
  }

  _toggleLArmPart(event) {
    this.editor.setPartVisible("arm_left", event.detail);
  }

  _toggleRLegPart(event) {
    this.editor.setPartVisible("leg_right", event.detail);
  }

  _toggleLLegPart(event) {
    this.editor.setPartVisible("leg_left", event.detail);
  }
}

customElements.define("ncrs-part-toggle", PartToggle)

export default PartToggle;