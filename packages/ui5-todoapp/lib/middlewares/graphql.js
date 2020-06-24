let graphql = require("express-graphql");
let { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
let schema = buildSchema(`
	input TodoInput {
		title: String
	}

	type Todo {
		id: ID!
		title: String
		completed: Boolean
	}

	type Query {
		todos: [Todo]
	}

	type Mutation {
		createTodo(todo: TodoInput): Todo
		deleteCompleted: Boolean
		setTodoCompletionStatus(id: ID!, completed: Boolean!): Todo
	}
`);

// Todo data store
let todos = [
	{
		"id": "1",
		"title": "Start this app",
		"completed": true
	},
	{
		"id": "2",
		"title": "Learn OpenUI5",
		"completed": false
	}
];


// The root provides a resolver function for each API endpoint
let root = {
	todos: () => {
		return todos;
	},
	createTodo: ({ todo }) => {
		let nextId = todos.length + 1;
		const newTodo = {
			id: nextId.toString(),
			title: todo.title,
			completed: false
		}
		todos.push(newTodo)
		console.log(todos)
		return newTodo;
	},
	setTodoCompletionStatus: ({id, completed}) => {
		todos.find(x => x.id === id).completed = completed;
	},
	deleteCompleted: () => {
		var i = todos.length;
		while (i--) {
			var todo = todos[i];
			if (todo.completed) {
				todos.splice(i, 1);
			}
		}
		return true
	}
};


/**
 * Custom UI5 Server middleware example
 *
 * @param {Object} parameters Parameters
 * @param {Object} parameters.resources Resource collections
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.all Reader or Collection to read resources of the
 *                                        root project and its dependencies
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.rootProject Reader or Collection to read resources of
 *                                        the project the server is started in
 * @param {module:@ui5/fs.AbstractReader} parameters.resources.dependencies Reader or Collection to read resources of
 *                                        the projects dependencies
 * @param {Object} parameters.options Options
 * @param {string} [parameters.options.configuration] Custom server middleware configuration if given in ui5.yaml
 * @returns {function} Middleware function to use
 */
module.exports = function ({ resources, options }) {
	return graphql({
		schema: schema,
		rootValue: root,
		graphiql: true
	});
};
