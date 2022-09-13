import React from 'react'

import { navigateToHome } from 'features/navigation/helpers'
import { openUrl } from 'features/navigation/helpers/openUrl'
import { shareAppContent } from 'libs/share/shareApp/shareAppContent'
import { ShareAppModal } from 'libs/share/shareApp/ShareAppModal'
import { fireEvent, render } from 'tests/utils/web'

jest.mock('features/navigation/helpers/navigateToHome')
jest.mock('features/navigation/helpers/openUrl')
const mockedOpenUrl = openUrl as jest.MockedFunction<typeof openUrl>

const url = shareAppContent.url || ''
const message = shareAppContent.message

describe('<ShareAppModal />', () => {
  it('should match snapshot', () => {
    const renderAPI = render(<ShareAppModal />)
    expect(renderAPI).toMatchSnapshot()
  })

  it('should open the email on the email button click', () => {
    const { getByLabelText } = render(<ShareAppModal />)
    const emailButton = getByLabelText('Ouvrir le gestionnaire mail')
    fireEvent.click(emailButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `mailto:?subject=${message}&body=${url}`,
      undefined
    )
  })

  it('should open Twitter when sharing with Twitter', () => {
    const { getByText } = render(<ShareAppModal />)
    const twitterButton = getByText('Twitter')
    fireEvent.click(twitterButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://twitter.com/intent/tweet?text=${message}&url=${url}`,
      undefined
    )
  })

  it('should open Telegram when sharing with Telegram', () => {
    const { getByText } = render(<ShareAppModal />)
    const telegramButton = getByText('Telegram')
    fireEvent.click(telegramButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://telegram.me/share/msg?url=${url}&text=${message}`,
      undefined
    )
  })

  it('should open WhatsApp when sharing with WhatsApp', () => {
    const { getByText } = render(<ShareAppModal />)
    const whatsAppButton = getByText('WhatsApp')
    fireEvent.click(whatsAppButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://api.whatsapp.com/send?text=${encodeURIComponent(message + '\n' + url)}`,
      undefined
    )
  })

  it('should open Facebook when sharing with Facebook', () => {
    const { getByText } = render(<ShareAppModal />)
    const facebookButton = getByText('Facebook')
    fireEvent.click(facebookButton)
    expect(mockedOpenUrl).toHaveBeenNthCalledWith(
      1,
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}&quote=${encodeURIComponent(message)}`,
      undefined
    )
  })

  it('should redirect to Home on close', () => {
    const { getByTestId } = render(<ShareAppModal />)
    const closeButton = getByTestId('Fermer la modale')
    fireEvent.click(closeButton)
    expect(navigateToHome).toBeCalled()
  })
})
