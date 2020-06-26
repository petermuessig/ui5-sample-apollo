import babel from "rollup-plugin-babel";
import cjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const pkgJson = require("./package.json");

function buildConfig(minify) {
	const config = {
		input: "build-src/index.js",
		output: {
			file: `dist/resources/apollo/client/thirdparty/apollo${minify ? "" : "-dbg"}.js`,
			format: "amd",
			amd: {
				define: "sap.ui.define"
			}
		},
		plugins: [
			resolve({
				browser: true,
				mainFields: ["module", "main"]
			}),
			cjs({
				exclude: "src/**"
			}),
			babel({
				exclude: "node_modules/**"
			}),
			replace({
				VERSION: JSON.stringify(pkgJson.version)
			})
		]
	};
	if (minify) {
		config.plugins.push(terser());
	}
	return config;
}

const bundles = [
	buildConfig(),
	buildConfig(true),
];

export default bundles;
