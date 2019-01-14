import React from 'react'
// import './index.css'

// 这是一个测试注释
const Button = props => {
  return (
    <button className={props.size || 'btn'}>button</button>
  )
}

export default Button