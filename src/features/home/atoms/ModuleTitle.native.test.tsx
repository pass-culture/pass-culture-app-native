import React from 'react'

import { render } from 'tests/utils'

import { ModuleTitle } from './ModuleTitle'

describe('ModuleTitle component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const { toJSON } = render(<ModuleTitle title="Pour bien commencer" />)
    expect(toJSON()).toMatchSnapshot()
  })

  it('should have an ellipsis', () => {
    const { getByTestId } = render(<ModuleTitle title="Pour bien commencer" />)
    expect(getByTestId('moduleTitle').parent?.props.numberOfLines).toEqual(2)
  })
})
