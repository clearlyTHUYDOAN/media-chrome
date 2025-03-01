import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const pipIcon = `<svg aria-hidden="true" viewBox="0 0 28 24">
  <path d="M24 3H4a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h20a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1Zm-1 16H5V5h18v14Zm-3-8h-7v5h7v-5Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_PIP}]) slot:not([name=exit]) > *, 
  :host([${MediaUIAttributes.MEDIA_IS_PIP}]) ::slotted(:not([slot=exit])) {
    display: none !important;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([${MediaUIAttributes.MEDIA_IS_PIP}])) slot:not([name=enter]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_IS_PIP}])) ::slotted(:not([slot=enter])) {
    display: none !important;
  }
  </style>

  <slot name="enter">${pipIcon}</slot>
  <slot name="exit">${pipIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const isPip = el.getAttribute(MediaUIAttributes.MEDIA_IS_PIP) != null;
  const label = isPip ? verbs.EXIT_PIP() : verbs.ENTER_PIP();
  el.setAttribute('aria-label', label);
};

class MediaPipButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_IS_PIP, MediaUIAttributes.MEDIA_PIP_UNAVAILABLE];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_IS_PIP) {
      updateAriaLabel(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_IS_PIP) != null
        ? MediaUIEvents.MEDIA_EXIT_PIP_REQUEST
        : MediaUIEvents.MEDIA_ENTER_PIP_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement('media-pip-button', MediaPipButton);

export default MediaPipButton;
