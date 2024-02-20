import React from 'react'

import { FavoriteListSurveyModal } from 'features/favorites/favoriteList/FakeDoor/FavoriteListSurveyModal'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { fireEvent, render, screen } from 'tests/utils'

const hideModalMock = jest.fn()
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('FavoriteListSurveyModal', () => {
  it('should render correctly', () => {
    render(<FavoriteListSurveyModal visible hideModal={hideModalMock} />)

    expect(screen).toMatchSnapshot()
  })

  it('should display nothing if modal is not visible', () => {
    render(<FavoriteListSurveyModal visible={false} hideModal={hideModalMock} />)

    expect(screen.toJSON()).not.toBeOnTheScreen()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    render(<FavoriteListSurveyModal visible hideModal={hideModalMock} />)
    const rightIcon = screen.getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)

    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should open survey when clicking the button', () => {
    render(<FavoriteListSurveyModal visible hideModal={hideModalMock} />)
    fireEvent.press(screen.getByText('Répondre au questionnaire'))

    expect(openUrl).toHaveBeenCalledWith(
      'https://passculture.qualtrics.com/jfe/form/SV_0qAg2IoZijISBsG',
      undefined,
      true
    )
  })
})
