import React from 'react'

import { FAQ_LINK_USER_DATA } from 'features/culturalSurvey/constants'
import { CulturalSurveyIntro } from 'features/culturalSurvey/pages/CulturalSurveyIntro'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { fireEvent, render, screen } from 'tests/utils/web'

jest.mock('libs/network/NetInfoWrapper')
jest.mock('features/culturalSurvey/helpers/useGetNextQuestion')
jest.mock('features/navigation/helpers/openUrl')
jest.mock('features/culturalSurvey/context/CulturalSurveyContextProvider')
jest.mock('ui/theme/customFocusOutline/customFocusOutline')

describe('CulturalSurveyIntro page', () => {
  it('should render the page with correct layout', () => {
    const { container } = render(<CulturalSurveyIntro />)

    expect(container).toMatchSnapshot()
  })

  it('should open FAQ url when pressing En savoir plus', () => {
    render(<CulturalSurveyIntro />)

    const FAQButton = screen.getByText('En savoir plus')
    fireEvent.click(FAQButton)

    expect(openUrl).toHaveBeenCalledWith(FAQ_LINK_USER_DATA, undefined, true)
  })
})
