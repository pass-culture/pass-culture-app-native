import * as React from 'react'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { render, fireEvent } from 'tests/utils'

describe('CulturalSurveyCheckbox', () => {
  it('should render correctly', () => {
    const CulturalSurveyCheckboxComponent = render(<CulturalSurveyCheckbox />)
    expect(CulturalSurveyCheckboxComponent).toMatchSnapshot()
  })
  it('should render correctly when pressed', () => {
    const CulturalSurveyCheckboxComponent = render(<CulturalSurveyCheckbox />)
    const Button = CulturalSurveyCheckboxComponent.getByTestId('CulturalSurveyAnswer')
    fireEvent.press(Button)
    expect(CulturalSurveyCheckboxComponent).toMatchSnapshot()
  })
})
