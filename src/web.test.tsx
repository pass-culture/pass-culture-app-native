import { render, screen } from '@testing-library/react'
import React from 'react'
import { expect, it } from 'vitest'

import { Toto } from './Toto'
// import '@testing-library/jest-dom/vitest' // https://stackoverflow.com/a/78064446

it('test', () => {
  render(<Toto />)

  expect(screen.getByTestId('toto')).toBeDefined()
})

it('test2', async () => {
  render(<Toto />)

  expect(screen.getByTestId('toto')).toContainHTML('COCO')

  //   await expect.element(getByText('Hello Vitest x2!')).toBeInTheDocument()
})
