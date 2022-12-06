import { createSlice } from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
// getTodos

const getTodosFromLocaleStorage = () => {
  if (typeof window !== "undefined") {
    const todos = localStorage.getItem("todos");
    if (todos) {
      return JSON.parse(todos);
    } else {
      localStorage.setItem("todos", JSON.stringify([]));
      return [];
    }
  } else {
    return false;
  }
};

// getSavedTodos

const getSaveTodosFromLocaleStorage = () => {
  if (typeof window !== "undefined") {
    const saveTodos = localStorage.getItem("saveTodos");
    if (saveTodos) {
      return JSON.parse(saveTodos);
    } else {
      localStorage.setItem("saveTodos", JSON.stringify([]));
      return [];
    }
  }
};

// initialStateTodos

const initialStateTodos = {
  todos: getTodosFromLocaleStorage(),
  saveTodos: getSaveTodosFromLocaleStorage(),
};

// todoSlice

const todoSlice = createSlice({
  name: "todo",
  initialState: initialStateTodos,
  reducers: {
    // addTodo

    addTodo(state, action) {
      state.todos.unshift(action.payload);
      let todos;
      if (typeof window !== undefined) {
        todos = localStorage.getItem("todos");
      } else {
        todos = state.todos;
      }
      if (todos) {
        const todosArray = JSON.parse(todos);
        todosArray.unshift(action.payload);
        localStorage.setItem("todos", JSON.stringify(todosArray));
      } else {
        localStorage.setItem(
          "todos",
          JSON.stringify([
            {
              ...action.payload,
            },
          ])
        );
      }
    },
    // deleteTodo

    deleteTodo(state, action) {
      const { id } = action.payload;
      if (typeof window !== "undefined") {
        const todos = localStorage.getItem("todos");
        if (todos) {
          const todosArray = JSON.parse(todos);
          let existTodos = todosArray.filter((todo) => todo.id === id);

          localStorage.setItem("todos", JSON.stringify(todosArray));
          state.todos = existTodos;
        }
      }
    },
    // editTodo

    editTodo(state, action) {
      const { id, text } = action.id;
      if (typeof window !== "undefined") {
        const todos = localStorage.getItem("todos");

        if (todos) {
          const todosArray = JSON.parse(todos);
          let existTodo = todosArray.find((todos) => todos.id === id);
          if (existTodo) {
            existTodo.text = text;
          }
          localStorage.setItem("todos", JSON.stringify(todosArray));
          state.todos = [...todosArray];
        }
      }
    },
    // saveTodos

    saveTodos(state, action) {
      const { id } = action.payload;
      if (window !== undefined) {
        const todos = localStorage.getItem("saveTodos");

        if (todos) {
          const saveTodosArray = JSON.parse(todos);
          let existTodoSaved = state.todos.find((todo) => todo.id === id);
          if (existTodoSaved) {
            saveTodosArray.unshift(existTodoSaved);
          }
          localStorage.setItem("saveTodos", JSON.stringify(saveTodosArray));
          state.saveTodos = [...saveTodosArray];
        }
      }
    },
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action,
      };
    },
  },
});

export const { addTodo, deleteTodo, editTodo, saveTodos } = todoSlice.actions;

export default todoSlice.reducer;
