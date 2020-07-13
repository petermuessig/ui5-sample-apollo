sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/base/BindingParser"
], function(Controller, BindingParser) {
	"use strict";

	return Controller.extend("apollo.client.controller.ApolloBaseController", {

		/**
		 * Initializes the ApolloBaseController
		 */
		onInit: function () {
			// retrieve the Apollo client
			var apolloClient = this.getOwnerComponent().apolloClient;

			// some syntactic sugar for the consumers
			this.$query = apolloClient.query.bind(apolloClient);
			this.$mutate = apolloClient.mutate.bind(apolloClient);
			this.$subscribe = apolloClient.subscribe.bind(apolloClient);

			// enrich the apollo root object
			if (this.apollo) {
				Object.keys(this.apollo).forEach(entity => {
					this.apollo[entity].invoke = () => {
						this.invoke(entity)
					}
					if (!this.apollo[entity].skip) {
						this.invoke(entity);
					}
				});
			}
		},

		invoke: function (entity) {
			var promise = this.$query({
				query: this.apollo[entity].query,
				variables: this._getVariables(this.apollo[entity].variables)
			}).then(function(result) {
				const binding = BindingParser.complexParser(this.apollo[entity].binding);
				this.getView().getModel(binding && binding.model).setProperty(binding && binding.path || `/${entity}`, result.data[this.apollo[entity].query.definitions[0].selectionSet.selections[0].name.value])
			}.bind(this));
			if (typeof this.onApolloError === "function") {
				promise.catch(function(error) {
					this.onApolloError(error);
				}.bind(this));
			}
		},

		_getVariables: function (variables) {
			let result = {};
			if (variables) {
				Object.keys(variables).forEach(function(key) {
					const binding = BindingParser.complexParser(variables[key]);
					if (binding) {
						result[key] = this.getView().getModel(binding.model).getProperty(binding.path);
					}
				});
			}
			return result;
		}

	});
});
