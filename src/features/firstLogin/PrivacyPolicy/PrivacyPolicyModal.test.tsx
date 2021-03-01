import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import { navigationRef } from 'features/navigation/navigationRef'

import { PrivacyPolicyModal, Props } from './PrivacyPolicyModal'

jest.mock('features/navigation/navigationRef')

const dismissModal = jest.fn()
const visible = true

describe('<PrivacyPolicyModal />', () => {
  beforeEach(jest.clearAllMocks)

  it('should render correctly', () => {
    const renderAPI = renderPrivacyModal({
      dismissModal,
      visible,
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should close when pressing right header icon "✖"', () => {
    const { getByTestId } = renderPrivacyModal({
      dismissModal,
      visible,
    })
    fireEvent.press(getByTestId('rightIconButton'))
    expect(dismissModal).toBeCalledTimes(1)
  })

  it('should close when pressing button with text "Continuer"', () => {
    const { getByText } = renderPrivacyModal({
      dismissModal,
      visible,
    })
    fireEvent.press(getByText('Continuer'))
    expect(dismissModal).toBeCalledTimes(1)
  })
  it('should navigate to ConsentSettings when pressing button with text "Paramètres de confidentialité"', () => {
    const { getByText } = renderPrivacyModal({
      dismissModal,
      visible,
      navigationRef,
    })
    fireEvent.press(getByText('Paramètres de confidentialité'))
    expect(navigationRef?.current?.navigate).toBeCalled()
  })
})

function renderPrivacyModal(props: Props = { dismissModal, visible }) {
  return render(<PrivacyPolicyModal {...props} />)
}
