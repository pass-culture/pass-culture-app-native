import { fireEvent, render } from '@testing-library/react-native'
import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers'
import { navigationRef } from 'features/navigation/navigationRef'
import { env } from 'libs/environment'
import { superFlushWithAct } from 'tests/utils'

import { PrivacyPolicyModal, Props } from './PrivacyPolicyModal'

jest.mock('features/navigation/navigationRef')

const onApproval = jest.fn()
const onRefusal = jest.fn()
const visible = true

describe('<PrivacyPolicyModal />', () => {
  beforeEach(jest.clearAllMocks)

  it('should render correctly', () => {
    const renderAPI = renderPrivacyModal({
      onRefusal,
      onApproval,
      visible,
    })
    expect(renderAPI).toMatchSnapshot()
  })

  it('should close and refuse when pressing right header icon "✖"', () => {
    const { getByTestId } = renderPrivacyModal({
      onRefusal,
      onApproval,
      visible,
    })
    fireEvent.press(getByTestId('rightIconButton'))
    expect(onRefusal).toBeCalledTimes(1)
    expect(onApproval).not.toBeCalled()
  })

  it('should close and approve when pressing button with text "Continuer"', () => {
    const { getByText } = renderPrivacyModal({
      onRefusal,
      onApproval,
      visible,
    })
    fireEvent.press(getByText('Continuer'))
    expect(onApproval).toBeCalledTimes(1)
    expect(onRefusal).not.toBeCalled()
  })

  it('should navigate to ConsentSettings when pressing button with text "Paramètres de confidentialité"', () => {
    const { getByText } = renderPrivacyModal({
      onRefusal,
      onApproval,
      visible,
      navigationRef,
    })
    fireEvent.press(getByText('Paramètres de confidentialité'))
    expect(navigationRef?.current?.navigate).toBeCalled()
  })

  it('should open cookies policies on click on "Politique des cookies"', async () => {
    const openExternalUrl = jest.spyOn(NavigationHelpers, 'openExternalUrl')
    const { getByText } = renderPrivacyModal({
      onRefusal,
      onApproval,
      visible,
      navigationRef,
    })
    fireEvent.press(getByText('Politique des cookies'))
    expect(openExternalUrl).toBeCalledWith(env.COOKIES_POLICY_LINK)
    await superFlushWithAct(1)
  })
})

function renderPrivacyModal(props: Props = { onRefusal, onApproval, visible }) {
  return render(<PrivacyPolicyModal {...props} />)
}
