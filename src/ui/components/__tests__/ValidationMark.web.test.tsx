import React from 'react'

import { render, screen } from 'tests/utils/web'

import { ValidationMark } from '../ValidationMark'

describe('ValidationMark', () => {
  it('should display the validIcon when isValid is true', () => {
    render(<ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid />)
    expect(screen.queryByTestId('invalidTestId')).not.toBeInTheDocument()
    expect(screen.queryByTestId('validTestId')).toBeInTheDocument()
  })
  it('should display the invalidIcon when isValid is false', () => {
    render(
      <ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid={false} />
    )
    expect(screen.queryByTestId('invalidTestId')).toBeInTheDocument()
    expect(screen.queryByTestId('validTestId')).not.toBeInTheDocument()
  })
})
