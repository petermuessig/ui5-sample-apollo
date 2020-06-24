"use strict";

const log = require("@ui5/logger").getLogger("builder:customtask:rollup");

const path = require("path");
const resourceFactory = require("@ui5/fs").resourceFactory;
const rollup = require("rollup");

/**
 * Task to execute rollup.
 *
 * @param {Object} parameters Parameters
 * @param {DuplexCollection} parameters.workspace DuplexCollection to read and write files
 * @param {Object} parameters.options Options
 * @param {string} parameters.options.projectName Project name
 * @param {string} parameters.options.projectNamespace Project namespace
 * @param {string} [parameters.options.configuration] Task configuration if given in ui5.yaml
 * @returns {Promise<undefined>} Promise resolving with undefined once data has been written
 */
module.exports = async function({workspace, options}) {

    // Using the programmatic API as explained here: https://rollupjs.org/guide/en/#rolluprollup

    // load the rollup options from the config file
    let rollupConfig = require(path.resolve(process.cwd(), options.configuration && options.configuration.configFile || "rollup.config.js"));

    // rollup config could be an array or a single object (we want to work with an array here)
    rollupConfig = Array.isArray(rollupConfig) ? rollupConfig : [ rollupConfig ];

    // create the bundles as defined in the rollup config file
    for (const rollupOptions of rollupConfig) {

        // create a bundle (maybe in future we should again load the )
        const bundle = await rollup.rollup(rollupOptions);

        // extract the UI5 module name from bundle configuration
        const ui5ModuleName = rollupOptions.output.ui5ModuleName;
        if (!ui5ModuleName) {
            log.error(`The bundle definition ${rollupOptions.input} misses the ui5ModuleName in the output configuration! Skipping bundle...`);
            continue;
        }

        // avoid logging of unknown option
        delete rollupOptions.output.ui5ModuleName;

        // generate output specific code in-memory
        // you can call this function multiple times on the same bundle object
        const { output } = await bundle.generate({
            output: rollupOptions.output
        });

        // Right now we only support one chunk as build result
        if (output.length === 1 && output[0].type === "chunk") {
            try {
                const resource = resourceFactory.createResource({
                    path: ui5ModuleName,
                    string: output[0].code
                });
                await workspace.write(resource);
                log.verbose(`Created bundle for ${rollupOptions.input} in ${resource.getPath()}`);
            } catch (err) {
               log.error(`Couldn't write bundle for ${rollupOptions.input}: ${err}`);
            }         
        } else {
            log.error(`The bundle definition ${rollupOptions.input} must generate only one chunk! Skipping bundle...`);
        }

    }

};