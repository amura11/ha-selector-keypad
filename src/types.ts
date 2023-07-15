export interface KeypadSelector {
    keypad: {
        show_code?: boolean
        show_label?: boolean
        columns?: number
        mask?: string
        keys?: Array<KeypadSelectorKey>
    } | null
}

export interface KeypadSelectorKey {
    key: string | number,
    value?: string
}