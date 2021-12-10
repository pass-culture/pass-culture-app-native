import React from 'react'

import { openUrl } from 'features/navigation/helpers/openUrl'
import { env } from 'libs/environment'
import { superFlushWithAct, fireEvent, render, cleanup } from 'tests/utils'

import { PrivacyPolicyModal, Props as Options } from './PrivacyPolicyModal'

jest.mock('features/navigation/navigationRef')

const onApproval = jest.fn()
const onRefusal = jest.fn()
const visible = true

jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

describe('<PrivacyPolicyModal />', () => {
  afterEach(cleanup)

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

    fireEvent.press(getByTestId('Fermer la modale et refuser la collecte des données'))
    expect(onRefusal).toBeCalledTimes(1)
    expect(onApproval).not.toBeCalled()
  })

  it('should close and approve when pressing button with text "Autoriser"', () => {
    const { getByText } = renderPrivacyModal({
      onRefusal,
      onApproval,
      visible,
    })
    fireEvent.press(getByText('Autoriser'))
    expect(onApproval).toBeCalledTimes(1)
    expect(onRefusal).not.toBeCalled()
  })

  it('should open cookies policies on click on "Politique des cookies"', async () => {
    const { getByText } = renderPrivacyModal({ onRefusal, onApproval, visible })
    fireEvent.press(getByText('Politique des cookies'))
    expect(mockedOpenUrl).toBeCalledWith(env.COOKIES_POLICY_LINK)
    await superFlushWithAct(1)
  })

  it('should not close modal on backdrop tap', () => {
    const { getByTestId } = renderPrivacyModal({ onRefusal, onApproval, visible })
    const modal = getByTestId('modal')
    modal.props.onBackdropPress()
    expect(onApproval).not.toBeCalled()
    expect(onRefusal).not.toBeCalled()
  })
})

const defaultOptions = {
  onRefusal,
  onApproval,
  visible,
  disableBackdropTap: true,
}

function renderPrivacyModal(options: Options = defaultOptions) {
  const props = { ...defaultOptions, ...options }
  return render(<PrivacyPolicyModal {...props} />)
}
