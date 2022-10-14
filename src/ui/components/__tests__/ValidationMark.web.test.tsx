import React from 'react'

import { render } from 'tests/utils/web'

import { ValidationMark } from '../ValidationMark'

describe('ValidationMark', () => {
  it('should display the validIcon when isValid is true', () => {
    const { queryByTestId } = render(
      <ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid />
    )
    expect(queryByTestId('invalidTestId')).toBeFalsy()
    expect(queryByTestId('validTestId')).toBeTruthy()
  })
  it('should display the invalidIcon when isValid is false', () => {
    const { queryByTestId } = render(
      <ValidationMark invalidTestID="invalidTestId" validtestID="validTestId" isValid={false} />
    )
    expect(queryByTestId('invalidTestId')).toBeTruthy()
    expect(queryByTestId('validTestId')).toBeFalsy()
  })
})
