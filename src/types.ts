export interface KeypadSelector {
    keypad: {
        show_code?: boolean
        show_label?: boolean
        columns?: number
        mask?: string
    } | null
}

export interface KeypadKey {
    value: string,
    label?: string
}