import React from 'react'

import { FavoriteListSurveyModal } from 'features/favorites/favoriteList/FakeDoor/FavoriteListSurveyModal'
import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { storage } from 'libs/storage'
import { fireEvent, render } from 'tests/utils'

const hideModalMock = jest.fn()
const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

const FAV_LIST_FAKE_DOOR_STORAGE_KEY = 'has_seen_fav_list_fake_door'
describe('FavoriteListSurveyModal', () => {
  beforeEach(() => {
    storage.clear(FAV_LIST_FAKE_DOOR_STORAGE_KEY)
  })

  it('should render correctly', () => {
    const renderAPI = render(<FavoriteListSurveyModal visible hideModal={hideModalMock} />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should display nothing if modal is not visible', () => {
    const renderAPI = render(<FavoriteListSurveyModal visible={false} hideModal={hideModalMock} />)
    expect(renderAPI.toJSON()).toBeNull()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    const { getByTestId } = render(<FavoriteListSurveyModal visible hideModal={hideModalMock} />)
    const rightIcon = getByTestId('Fermer la modale')
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalledTimes(1)
  })

  it('should open survey when clicking the button', () => {
    const { getByText } = render(<FavoriteListSurveyModal visible hideModal={hideModalMock} />)
    fireEvent.press(getByText('Répondre au questionnaire'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://passculture.qualtrics.com/jfe/form/SV_0qAg2IoZijISBsG',
      undefined,
      true
    )
  })

  it('should save in storage when the user has seen favorite list offer modal', async () => {
    render(<FavoriteListSurveyModal visible hideModal={jest.fn()} />)

    expect(await storage.readObject(FAV_LIST_FAKE_DOOR_STORAGE_KEY)).toBeTruthy()
  })

  it('should not save in storage when the user has not seen favorite list offer modal', async () => {
    render(<FavoriteListSurveyModal visible={false} hideModal={jest.fn()} />)

    expect(await storage.readObject(FAV_LIST_FAKE_DOOR_STORAGE_KEY)).toBeFalsy()
  })
})
