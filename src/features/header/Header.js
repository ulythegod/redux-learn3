import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import {saveNewTodo} from '../todos/todosSlice'

const Header = () => {
  const [text, setText] = useState('')
  const [status, setStatus] = useState('idle')
  const dispatch = useDispatch();

  const handleChange = (e) => setText(e.target.value)

  const handleKeyDown = async e => {
    //если пользователь нажал на энтер
    const trimmedText = text.trim()
    if (e.which === 13 && trimmedText) {
      //создать и отправить саму thunk функцию
      setStatus('loading')
      //подождать возвращенный saveNewTodo промис
      await dispatch(saveNewTodo(trimmedText))
      //очистить текстовый инпут
      setText('')
      setStatus('idle')
    }
  }

  let isLoading = status === 'loading'
  let placeholder = isLoading ? '' : 'What needs to be done?'
  let loader = isLoading ? <div className='loader' /> : null


  return (
    <header className="header">
      <input
        className="new-todo"
        placeholder={placeholder}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isLoading}
      />
      {loader}
    </header>
  )
}

export default Header
