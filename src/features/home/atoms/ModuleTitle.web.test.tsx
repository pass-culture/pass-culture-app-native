import React from 'react'

import { render } from 'tests/utils/web'

import { ModuleTitle } from './ModuleTitle'

describe('ModuleTitle component', () => {
  afterAll(() => jest.resetAllMocks())

  it('should render correctly', () => {
    const renderAPI = render(<ModuleTitle title="Pour bien commencer" />)
    expect(renderAPI).toMatchSnapshot()
  })
})
