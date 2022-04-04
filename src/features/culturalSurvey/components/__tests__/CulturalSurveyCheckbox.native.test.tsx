import * as React from 'react'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { render, fireEvent } from 'tests/utils'
import CulturalSurveyIcons from 'ui/svg/icons/culturalSurvey'

describe('CulturalSurveyCheckbox', () => {
  it('should render correctly', () => {
    const CulturalSurveyCheckboxComponent = render(
      <CulturalSurveyCheckbox
        icon={CulturalSurveyIcons.MuseumIcon}
        subtitle={'un monument, une exposition...'}
      />
    )
    expect(CulturalSurveyCheckboxComponent).toMatchSnapshot()
  })
  it('should render correctly when pressed', () => {
    const CulturalSurveyCheckboxComponent = render(
      <CulturalSurveyCheckbox
        icon={CulturalSurveyIcons.MuseumIcon}
        subtitle={'un monument, une exposition...'}
      />
    )
    const Button = CulturalSurveyCheckboxComponent.getByTestId('CulturalSurveyAnswer')
    fireEvent.press(Button)
    expect(CulturalSurveyCheckboxComponent).toMatchSnapshot()
  })
})
