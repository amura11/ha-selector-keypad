import { CSSResultGroup, LitElement, TemplateResult, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { KeypadSelector, KeypadSelectorKey } from './types';
import { isString } from 'lodash';
import * as packageData from '../package.json';

console.info(
    `%c  HA-KEYPAD-SELECTOR  \n%c Version ${packageData.version} `,
    'color: white; font-weight: bold; background: rgb(137, 179, 248)',
    'color: black; font-weight: bold; background: rgb(245, 245, 245)',
);

const DELETE_KEY: string = "__DELETE__";
const CLEAR_KEY: string = "__CLEAR__"
const ICON_REGEX: RegExp = /^mdi:[a-zA-Z0-9\-]+$/gm

const DEFAULT_SHOW_CODE: boolean = true;
const DEFAULT_SHOW_LABEL: boolean = true;
const DEFAULT_COLUMNS: number = 3;
const DEFAULT_KEYS: Array<KeypadSelectorKey> = [
    { key: "7" },
    { key: "8" },
    { key: "9" },
    { key: "4" },
    { key: "5" },
    { key: "6" },
    { key: "1" },
    { key: "2" },
    { key: "3" },
    { key: DELETE_KEY },
    { key: "0" },
    { key: CLEAR_KEY }
];


@customElement("ha-selector-keypad")
export class HaKeypadSelector extends LitElement {
    constructor() {
        super();

        this._tokens = new Array<string>();
    }

    @property()
    public hass!: HomeAssistant;

    @property()
    public label?: string;

    @property()
    public selector!: KeypadSelector;

    private _tokens!: Array<string>;

    private get showLabel(): boolean {
        return this.selector.keypad?.show_label ?? DEFAULT_SHOW_LABEL;
    }

    private get showCode(): boolean {
        return this.selector.keypad?.show_code ?? DEFAULT_SHOW_CODE;
    }

    private get columnCount(): number {
        return this.selector.keypad?.columns ?? DEFAULT_COLUMNS;
    }

    private get keys(): Array<KeypadSelectorKey> {
        return this.selector.keypad?.keys ?? DEFAULT_KEYS;
    }

    private get rawCode(): string {
        return this._tokens.join("");
    }

    private get formattedCode(): string {
        var toReturn: string;

        if (this.selector.keypad?.mask) {
            toReturn = this.selector.keypad?.mask.repeat(this._tokens.length);
        } else {
            toReturn = this.rawCode;
        }

        return toReturn;
    }

    private renderKey(key: KeypadSelectorKey, keyIndex: number): TemplateResult {
        var keyContent: TemplateResult;
        var keyId = `key-${keyIndex}`;
        var keySizeCss: string = `calc((100% * (1/${this.columnCount})) - (2 * var(--key-padding)))`;

        if (isString(key.key) && key.key.match(ICON_REGEX)) {
            keyContent = html`<ha-icon icon="${key.key}"></ha-icon>`;
        } else if (key.key == DELETE_KEY) {
            keyContent = html`<ha-icon icon="mdi:backspace-outline"></ha-icon>`
        } else if (key.key == CLEAR_KEY) {
            keyContent = html`<ha-icon icon="mdi:close-circle-outline"></ha-icon>`
        } else {
            keyContent = html`${key.key}`;
        }

        return html`
            <div class="key-wrapper" style="width: ${keySizeCss}; padding-top: ${keySizeCss};">
                <div class="key" @click=${() => this.onKeyPressed(key.value ?? key.key)}>
                    <md-ripple></md-ripple>
                    <div id="${keyId}">${keyContent}</div>
                </div>
            </div>
        `;
    }

    private onKeyPressed(token: string | number) {
        var isUpdateRequired: boolean = false;

        if (token == DELETE_KEY) {
            if (this._tokens.length > 0) {
                this._tokens = this._tokens.slice(0, -1);
                isUpdateRequired = true;
            }
        } else if (token == CLEAR_KEY) {
            if (this._tokens.length > 0) {
                this._tokens = new Array<string>();
                isUpdateRequired = true;
            }
        } else {
            this._tokens.push(token.toString());
            isUpdateRequired = true;
        }

        if (isUpdateRequired == true) {
            this.requestUpdate();
            fireEvent(this, "value-changed", { value: this.rawCode });
        }
    }

    protected render(): TemplateResult {
        return html`
            <div class="container">
                <div class="code">
                    ${this.showLabel ? html`<div class="code-label">${this.label}</div>` : nothing}
                    ${this.showCode ? html`<div class="code-value">${this.formattedCode}</div>` : nothing}
                </div>

                <div class="keypad">
                    ${this.keys.map((key, index) => this.renderKey(key, index))}
                </div>
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            :host {
                --font-family: var(--hakp-font-family, 'Roboto', system-ui, sans-serif);
                --text-color: var(--hakp-text-color, var(--primary-text-color, rgb(221, 221, 221)));

                --code-font-size: var(--hakp-code-font-size, 2.5rem);
                --code-font-weight: var(--hakp-code-font-weight, 600);
                --code-color: var(--hakp-code-color, --text-color);

                --code-label-font-size: var(--hakp-code-label-font-size, 1.75rem);
                --code-label-font-weight: var(--hakp-code-label-font-weight, 500);
                --code-label-color: var(--hakp-code-label-color, --text-color);

                --key-font-size: var(--hakp-key-font-weight, 1.5rem);
                --key-font-weight: var(--hakp-key-font-weight, 600);
                --key-color: var(--hakp-key-color, --text-color);
                --key-padding: var(--hakp-key-padding, 8px);

                --keypad-max-width: var(--hakp-keypad-max-width, 300px);

                --md-ripple-pressed-color: var(--mdc-ripple-color, #AAAAAA);
            }

            .container {
                font-family: var(--font-family);
                text-color: var(--text-color);
                display: flex;
                flex-direction: column;
            }
            
            .code {
                display: flex;
                flex-direction: column;
                text-align: center;
            }
            
            .code-label {
                font-size: var(--code-label-font-size);
                font-weight: var(--code-label-font-weight);
                text-color: var(--code-label-color);
            }
            
            .code-value {
                line-height: var(--code-font-size);
                height: var(--code-font-size);
                font-size: var(--code-font-size);
                text-color: var(--code-color);
                font-weight: var(--code-font-weight);
                letter-spacing: 0.5em;
                margin: 12px 0 12px 0;
            }
            
            .keypad {
                max-width: var(--keypad-max-width);
                width: 100%;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                align-self: center;
            }
            
            .key-wrapper {
                position: relative;
            }

            .key {
                padding: var(--key-padding);
                font-size: var(--key-font-size);
                font-weight: var(--key-font-weight);
                position: absolute;
                inset: 0px;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            md-ripple {
                inset: var(--key-padding);
                border-radius: 100%;
            }
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ha-selector-keypad": HaKeypadSelector;
    }
}