import { useEffect, useState } from 'react'

const STORAGE_KEY = 'todos-app'

function App() {
  const [filter, setfilter] = useState('all') //'all' vagy 'active' vagy 'completed'

  // todo-k belso allapota
  const [todos, setTodos] = useState(() =>{
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.log(`Hiba a localstorage beolvasasakor: ${error}`);
      return []
    }
  })

  // az input mezo belso allapota
  const [input, setInput] = useState('')

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') {
      return !todo.completed
    }
    if (filter === 'completed') {
      return todo.completed
    }
    return true
  })

  // const toggleTodo = (id) => {
  //   setTodos((prev) => {
  //     prev.map((prevTodo) => {
  //       let newTodo;
  //       if (prevTodo.id === id) {
  //         newTodo.id = prevTodo.id,
  //         newTodo.text = prevTodo.text,
  //         newTodo.completed = !prevTodo.completed
  //       } else {
  //         newTodo = prevTodo
  //       }

  //       return newTodo;
  //     })
  //   })
  // }

  const toggleTodo = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo
      )
    )
  }

  const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((prevTodo) => prevTodo.id !== id))
  }

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((prevTodo) => !prevTodo.completed))
  }

  const addTodo = () => {
    const text = input.trim()

    if (!text) {
      return
    }

    const newTodo = {
      id: crypto.randomUUID(),
      text: text,
      completed: false,
      createdAt: Date.now()
    }

    setTodos((todos) => [newTodo, ...todos])

    setInput('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTodo()
    }
  }

  const activeCount = todos.filter((todo) => !todo.completed).length

  //mellekhatasok

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
    } catch (error) {
      console.log(`Hiba a localstorage irasakor : ${error}`);
    }
  }, [todos])

  // jsx-el valo visszateres
  return (
    <div className='app-root'>
      <div className="todo-card">
        <header className="todo-header">
          <h1>Teendőlista</h1>
          <p className="subtitle">Egyszerű todo app</p>
        </header>

        <div className="input-row">
          <input type="text" maxLength={70} placeholder='Új feladat hozzáadása..' value={input} onChange={(event) => setInput(event.target.value)} onKeyDown={handleKeyDown} />
          <button type="button" onClick={addTodo}>Hozzáad</button>
        </div>

        {todos.length > 0 ? (
          <>
            {/* ha mar van todo listank */}
            <div className="toolbar">
              <div className="filter">
                <button type="button" className={filter === 'all' ? 'black' : ''} onClick={() => setfilter('all')}>Mind</button>
                <button type="button" className={filter === 'active' ? 'black' : ''} onClick={() => setfilter('active')}>Aktiv</button>
                <button type="button" className={filter === 'completed' ? 'black' : ''} onClick={() => setfilter('completed')}>Kész</button>
              </div>
              <button type="button" className='clear-btn' disabled={todos.length === 0} onClick={clearCompleted}>Kész feladatok törlése</button>
            </div>

            <ul className="todo-list">
              {filteredTodos.map((todo) => {
                return <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                  <label className="todo-item">
                    <input type="checkbox" checked={todo.completed} onChange={() => { toggleTodo(todo.id) }} />
                    <span className="todo-text">{todo.text}</span>
                  </label>
                  <button type="button" className="delete-btn" onClick={() => deleteTodo(todo.id)}>X</button>
                </li>
              })}
            </ul>

            <footer>
              <span>{activeCount} feladat hátra</span>
            </footer>
          </>
        ) : (
          // ha meg nincs todo listank
          <p className="empty-state">Még nincs teendőd. Irj be valamit fent és nyomd meg a <strong>Hozzáad</strong> gombot!</p>
        )}


      </div>
    </div>
  )
}

export default App