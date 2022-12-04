import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { AgeSelectionOther } from 'features/onboarding/pages/AgeSelectionOther'
import { env } from 'libs/environment/__mocks__/envFixtures'
import { fireEvent, render } from 'tests/utils'

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('AgeSelectionOther', () => {
  it('should render correctly', () => {
    const renderAPI = render(<AgeSelectionOther />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should navigate to FAQ when pressing "Je suis un parent"', () => {
    const { getByTestId } = render(<AgeSelectionOther />)
    const button = getByTestId('Je suis un parent')

    fireEvent.press(button)
    expect(openUrl).toHaveBeenCalledWith(env.FAQ_LINK_LEGAL_GUARDIAN, undefined)
  })
})
