import base from "./rollup.config.base";
import { terser } from "rollup-plugin-terser";

const config = Object.assign({}, base, {
	output: {
		file: `${base._fileName}.min.js`,
		format: "iife",
		// sourceMap: 'inline',
		name: "UI5Apollo"
	}
});

config.plugins.push(terser());

export default config;
