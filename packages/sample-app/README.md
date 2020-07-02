# Steps to enable this sample to communicate with a GraphQL Service:

> Installation part!

The sample you find here was only modified in the aspect of removing the todo mockdata.

- Update the `dataSources` entry in the `manifest.json` to point to our local GraphQL Service
```json
"dataSources": {
    "graphql": {
        "uri": "http://localhost:4000/graphql",
    }
}
```
- Introduce the Apollo Client in your `component.js`
```javascript
sap.ui.define([
    "sap/ui/core/UIComponent",
    "apollo/client/thirdparty/apollo",
    "sap/ui/core/ComponentSupport"
], function(UIComponent, UI5Apollo) {
	"use strict";

	const {
		ApolloClient,
		InMemoryCache,
		HttpLink
	} = UI5Apollo;

	return UIComponent.extend("sap.ui.demo.todo.Component", {
		metadata: {
			manifest: "json"
		},
		createContent: function() {
			this.apolloClient = new ApolloClient({
				cache: new InMemoryCache(),
				link: new HttpLink({ uri: this.getMetadata().getManifestEntry("/sap.app/dataSources/graphql/uri") }),
				name: 'ui5-client',
				version: '1.0',
				defaultOptions: {//sadly we cannot rely on apollo cache currently
					watchQuery: {
						fetchPolicy: 'no-cache' 
					},
					query: {
						fetchPolicy: 'no-cache' 
					},
					mutate: {
						fetchPolicy: 'no-cache'
					}
				}
			});
			return UIComponent.prototype.createContent.apply(this, arguments);
		}
	});
});
```
- Add these additional dependencies to the controller
```javascript
...
	"apollo/client/thirdparty/apollo",
	"apollo/client/controller/ApolloBaseController"
], function(Device, Controller, Filter, FilterOperator, JSONModel, UI5Apollo, ApolloBaseController) {
```
- Now instead of using the default controller override it with the apolloBaseController provided by our lib.
```javascript
return ApolloBaseController.extend("sap.ui.demo.todo.controller.App", {
```
- In order to use the apolloBaseController you have to call it in the onInit method
```javascript
onInit: function () {
	ApolloBaseController.prototype.onInit.apply(this, arguments);
```
- Add gql module to define your first query
```javascript
const { gql } = UI5Apollo;
```
- You can now add your first query as part of your normal controller definition
```javascript
...
return ApolloBaseController.extend("sap.ui.demo.todo.controller.App", {
    apollo: {
        todos: {
            binding: "{/todos}", // (optional) as the name of this object is todos it would be defaulted to "todos"
            query: gql`
                query GetToDos {
                    todos {
                        id
                        title
                        completed
                    }
                }
            `,
        },
    },
...
```
- That query will be automatically executed when loading the view
