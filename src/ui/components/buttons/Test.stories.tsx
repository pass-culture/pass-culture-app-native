import React from 'react'

export default {
  title: 'button',
}

export const Accessible = () => <button>Accessible button</button>

export const Inaccessible = () => (
  <button style={{ backgroundColor: 'red', color: 'darkRed' }}>Inaccessible button</button>
)
