import base from "./rollup.config.base";

const config = Object.assign({}, base, {
	output: {
		file: `${base._fileName}.esm.js`,
		format: "es"
	}
});

export default config;
