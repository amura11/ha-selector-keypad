import { CSSResultGroup, LitElement, TemplateResult, css, html, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HomeAssistant, fireEvent } from 'custom-card-helpers';
import { KeypadSelector } from './types';
import { rangeRight } from 'lodash';
import * as packageData from '../package.json';
import '@material/web/button/text-button';

console.info("HA-KEYPAD-SELECTOR v1.0.0");

console.info(
    `%c  HA-KEYPAD-SELECTOR  \n%c Version ${packageData.version} `,
    'color: white; font-weight: bold; background: rgb(137, 179, 248)',
    'color: black; font-weight: bold; background: rgb(245, 245, 245)',
);

const DEFAULTS = {
    show_code: true,
    show_label: true,
    columns: 3,
    mask: null
};

const DELETE_KEY = "__DELETE__";
const CLEAR_KEY = "__CLEAR__"

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
        return this.selector.keypad?.show_label ?? DEFAULTS.show_label;
    }

    private get showCode(): boolean {
        return this.selector.keypad?.show_code ?? DEFAULTS.show_code;

    }

    private get columnCount(): number {
        return this.selector.keypad?.columns ?? DEFAULTS.columns;
    }

    private get keys(): Array<string> {
        var keyList: Array<string> = rangeRight(10).map(x => x.toString());

        const insertIndex = keyList.length - (keyList.length % this.columnCount);

        return [...keyList.slice(0, insertIndex), CLEAR_KEY, ...keyList.slice(insertIndex), DELETE_KEY];
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

    private renderKey(key: string): TemplateResult {
        var keyContent: TemplateResult;
        var keyStyle: string = `width: calc((100% * (1/${this.columnCount})) - (2 * var(--hakp-key-padding)));`;

        if (key == DELETE_KEY) {
            keyContent = html`<ha-icon icon="mdi:backspace-outline"></ha-icon>`;
        } else if (key == CLEAR_KEY) {
            keyContent = html`<ha-icon icon="mdi:close-circle-outline"></ha-icon>`;
        } else {
            keyContent = html`${key}`;
        }

        return html`
            <md-text-button class="hakp-key" style="${keyStyle}" @click=${() => this.onKeyPressed(key)}>
                ${keyContent}
            </md-text-button>
        `;
    }

    private onKeyPressed(token: string) {
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
            this._tokens.push(token);
            isUpdateRequired = true;
        }

        if (isUpdateRequired == true) {
            this.requestUpdate();
            fireEvent(this, "value-changed", { value: this.rawCode });
        }
    }

    protected render(): TemplateResult {
        return html`
            <div class="hakp-container">
                <div class="hakp-code">
                    ${this.showLabel ? html`<div class="hakp-code-label">${this.label}</div>` : nothing}
                    ${this.showCode ? html`<div class="hakp-code-value">${this.formattedCode}</div>` : nothing}
                </div>

                <div class="hakp-keypad">
                    ${this.keys.map((key) => this.renderKey(key))}
                </div>
            </div>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            :host {
                font-family: 'Roboto', system-ui, sans-serif;
                --md-text-button-container-height: 100%;
                --md-text-button-label-text-type: 600 1.5rem "Roboto";
                --hakp-key-padding: 8px;
                --hakp-code-font-size: 2.5rem;
            }

            .hakp-container {
                display: flex;
                flex-direction: column;
            }
            
            .hakp-code {
                display: flex;
                flex-direction: column;
                text-align: center;
                font-color: var(--primary-text-color);
            }
            
            .hakp-code-label {
                font-size: 1.75rem;
                font-weight: 500;
            }
            
            .hakp-code-value {
                line-height: var(--hakp-code-font-size);
                height: var(--hakp-code-font-size);
                font-size: var(--hakp-code-font-size);
                font-weight: 600;
                letter-spacing: 0.5em;
                margin: 12px 0 12px 0;
            }
            
            .hakp-keypad {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                max-width: 300px;
                align-self: center;
            }
            
            .hakp-key {
                padding: var(--hakp-key-padding);
                aspect-ratio: 1 / 1;
                
            }          
        `;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        "ha-selector-keypad": HaKeypadSelector;
    }
}