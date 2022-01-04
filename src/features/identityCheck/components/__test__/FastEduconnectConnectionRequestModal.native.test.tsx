import React from 'react'

import { navigate } from '__mocks__/@react-navigation/native'
import { IdentityCheckMethod } from 'api/gen'
import { FastEduconnectConnectionRequestModal } from 'features/identityCheck/components/FastEduconnectConnectionRequestModal'
import { initialIdentityCheckState as mockState } from 'features/identityCheck/context/reducer'
import { fireEvent, render } from 'tests/utils'

const hideModalMock = jest.fn()
const mockDispatch = jest.fn()

jest.mock('features/auth/api')
jest.mock('features/identityCheck/context/IdentityCheckContextProvider', () => ({
  useIdentityCheckContext: jest.fn(() => ({
    dispatch: mockDispatch,
    ...mockState,
  })),
}))
jest.mock('libs/firestore/ubbleETAMessage', () => ({
  useUbbleETAMessage: jest.fn(() => ({ data: 'Environ 3 heures' })),
}))

describe('<IdentityCheckEnd/>', () => {
  it('should render correctly if modal visible', () => {
    const renderAPI = render(
      <FastEduconnectConnectionRequestModal visible={true} hideModal={hideModalMock} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should render correctly if modal not visible', () => {
    const renderAPI = render(
      <FastEduconnectConnectionRequestModal visible={false} hideModal={hideModalMock} />
    )
    expect(renderAPI).toMatchSnapshot()
  })

  it('should call hideModal function when clicking on Close icon', () => {
    const { getByTestId } = render(
      <FastEduconnectConnectionRequestModal visible={true} hideModal={hideModalMock} />
    )
    const rightIcon = getByTestId(
      "Fermer la modale de propositions d'identifications avec ÉduConnect ou Démarches Simplifiées"
    )
    fireEvent.press(rightIcon)
    expect(hideModalMock).toHaveBeenCalled()
  })

  it('should redirect to EduConnect when cliking on "Identification avec ÉduConnect" button', () => {
    const { getByText } = render(
      <FastEduconnectConnectionRequestModal visible={true} hideModal={hideModalMock} />
    )
    fireEvent.press(getByText('Identification avec ÉduConnect'))
    expect(hideModalMock).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: IdentityCheckMethod.educonnect,
      type: 'SET_METHOD',
    })
    expect(navigate).toHaveBeenNthCalledWith(1, 'IdentityCheckEduConnect')
  })

  it('should redirect to identity check Ubble or DMS when cliking on "Identification manuelle" button', () => {
    const { getByText } = render(
      <FastEduconnectConnectionRequestModal visible={true} hideModal={hideModalMock} />
    )
    fireEvent.press(getByText('Identification manuelle'))
    expect(hideModalMock).toHaveBeenCalled()
    expect(mockDispatch).toHaveBeenNthCalledWith(1, {
      payload: IdentityCheckMethod.ubble,
      type: 'SET_METHOD',
    })
    expect(navigate).toHaveBeenNthCalledWith(1, 'IdentityCheckStart')
  })
})
