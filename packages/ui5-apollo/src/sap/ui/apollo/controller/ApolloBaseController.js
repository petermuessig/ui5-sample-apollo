sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/base/BindingParser"
], (Controller, JSONModel, BindingParser) => {
	"use strict";
	return Controller.extend("sap.ui.apollo.controller.ApolloBaseController", {
		onInit: function () {
			this.apolloClient = this.getOwnerComponent().apolloClient;
			this.$mutate = this.apolloClient.mutate

			this.getView().setModel(new JSONModel({
				errors: undefined
			}));
			Object.keys(this.apollo).forEach(entity => {
				this.apollo[entity].invoke = () => {
					this.invoke(entity)
				}

				if (!this.apollo[entity].skip) {
					this.invoke(entity);
				}
			});
		},
		onApolloError (error) {
			this.getView().getModel().setProperty("/errors", this.parseApolloError(error));
		},
		parseApolloError (error) {
			let messages = "";
			if (error.graphQLErrors) {
				error.graphQLErrors.map(({ message, locations, path }) => {
					console.log(`[Apollo Client] GraphQL Error: ${message}`);
					messages += message + "\n";
				});
			}
			if (error.networkError) {
				console.log(`[Apollo Client] Network Error: ${error.networkError.message}`);
				messages += error.networkError.message;
			}
			return messages;
		},
		invoke (entity) {
			return this.apolloClient.query({
				query: this.apollo[entity].query,
				variables: this._getVariables(this.apollo[entity].variables)
			})
				.then(result => {
					const binding = BindingParser.complexParser(this.apollo[entity].binding);
					this.getView().getModel(binding && binding.model).setProperty(binding && binding.path || `/${entity}`, result.data[this.apollo[entity].query.definitions[0].selectionSet.selections[0].name.value])
				})
				.catch(error => this.onApolloError(error));
		},
		_getVariables (variables = {}) {
			let result = {};
			Object.keys(variables).forEach(key => {
				const binding = BindingParser.complexParser(variables[key]);
				if (binding) {
					result[key] = this.getView().getModel(binding.model).getProperty(binding.path);
				}
			});
			return result;
		}
	});
});
