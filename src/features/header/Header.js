import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

const Header = () => {
  const [text, setText] = useState('')
  const dispatch = useDispatch();

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = e => {
    const trimmedText = e.target.value.trim();
    //если пользователь нажимает кнопку энтер
    if (e.key === 'Enter' && trimmedText) {
      //отправка действия "todo added" с текстом
      dispatch({ type: 'todos/todoAdded', payload: trimmedText});
      //очистка всего инпута
      setText('');
    }
  }

  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
    </header>
  )
}

export default Header
