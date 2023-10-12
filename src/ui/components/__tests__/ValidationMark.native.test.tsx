import React from 'react'

import { render, screen } from 'tests/utils'

import { ValidationMark } from '../ValidationMark'

describe('ValidationMark', () => {
  it('should display the validIcon when isValid is true', () => {
    render(<ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid />)

    expect(screen.queryByTestId('invalidTestId')).not.toBeOnTheScreen()
    expect(screen.queryByTestId('validTestId')).toBeOnTheScreen()
  })
  it('should displat the invalidIcon when isValid is false', () => {
    render(
      <ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid={false} />
    )

    expect(screen.queryByTestId('invalidTestId')).toBeOnTheScreen()
    expect(screen.queryByTestId('validTestId')).not.toBeOnTheScreen()
  })
})
