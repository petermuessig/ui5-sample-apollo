import babel from "rollup-plugin-babel";
import cjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";

const config = require("../package.json");

const bundle = {
	input: "build-src/index.js",
	output: {
        file: "dist/resources/apollo/client/thirdparty/apollo.js",
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
			VERSION: JSON.stringify(config.version)
		})
	]
};

function minify(config) {
	let configClone = JSON.parse(JSON.stringify(config));
	// let configClone = Object.assign({}, config); // deep copy contains references!
	configClone.output.file = "dist/resources/apollo/client/thirdparty/apollo.min.js";
	configClone.plugins.push(terser());
	return configClone;
}

const bundles = [
	bundle,
	minify(bundle),
];

console.log(JSON.stringify(bundles));

export default bundles;
