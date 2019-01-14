import React from 'react'

const Input = props => {
  return (
    <input
      type='text'
      className={props.size || 'input'}
    />
  )
}

export default Input