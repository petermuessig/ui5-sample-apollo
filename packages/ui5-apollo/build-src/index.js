import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { split } from 'apollo-link';
//const ApolloUtilities = require('apollo-utilities')
//const ApolloLink = require('apollo-link')
import { default as gql } from "graphql-tag";

if (window.sap && sap.ui && sap.ui.loader && typeof sap.ui.loader.config) {
	sap.ui.loader.config({
		shim: {
			"sap/ui/apollo/thirdparty/apollo.min": {
				exports: "UI5Apollo"
			}
		}
	});
}

export default {
	ApolloClient,
	InMemoryCache,
	HttpLink,
	WebSocketLink,
	//ApolloLink,
	split,
	//ApolloUtilities,
	getMainDefinition,
	gql
};
