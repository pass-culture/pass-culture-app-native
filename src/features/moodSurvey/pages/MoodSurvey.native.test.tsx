import React from 'react'

import { render } from 'tests/utils'

import { MoodSurvey } from './MoodSurvey'

describe('<MoodSurvey />', () => {
  it('should render correctly', () => {
    const page = render(<MoodSurvey />)
  
    expect(page).toMatchSnapshot()
  })
})
