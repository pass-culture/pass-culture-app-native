import * as React from 'react'

import { CulturalSurveyCheckbox } from 'features/culturalSurvey/components/CulturalSurveyCheckbox'
import { render, fireEvent, screen } from 'tests/utils'
import { culturalSurveyIcons } from 'ui/svg/icons/bicolor/exports/culturalSurveyIcons'

describe('CulturalSurveyCheckbox', () => {
  it('should render correctly', () => {
    render(
      <CulturalSurveyCheckbox
        icon={culturalSurveyIcons.Museum}
        title="Visité un musée,"
        subtitle="un monument, une exposition..."
        selected={false}
        onPress={jest.fn()}
      />
    )
    expect(screen).toMatchSnapshot()
  })
  it('should render correctly when pressed', () => {
    render(
      <CulturalSurveyCheckbox
        icon={culturalSurveyIcons.Museum}
        title="Visité un musée,"
        subtitle="un monument, une exposition..."
        selected={false}
        onPress={jest.fn()}
      />
    )
    const Button = screen.getByLabelText('Visité un musée, un monument, une exposition...')
    fireEvent.press(Button)
    expect(screen).toMatchSnapshot()
  })
})
