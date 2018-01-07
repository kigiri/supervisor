import React from 'react'

export default ({ size, style }) => (
  <svg viewBox="0 0 50 50" style={{ width: size, height: size }}>
    <defs>
      <radialGradient id="g" fy="0">
        <stop stopColor="#F7AEF8"></stop>
        <stop offset="100%" stopColor="#777FFF"></stop>
      </radialGradient>
    </defs>
    <path fill="url(#g)" d="M25 0L0 25l5 5 20-20 20 20 5-5M25 40l-5 5 5 5 5-5M25 20L10 35l5 5 10-10 10 10 5-5"></path>
  </svg>
)
