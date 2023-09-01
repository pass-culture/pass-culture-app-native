import React from 'react'

import { render } from 'tests/utils'

import { ValidationMark } from '../ValidationMark'

describe('ValidationMark', () => {
  it('should display the validIcon when isValid is true', () => {
    const { queryByTestId } = render(
      <ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid />
    )
    expect(queryByTestId('invalidTestId')).toBeNull()
    expect(queryByTestId('validTestId')).toBeOnTheScreen()
  })
  it('should displat the invalidIcon when isValid is false', () => {
    const { queryByTestId } = render(
      <ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid={false} />
    )
    expect(queryByTestId('invalidTestId')).toBeOnTheScreen()
    expect(queryByTestId('validTestId')).toBeNull()
  })
})
