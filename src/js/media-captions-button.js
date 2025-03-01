import MediaChromeButton from './media-chrome-button.js';
import { defineCustomElement } from './utils/defineCustomElement.js';
import {
  Window as window,
  Document as document,
} from './utils/server-safe-globals.js';
import { MediaUIEvents, MediaUIAttributes } from './constants.js';
import { nouns } from './labels/labels.js';
import { splitTextTracksStr } from './utils/captions.js';

const ccIconOn = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M22.83 5.68a2.58 2.58 0 0 0-2.3-2.5c-3.62-.24-11.44-.24-15.06 0a2.58 2.58 0 0 0-2.3 2.5c-.23 4.21-.23 8.43 0 12.64a2.58 2.58 0 0 0 2.3 2.5c3.62.24 11.44.24 15.06 0a2.58 2.58 0 0 0 2.3-2.5c.23-4.21.23-8.43 0-12.64Zm-11.39 9.45a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.92 3.92 0 0 1 .92-2.77 3.18 3.18 0 0 1 2.43-1 2.94 2.94 0 0 1 2.13.78c.364.359.62.813.74 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.17 1.61 1.61 0 0 0-1.29.58 2.79 2.79 0 0 0-.5 1.89 3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.48 1.48 0 0 0 1-.37 2.1 2.1 0 0 0 .59-1.14l1.4.44a3.23 3.23 0 0 1-1.07 1.69Zm7.22 0a3.07 3.07 0 0 1-1.91.57 3.06 3.06 0 0 1-2.34-1 3.75 3.75 0 0 1-.92-2.67 3.88 3.88 0 0 1 .93-2.77 3.14 3.14 0 0 1 2.42-1 3 3 0 0 1 2.16.82 2.8 2.8 0 0 1 .73 1.31l-1.43.35a1.49 1.49 0 0 0-1.51-1.21 1.61 1.61 0 0 0-1.29.58A2.79 2.79 0 0 0 15 12a3 3 0 0 0 .49 1.93 1.61 1.61 0 0 0 1.27.58 1.44 1.44 0 0 0 1-.37 2.1 2.1 0 0 0 .6-1.15l1.4.44a3.17 3.17 0 0 1-1.1 1.7Z"/>
</svg>`;

const ccIconOff = `<svg aria-hidden="true" viewBox="0 0 26 24">
  <path d="M17.73 14.09a1.4 1.4 0 0 1-1 .37 1.579 1.579 0 0 1-1.27-.58A3 3 0 0 1 15 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34A2.89 2.89 0 0 0 19 9.07a3 3 0 0 0-2.14-.78 3.14 3.14 0 0 0-2.42 1 3.91 3.91 0 0 0-.93 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.17 3.17 0 0 0 1.07-1.74l-1.4-.45c-.083.43-.3.822-.62 1.12Zm-7.22 0a1.43 1.43 0 0 1-1 .37 1.58 1.58 0 0 1-1.27-.58A3 3 0 0 1 7.76 12a2.8 2.8 0 0 1 .5-1.85 1.63 1.63 0 0 1 1.29-.57 1.47 1.47 0 0 1 1.51 1.2l1.43-.34a2.81 2.81 0 0 0-.74-1.32 2.94 2.94 0 0 0-2.13-.78 3.18 3.18 0 0 0-2.43 1 4 4 0 0 0-.92 2.78 3.74 3.74 0 0 0 .92 2.66 3.07 3.07 0 0 0 2.34 1 3.07 3.07 0 0 0 1.91-.57 3.23 3.23 0 0 0 1.07-1.74l-1.4-.45a2.06 2.06 0 0 1-.6 1.07Zm12.32-8.41a2.59 2.59 0 0 0-2.3-2.51C18.72 3.05 15.86 3 13 3c-2.86 0-5.72.05-7.53.17a2.59 2.59 0 0 0-2.3 2.51c-.23 4.207-.23 8.423 0 12.63a2.57 2.57 0 0 0 2.3 2.5c1.81.13 4.67.19 7.53.19 2.86 0 5.72-.06 7.53-.19a2.57 2.57 0 0 0 2.3-2.5c.23-4.207.23-8.423 0-12.63Zm-1.49 12.53a1.11 1.11 0 0 1-.91 1.11c-1.67.11-4.45.18-7.43.18-2.98 0-5.76-.07-7.43-.18a1.11 1.11 0 0 1-.91-1.11c-.21-4.14-.21-8.29 0-12.43a1.11 1.11 0 0 1 .91-1.11C7.24 4.56 10 4.49 13 4.49s5.76.07 7.43.18a1.11 1.11 0 0 1 .91 1.11c.21 4.14.21 8.29 0 12.43Z"/>
</svg>`;

const slotTemplate = document.createElement('template');
slotTemplate.innerHTML = `
  <style>
  :host([aria-checked="true"]) slot:not([name=on]) > *, 
  :host([aria-checked="true"]) ::slotted(:not([slot=on])) {
    display: none !important;
  }

  /* Double negative, but safer if display doesn't equal 'block' */
  :host(:not([aria-checked="true"])) slot:not([name=off]) > *, 
  :host(:not([aria-checked="true"])) ::slotted(:not([slot=off])) {
    display: none !important;
  }
  </style>

  <slot name="on">${ccIconOn}</slot>
  <slot name="off">${ccIconOff}</slot>
`;

const updateAriaChecked = (el) => {
  el.setAttribute('aria-checked', isCCOn(el));
};

const isCCOn = (el) => {
  const showingCaptions = !!el.getAttribute(
    MediaUIAttributes.MEDIA_CAPTIONS_SHOWING
  );
  const showingSubtitlesAsCaptions =
    !el.hasAttribute('no-subtitles-fallback') &&
    !!el.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_SHOWING);
  return showingCaptions || showingSubtitlesAsCaptions;
};

class MediaCaptionsButton extends MediaChromeButton {
  static get observedAttributes() {
    return [
      ...super.observedAttributes,
      'no-subtitles-fallback',
      'default-showing',
      MediaUIAttributes.MEDIA_CAPTIONS_LIST,
      MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
      MediaUIAttributes.MEDIA_SUBTITLES_LIST,
      MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
    ];
  }

  constructor(options = {}) {
    super({ slotTemplate, ...options });
    // Internal variable to keep track of when we have some or no captions (or subtitles, if using subtitles fallback)
    // Used for `default-showing` behavior.
    this._captionsReady = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.setAttribute('role', 'switch');
    this.setAttribute('aria-label', nouns.CLOSED_CAPTIONS());
    updateAriaChecked(this);
  }

  attributeChangedCallback(attrName, oldValue, newValue) {
    if (
      [
        MediaUIAttributes.MEDIA_CAPTIONS_SHOWING,
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING,
      ].includes(attrName)
    ) {
      updateAriaChecked(this);
    }
    if (
      this.hasAttribute('default-showing') && // we want to show captions by default
      this.getAttribute('aria-checked') !== 'true' // and we aren't currently showing them
    ) {
      // Make sure we're only checking against the relevant attributes based on whether or not we are using subtitles fallback
      const subtitlesIncluded = !this.hasAttribute('no-subtitles-fallback');
      const relevantAttributes = subtitlesIncluded
        ? [
            MediaUIAttributes.MEDIA_CAPTIONS_LIST,
            MediaUIAttributes.MEDIA_SUBTITLES_LIST,
          ]
        : [MediaUIAttributes.MEDIA_CAPTIONS_LIST];
      // If one of the relevant attributes changed...
      if (relevantAttributes.includes(attrName)) {
        // check if we went
        // a) from captions (/subs) not ready to captions (/subs) ready
        // b) from captions (/subs) ready to captions (/subs) not ready.
        // by using a simple truthy (empty or non-empty) string check on the relevant values
        // NOTE: We're using `getAttribute` here instead of `newValue` because we may care about
        // multiple attributes.
        const nextCaptionsReady =
          !!this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_LIST) ||
          !!(
            subtitlesIncluded &&
            this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST)
          );
        // If the value changed, (re)set the internal prop
        if (this._captionsReady !== nextCaptionsReady) {
          this._captionsReady = nextCaptionsReady;
          // If captions are currently ready, that means we went from unready to ready, so
          // use the click handler to dispatch a request to turn captions on
          if (this._captionsReady) {
            this.handleClick();
          }
        }
      }
    }
    super.attributeChangedCallback(attrName, oldValue, newValue);
  }

  handleClick(_e) {
    const ccIsOn = isCCOn(this);
    if (ccIsOn) {
      // Closed Captions is on. Clicking should disable any currently showing captions (and subtitles, if relevant)
      // For why we are requesting tracks to `mode="disabled"` and not `mode="hidden"`, see: https://github.com/muxinc/media-chrome/issues/60
      const captionsShowingStr = this.getAttribute(
        MediaUIAttributes.MEDIA_CAPTIONS_SHOWING
      );
      // If we have currently showing captions track(s), request for them to be disabled.
      if (captionsShowingStr) {
        const evt = new window.CustomEvent(
          MediaUIEvents.MEDIA_DISABLE_CAPTIONS_REQUEST,
          { composed: true, bubbles: true, detail: captionsShowingStr }
        );
        this.dispatchEvent(evt);
      }
      const subtitlesShowingStr = this.getAttribute(
        MediaUIAttributes.MEDIA_SUBTITLES_SHOWING
      );
      // If we have currently showing subtitles track(s) and we're using subtitle fallback (true/"on" by default), request for them to be disabled.
      if (subtitlesShowingStr && !this.hasAttribute('no-subtitles-fallback')) {
        const evt = new window.CustomEvent(
          MediaUIEvents.MEDIA_DISABLE_SUBTITLES_REQUEST,
          { composed: true, bubbles: true, detail: subtitlesShowingStr }
        );
        this.dispatchEvent(evt);
      }
    } else {
      // Closed Captions is off. Clicking should show the first relevant captions track or subtitles track if we're using subtitle fallback (true/"on" by default)
      const [ccTrackStr] =
        splitTextTracksStr(
          this.getAttribute(MediaUIAttributes.MEDIA_CAPTIONS_LIST) ?? ''
        ) ?? [];
      if (ccTrackStr) {
        // If we have at least one captions track, request for the first one to be showing.
        const evt = new window.CustomEvent(
          MediaUIEvents.MEDIA_SHOW_CAPTIONS_REQUEST,
          { composed: true, bubbles: true, detail: ccTrackStr }
        );
        this.dispatchEvent(evt);
      } else if (!this.hasAttribute('no-subtitles-fallback')) {
        // If we don't have a captions track and we're using subtitles fallback (true/"on" by default), check if we have any subtitles available.
        const [subTrackStr] =
          splitTextTracksStr(
            this.getAttribute(MediaUIAttributes.MEDIA_SUBTITLES_LIST) ?? ''
          ) ?? [];
        if (subTrackStr) {
          // If we have at least one subtitles track (and didn't have any captions tracks), request for the first one to be showing as a fallback for captions.
          const evt = new window.CustomEvent(
            MediaUIEvents.MEDIA_SHOW_SUBTITLES_REQUEST,
            { composed: true, bubbles: true, detail: subTrackStr }
          );
          this.dispatchEvent(evt);
        }
      } else {
        // If we end up here, it means we have an enabled CC-button that a user has clicked on but there are no captions and no subtitles (or we've disabled subtitles fallback).
        console.error(
          'Attempting to enable closed captions but none are available! Please verify your media content if this is unexpected.'
        );
      }
    }
  }
}

defineCustomElement('media-captions-button', MediaCaptionsButton);

export default MediaCaptionsButton;
