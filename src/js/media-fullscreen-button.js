/*
  <media-fullscreen-button media="#myVideo" fullscreen-element="#myContainer">

  The fullscreen-element attribute can be used to say which element
  to make fullscreen.
  If none, the button will look for the closest media-container element to the media.
  If none, the button will make the media fullscreen.
*/
import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { verbs } from './labels/labels.js';

const enterFullscreenIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M16 3v2.5h3.5V9H22V3h-6ZM4 9h2.5V5.5H10V3H4v6Zm15.5 9.5H16V21h6v-6h-2.5v3.5ZM6.5 15H4v6h6v-2.5H6.5V15Z"/>
</svg>`;

const exitFullscreenIcon = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M18.5 6.5V3H16v6h6V6.5h-3.5ZM16 21h2.5v-3.5H22V15h-6v6ZM4 17.5h3.5V21H10v-6H4v2.5Zm3.5-11H4V9h6V3H7.5v3.5Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) slot:not([name=exit]) > *, 
  :host([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}]) ::slotted(:not([slot=exit])) {
    display: none !important;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}])) slot:not([name=enter]) > *, 
  :host(:not([${MediaUIAttributes.MEDIA_IS_FULLSCREEN}])) ::slotted(:not([slot=enter])) {
    display: none !important;
  }
  </style>

  <slot name="enter">${enterFullscreenIcon}</slot>
  <slot name="exit">${exitFullscreenIcon}</slot>
`;

const updateAriaLabel = (el) => {
  const isFullScreen =
    el.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null;
  const label = isFullScreen
    ? verbs.EXIT_FULLSCREEN()
    : verbs.ENTER_FULLSCREEN();
  el.setAttribute('aria-label', label);
};

class MediaFullscreenButton extends MediaChromeButton {
  static get observedAttributes() {
    return [...super.observedAttributes, MediaUIAttributes.MEDIA_IS_FULLSCREEN];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
  }

  connectedCallback() {
    updateAriaLabel(this);
    super.connectedCallback();
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (attrName === MediaUIAttributes.MEDIA_IS_FULLSCREEN) {
      updateAriaLabel(this);
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const eventName =
      this.getAttribute(MediaUIAttributes.MEDIA_IS_FULLSCREEN) != null
        ? MediaUIEvents.MEDIA_EXIT_FULLSCREEN_REQUEST
        : MediaUIEvents.MEDIA_ENTER_FULLSCREEN_REQUEST;
    this.dispatchEvent(
      new window.CustomEvent(eventName, { composed: true, bubbles: true })
    );
  }
}

defineCustomElement('media-fullscreen-button', MediaFullscreenButton);

export default MediaFullscreenButton;
