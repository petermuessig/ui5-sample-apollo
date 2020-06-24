const { ApolloServer, gql, PubSub } = require('apollo-server');

const pubsub = new PubSub();

const TODO_ADDED = 'TODO_ADDED';
const TODO_COMPLETED = 'TODO_COMPLETED';
const TODO_DELETED = 'TODO_DELETED';

const typeDefs = gql`
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

  type Subscription {
    todoAdded: Todo
    todoCompleted: Todo
    todoDeleted: Boolean
  }
`;

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

const resolvers = {
  Query: {
    todos: () => todos,
  },
  Mutation: {
    setTodoCompletionStatus: async (_, { id, completed }, { dataSources }) => {
      let todo = todos.find(x => x.id === id)
      todo.completed = completed;
      pubsub.publish(TODO_COMPLETED, { todoCompleted: todo });
    },
    deleteCompleted: async (_) => {
      let i = todos.length;
      while (i--) {
        const todo = todos[i];
        if (todo.completed) {
          todos.splice(i, 1);
        }
      }
      pubsub.publish(TODO_DELETED, { todoDeleted: true });
      return true
    },
    createTodo: async (_, { todo }, { dataSources }) => {
      let nextId = todos.length + 1;
      const newTodo = {
        id: nextId.toString(),
        title: todo.title,
        completed: false
      }
      todos.push(newTodo)
      pubsub.publish(TODO_ADDED, { todoAdded: newTodo });
      return newTodo;
    }
  },
  Subscription: {
    todoAdded: {
      // Additional event labels can be passed to asyncIterator creation
      subscribe: () => pubsub.asyncIterator([TODO_ADDED]),
    },
    todoCompleted: {
      subscribe: () => pubsub.asyncIterator([TODO_COMPLETED]),
    },
    todoDeleted: {
      subscribe: () => pubsub.asyncIterator([TODO_DELETED]),
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  subscriptions: {
    onConnect: (connectionParams, webSocket) => {
      console.log('new connection', connectionParams)
    },
  },
});

// The `listen` method launches a web server.
server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`🚀 Server ready at ${url}`);
  console.log(`🚀 Subscriptions ready at ${subscriptionsUrl}`);
});
