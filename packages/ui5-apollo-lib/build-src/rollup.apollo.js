"use strict";

const path = require("path");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const cjs = require("@rollup/plugin-commonjs");
const { babel } = require("@rollup/plugin-babel");
const { terser } = require("rollup-plugin-terser");

function buildConfig(minify) {
	const config = {
        input: path.resolve(__dirname, "apollo/index.js"),
        output: {
            ui5ModuleName: `/resources/apollo/client/thirdparty/apollo${minify ? "" : "-dbg"}.js`,
            format: "amd",
            amd: {
                define: "sap.ui.define"
            }
        },
        plugins: [
            nodeResolve({
                browser: true,
                mainFields: ["module", "main"]
            }),
            cjs({
                exclude: ["src/**", "lib/**"],
            }),
            babel({
                babelHelpers: "bundled",
                exclude: "node_modules/**"
            })
        ]
    };
	if (minify) {
		config.plugins.push(terser());
	}
	return config;
}

module.exports = [
    buildConfig(),
    buildConfig(true) // required as UI5 uglify task is using workspace.byGlobSource (which excludes generated resources from being minified)
];
