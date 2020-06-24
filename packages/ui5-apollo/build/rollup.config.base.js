import babel from "rollup-plugin-babel";
import cjs from "rollup-plugin-commonjs";
import replace from "@rollup/plugin-replace";
import resolve from "rollup-plugin-node-resolve";

const config = require("../package.json");

export default {
	_fileName: "dist/resources/sap/ui/apollo/thirdparty/apollo",
	input: "build-src/index.js",
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
