import React from 'react'

import { render } from 'tests/utils/web'

import { ModuleTitle } from '../ModuleTitle'

describe('ModuleTitle component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = render(<ModuleTitle title="Pour bien commencer" />)
    expect(renderAPI).toMatchSnapshot()
  })

  // FIXME: web integration
  it.skip('should have an ellipsis [WEB FIXME]', () => {
    const { getByTestId } = render(<ModuleTitle title="Pour bien commencer" />)
    expect(getByTestId('moduleTitle').parent?.props.numberOfLines).toEqual(2)
  })
})
