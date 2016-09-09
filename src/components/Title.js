import React from 'react'
import { Link } from 'react-router'

export default () => {
  return <div className='titlePage'>
    <h2>Welcome To Sensei-Sense</h2>

    <h3>HOW TO PLAY</h3>
    <ul>
      <li>There are 4 different colored orbs in a specific order.  You have to guess what they are and what order they are in.</li>
      <li>Click and drag your colored orbs into the first row of bowls.</li>
      <li>Once you select your choice press the GO button to enter and lock in that choice.</li>
      <li>If you have a matching color or position the computer will respond with a red tag. </li>
      <li>If you have a correct color orb but in the wrong postion the computer will respond with a white tag.</li>
      <li>You have 10 chances to get the correct match of the computers exact orb colors and postions to win.</li>
    </ul>

    <button className='titleButton'><Link className='nounders' to='/game'>PLAY!</Link></button>
  </div>
}
