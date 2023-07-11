import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import json from "@rollup/plugin-json";

const plugins = [
    nodeResolve({}),
    commonjs(),
    typescript(),
    json(),
];

export default [
    {
        input: "src/ha-selector-keypad.ts",
        output: {
            dir: "./dist",
            format: "es",
            sourcemap: true
        },
        plugins: [...plugins]
    }
];