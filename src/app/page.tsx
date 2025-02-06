'use client'

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState<Array<{ id: number; title: string; completed: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newTodo, setNewTodo] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = () => {
    fetch('/api/todos')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch todos');
        }
        return response.json();
      })
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setTodos(data);
        } else {
          setTodos([]);
        }
        setIsLoading(false);
        setError(null);
      })
      .catch(error => {
        console.error('Error fetching todos:', error);
        setIsLoading(false);
        setError('Failed to load todos. Please try again.');
      });
  };

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTodo.trim(), completed: false }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to add todo');
        return response.json();
      })
      .then(() => {
        setNewTodo("");
        fetchTodos();
      })
      .catch(error => {
        console.error('Error adding todo:', error);
        setError('Failed to add todo. Please try again.');
      });
  };

  const updateTodo = (id: number, completed?: boolean, title?: string) => {
    const updatedData = {
      id,
      ...(completed !== undefined && { completed }),
      ...(title !== undefined && { title })
    };

    fetch('/api/todos', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to update todo');
        return response.json();
      })
      .then(() => {
        setTodos(currentTodos => 
          currentTodos.map(todo => 
            todo.id === id ? { ...todo, ...updatedData } : todo
          )
        );
        setEditingId(null);
        setEditText("");
      })
      .catch(error => {
        console.error('Error updating todo:', error);
        setError('Failed to update todo. Please try again.');
      });
  };

  const deleteTodo = (id: number) => {
    fetch('/api/todos', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
      .then(response => {
        if (!response.ok) throw new Error('Failed to delete todo');
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id));
      })
      .catch(error => {
        console.error('Error deleting todo:', error);
        setError('Failed to delete todo. Please try again.');
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-8">
      <main className="max-w-2xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Todo List</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={addTodo} className="mb-4">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="mt-2 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600" disabled={!newTodo.trim()}>
            Add Todo
          </button>
        </form>
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : todos.length > 0 ? (
          <ul className="space-y-3">
            {todos.map(todo => (
              <li key={todo.id} className={`p-3 bg-gray-50 rounded-md shadow transition-all duration-300 hover:shadow-md ${todo.completed ? 'opacity-50' : ''}`}>
                <div className="flex items-center justify-between">
                  {editingId === todo.id ? (
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (editText.trim()) {
                          updateTodo(todo.id, undefined, editText.trim());
                        }
                      }}
                      className="flex-1 mr-2 flex gap-2"
                    >
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 p-1 border border-gray-300 rounded"
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') {
                            setEditingId(null);
                            setEditText("");
                          }
                        }}
                      />
                      <button
                        type="submit"
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                        disabled={!editText.trim()}
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(null);
                          setEditText("");
                        }}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                      >
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <span 
                      className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                      onClick={() => updateTodo(todo.id, !todo.completed)}
                    >
                      {todo.title}
                    </span>
                  )}
                  <div className="flex gap-2">
                    {editingId !== todo.id && (
                      <button 
                        onClick={() => {
                          setEditingId(todo.id);
                          setEditText(todo.title);
                        }}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        Edit
                      </button>
                    )}
                    <button 
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600">No todos found. Start adding some!</p>
        )}
      </main>
    </div>
  );
}
