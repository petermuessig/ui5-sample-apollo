/*!
 * ${copyright}
 */

/**
 * Initialization Code and shared classes of library apollo.client.
 */
sap.ui.define([
	'sap/ui/core/library', // library dependency
],
	function() {

	"use strict";

	/**
	 * UI5 Apollo Client Wrapper Library
	 *
	 * @namespace
	 * @name apollo.client
	 * @version ${version}
	 * @public
	 */

	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "apollo.client",
		version: "${version}",
		dependencies : ["sap.ui.core"],
		types: [
		],
		interfaces: [
		],
		controls: [
		],
		elements: [
		],
		noLibraryCSS: true
	});

	return apollo.client;

});