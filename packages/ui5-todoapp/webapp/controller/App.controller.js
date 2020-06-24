sap.ui.define([
	"sap/ui/Device",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/json/JSONModel",
	"apollo/client/thirdparty/apollo",
	"apollo/client/controller/ApolloBaseController"
], function(Device, Filter, FilterOperator, JSONModel, UI5Apollo, ApolloBaseController) {
	"use strict";

	const { gql } = UI5Apollo;

	const GET_TODOS = gql`
		query GetToDos {
			todos {
				id
				title
				completed
			}
		}
	`;

	const TODO_ADDED_SUBSCRIPTION = gql`
		subscription onTodoAdded {
			todoAdded {
				id
				title
				completed
			}
		}
	`;

	const TODO_COMPLETED_SUBSCRIPTION = gql`
		subscription onTodoCompleted {
			todoCompleted {
				id
				title
				completed
			}
		}
	`;

	const TODO_DELETED_SUBSCRIPTION = gql`
		subscription onTodoDeleted {
			todoDeleted
		}
	`;


	return ApolloBaseController.extend("sap.ui.demo.todo.controller.App", {

		apollo: {
			todos: {
				binding: "{/todos}", 
				query: GET_TODOS,
			},
		},

		onInit: function () {
			ApolloBaseController.prototype.onInit.apply(this, arguments);
			this.aSearchFilters = [];
			this.aTabFilters = [];

			this.getView().setModel(new JSONModel({
				isMobile: Device.browser.mobile,
				filterText: undefined
			}), "view");

			// Event Subscription: callback just reloads the todos again!
			let that = this;

			const updateOnEvent = {
				next(data) {
					console.log(data)
					that.apollo.todos.invoke();
					// ... call updateQuery to integrate the new comment
					// into the existing list of comments
				},
				error(err) { 
					console.error("err", err);
				},
			};

			this.$subscribe({
				query: TODO_ADDED_SUBSCRIPTION
			}).subscribe(updateOnEvent);

			this.$subscribe({
				query: TODO_COMPLETED_SUBSCRIPTION
			}).subscribe(updateOnEvent);

			this.$subscribe({
				query: TODO_DELETED_SUBSCRIPTION
			}).subscribe(updateOnEvent);

		},

		/**
		 * Adds a new todo item to the bottom of the list.
		 */
		addTodo: function() {
			const oModel = this.getView().getModel("todos");

			// create the new todo item via mutate call
			this.$mutate({
				mutation: gql`mutation CreateTodo($title: String) {
					createTodo(todo: { title: $title }) {
						id
						title
						completed
					}
				}`,
				variables: {
					title: oModel.getProperty("/newTodo")
				},
			}).then(( /* response */ ) => {
				// clean the new todo input
				oModel.setProperty("/newTodo", "");
			});

		},

		updateTodo: function(oEvent /*, id */) {
			// update the selected state of the todo item via mutate call
			this.$mutate({
				mutation: gql`mutation setTodoCompletionStatus($id: ID!, $completed: Boolean!) {
					setTodoCompletionStatus(id: $id, completed: $completed) {
						id
						title
						completed
					}
				}`,
				variables: {
					id: oEvent.getSource().getName(),
					completed: oEvent.getParameter("selected")
				},
			}).then(( /* response */ ) => { /* do nothing on callback, eventing/subscriptions will be notified */ });
		},

		/**
		 * Removes all completed items from the todo list.
		 */
		clearCompleted: function() {
			// call the deleteCompleted mutation of the GraphQL server
			this.$mutate({
				mutation: gql`mutation deleteCompleted {
					deleteCompleted
				}`
			}).then(( /* response */ ) => { /* do nothing on callback, eventing/subscriptions will be notified */ });
		},

		/**
		 * Updates the number of items not yet completed
		 */
		updateItemsLeftCount: function() {
			var oModel = this.getView().getModel("todos");
			var aTodos = oModel.getProperty("/todos") || [];

			var iItemsLeft = aTodos.filter(function(oTodo) {
				return oTodo.completed !== true;
			}).length;

			oModel.setProperty("/itemsLeftCount", iItemsLeft);
		},

		/**
		 * Trigger search for specific items. The removal of items is disable as long as the search is used.
		 * @param {sap.ui.base.Event} oEvent Input changed event
		 */
		onSearch: function(oEvent) {
			var oModel = this.getView().getModel("todos");

			// First reset current filters
			this.aSearchFilters = [];

			// add filter for search
			this.sSearchQuery = oEvent.getSource().getValue();
			if (this.sSearchQuery && this.sSearchQuery.length > 0) {
				oModel.setProperty("/itemsRemovable", false);
				var filter = new Filter("title", FilterOperator.Contains, this.sSearchQuery);
				this.aSearchFilters.push(filter);
			} else {
				oModel.setProperty("/itemsRemovable", true);
			}

			this._applyListFilters();
		},

		onFilter: function(oEvent) {
			// First reset current filters
			this.aTabFilters = [];

			// add filter for search
			this.sFilterKey = oEvent.getParameter("item").getKey();

			// eslint-disable-line default-case
			switch (this.sFilterKey) {
				case "active":
					this.aTabFilters.push(new Filter("completed", FilterOperator.EQ, false));
					break;
				case "completed":
					this.aTabFilters.push(new Filter("completed", FilterOperator.EQ, true));
					break;
				case "all":
				default:
					// Don't use any filter
			}

			this._applyListFilters();
		},

		_applyListFilters: function() {
			var oList = this.byId("todoList");
			var oBinding = oList.getBinding("items");

			oBinding.filter(this.aSearchFilters.concat(this.aTabFilters), "todos");

			var sI18nKey;
			if (this.sFilterKey && this.sFilterKey !== "all") {
				if (this.sFilterKey === "active") {
					sI18nKey = "ACTIVE_ITEMS";
				} else {
					// completed items: sFilterKey = "completed"
					sI18nKey = "COMPLETED_ITEMS";
				}
				if (this.sSearchQuery) {
					sI18nKey += "_CONTAINING";
				}
			} else if (this.sSearchQuery) {
				sI18nKey = "ITEMS_CONTAINING";
			}

			var sFilterText;
			if (sI18nKey) {
				var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
				sFilterText = oResourceBundle.getText(sI18nKey, [this.sSearchQuery]);
			}

			this.getView().getModel("view").setProperty("/filterText", sFilterText);
		},

	});

});
