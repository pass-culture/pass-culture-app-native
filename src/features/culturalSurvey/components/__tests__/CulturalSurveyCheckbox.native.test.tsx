import * as React from 'react'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { render, fireEvent } from 'tests/utils'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'

describe('CulturalSurveyCheckbox', () => {
  it('should render correctly', () => {
    const CulturalSurveyCheckboxComponent = render(
      <CulturalSurveyCheckbox
        icon={culturalSurveyIcons.Museum}
        subtitle={'un monument, une exposition...'}
      />
    )
    expect(CulturalSurveyCheckboxComponent).toMatchSnapshot()
  })
  it('should render correctly when pressed', () => {
    const CulturalSurveyCheckboxComponent = render(
      <CulturalSurveyCheckbox
        icon={culturalSurveyIcons.Museum}
        subtitle={'un monument, une exposition...'}
      />
    )
    const Button = CulturalSurveyCheckboxComponent.getByTestId('CulturalSurveyAnswer')
    fireEvent.press(Button)
    expect(CulturalSurveyCheckboxComponent).toMatchSnapshot()
  })
})
