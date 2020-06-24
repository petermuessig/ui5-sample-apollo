/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library sap.ui.ux3.
 */
sap.ui.define([
	'sap/ui/core/library', // library dependency
],
	function() {

	"use strict";

	/**
	 * Controls that implement the SAP User Experience (UX) Guidelines 3.0
	 *
	 * @namespace
	 * @name sap.ui.apollo
	 * @author SAP SE
	 * @version ${version}
	 * @public
	 * @deprecated Since 1.72
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.apollo",
		version: "${version}",
		dependencies : ["sap.ui.core"],
		types: [
		],
		interfaces: [
		],
		controls: [
		],
		elements: [
		]
	});

    sap.ui.loader.config({
        shim: {
            "sap/ui/apollo/thirdparty/apollo.min": {
                exports: "UI5Apollo"
            }
        }
    });
    
	return sap.ui.apollo;

});