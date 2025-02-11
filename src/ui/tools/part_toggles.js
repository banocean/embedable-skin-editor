import { css, html } from "lit";

const PART_STYLES = css`
  #parts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.125rem;
    --scale: 0.5;
    margin-bottom: 0.5rem;
  }

  #parts > div {
    display: flex;
    gap: 0.125rem;
    justify-content: center;
  }

  #parts ncrs-toggle {
    display: block;
    background-size: contain;
    background-repeat: no-repeat;
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
    width: calc(38px * var(--scale));
    height: calc(38px * var(--scale));
    --background-image-enabled: url("/images/skin_parts/head_enabled.png");
    --background-image-disabled: url("/images/skin_parts/head_disabled.png");
  }

  #toggle-rarm {
    width: calc(22px * var(--scale));
    height: calc(54px * var(--scale));
    --background-image-enabled: url("/images/skin_parts/right_arm_enabled.png");
    --background-image-disabled: url("/images/skin_parts/right_arm_disabled.png");
  }

  #toggle-torso {
    width: calc(38px * var(--scale));
    height: calc(54px * var(--scale));
    --background-image-enabled: url("/images/skin_parts/torso_enabled.png");
    --background-image-disabled: url("/images/skin_parts/torso_disabled.png");
  }

  #toggle-larm {
    width: calc(22px * var(--scale));
    height: calc(54px * var(--scale));
    --background-image-enabled: url("/images/skin_parts/left_arm_enabled.png");
    --background-image-disabled: url("/images/skin_parts/left_arm_disabled.png");
  }

  #toggle-rleg {
    width: calc(22px * var(--scale));
    height: calc(54px * var(--scale));
    --background-image-enabled: url("/images/skin_parts/right_leg_enabled.png");
    --background-image-disabled: url("/images/skin_parts/right_leg_disabled.png");
  }

  #toggle-lleg {
    width: calc(22px * var(--scale));
    height: calc(54px * var(--scale));
    --background-image-enabled: url("/images/skin_parts/left_leg_enabled.png");
    --background-image-disabled: url("/images/skin_parts/left_leg_disabled.png");
  }
`

// Ignore this wild workaround lmao
const PART_HTML = (scope) => html`
  <div id="parts">
    <ncrs-toggle id="toggle-head" title="Toggle head." toggled @toggle=${scope._toggleHeadPart}></ncrs-toggle>
    <div>
      <ncrs-toggle id="toggle-rarm" title="Toggle right arm." toggled @toggle=${scope._toggleRArmPart}></ncrs-toggle>
      <ncrs-toggle id="toggle-torso" title="Toggle torso." toggled @toggle=${scope._toggleTorsoPart}></ncrs-toggle>
      <ncrs-toggle id="toggle-larm" title="Toggle left arm." toggled @toggle=${scope._toggleLArmPart}></ncrs-toggle>
    </div>
    <div>
      <ncrs-toggle id="toggle-rleg" title="Toggle right leg." toggled @toggle=${scope._toggleRLegPart}></ncrs-toggle>
      <ncrs-toggle id="toggle-lleg" title="Toggle left leg." toggled @toggle=${scope._toggleLLegPart}></ncrs-toggle>
    </div>
  </div>
`

export {PART_STYLES, PART_HTML}