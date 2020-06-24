import base from "./rollup.config.base";

const config = Object.assign({}, base, {
	output: {
		file: `${base._fileName}.umd.js`,
		format: "umd"
	}
});

export default config;
