# Home Assistant Keypad

[![hacs][hacsbadge]][hacs]
[![HACS Validation][validation-shield]](validation)

[![GitHub Release][releases-shield]][releases]
[![License][license-shield]](LICENSE)

A simple keypad [selector](https://www.home-assistant.io/docs/blueprint/selectors/) for Home Assistant. Allows you to add a keypad for text input. Primarily built for use with [Browser Mod](https://github.com/thomasloven/hass-browser_mod) when using [form content](https://github.com/thomasloven/hass-browser_mod/blob/master/documentation/popups.md#form-content) but can be used anywhere a selector can.

## Basic Example
```
service: browser_mod.popup
data:
  title: Enter Value
  content:
    - name: my_keypad
      label: Enter a Value
      selector:
        keypad:
          mask: '*'
```

## Installation
### Manually
1. Copy the files from the `dist` directory to the `<config>/www/`
1. Add the following to the `configuration.yaml` file:
    ```
    lovelace:
    resources:
        - url: /local/ha-selector-keypad.js?v=1
        type: module
    ```

Note: You can place the files into a sub directory under `<config>/www/<sub-directory>`. If you choose this option ensure the path in the `configuration.yaml` file reflects this. Eg.:
```
lovelace:
  resources:
    - url: /local/<sub-directory>/ha-selector-keypad.js?v=1
      type: module
```

### Via HACS
1. Add the repository to HACS
1. Add the following to the `configuration.yaml` file:
    ```
    lovelace:
    resources:
        - url: /hacsfiles/ha-selector-keypad.js
        type: module
    ```

## Configuration Options

Name | Type | Description | Default
-- | -- | -- | -- 
`columns` | number | The maximum number of keys a row can have. | 3
`mask` | string | A character or string to mask the code value when it's displayed. If `null` the raw code value is displayed. This only changes the display of the code not it's internal value. | `null` |
`show_code` | boolean | A flag to render the code section or not | `true`
`show_label`| boolean | A flag to render the label section or not | `true`

[releases-shield]: https://img.shields.io/github/release/amura11/ha-selector-keypad.svg?style=for-the-badge
[releases]: https://github.com/amura11/ha-selector-keypad/releases
[hacs]: https://github.com/hacs/integration
[hacsbadge]: https://img.shields.io/badge/HACS-Custom-orange.svg?style=for-the-badge
[validation-shield]: https://img.shields.io/github/actions/workflow/status/amura11/ha-selector-keypad/validate.yml?style=for-the-badge&label=HACS%20Validation
[validation]: https://github.com/amura11/ha-selector-keypad/actions/workflows/validate.yml
[license-shield]: https://img.shields.io/github/license/amura11/ha-selector-keypad.svg?style=for-the-badge