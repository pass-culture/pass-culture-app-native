import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, fireEvent } from 'tests/utils/web'

import { WebShareModal } from '../WebShareModal'

const mockClipboardWriteText = jest.fn()
// @ts-ignore navigator.clipboard doesn't exist in the tests otherwise
navigator.clipboard = { writeText: mockClipboardWriteText }

const mockDismissModal = jest.fn()
const defaultProps = {
  visible: true,
  headerTitle: "Partager l'offre",
  shareContent: { message: 'Voici une super offre\u00a0!', url: 'https://url.com/offer' },
  dismissModal: mockDismissModal,
}

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<WebShareModal/>', () => {
  it('should render correctly when shown', () => {
    const renderWebShareModal = render(<WebShareModal {...defaultProps} />)
    expect(renderWebShareModal).toMatchSnapshot()
  })

  it('should render correctly when hidden', () => {
    const props = { ...defaultProps, visible: false }
    const renderWebShareModal = render(<WebShareModal {...props} />)
    expect(renderWebShareModal).toMatchSnapshot()
  })

  it('should dismiss the modal on cancel button click', () => {
    const { getByText } = render(<WebShareModal {...defaultProps} />)
    fireEvent.click(getByText('Annuler'))
    expect(mockDismissModal).toHaveBeenCalled()
  })
  it('should copy the link on the copy button click', () => {
    const { getByText } = render(<WebShareModal {...defaultProps} />)
    fireEvent.click(getByText('Copier'))
    expect(mockClipboardWriteText).toHaveBeenCalledWith('https://url.com/offer')
  })

  it('should open the email on the email button click', () => {
    const { getByText } = render(<WebShareModal {...defaultProps} />)
    fireEvent.click(getByText('E-mail'))
    expect(openUrl).toHaveBeenCalledWith(
      'mailto:?subject=Voici une super offre\u00a0!&body=https://url.com/offer',
      undefined
    )
  })

  it('should open Facebook when sharing with Facebook', () => {
    const { getByText } = render(<WebShareModal {...defaultProps} />)
    fireEvent.click(getByText('Facebook'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Furl.com%2Foffer&quote=Voici%20une%20super%20offre%20!',
      undefined
    )
  })

  it('should open Twitter when sharing with Twitter', () => {
    const { getByText } = render(<WebShareModal {...defaultProps} />)
    fireEvent.click(getByText('Twitter'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://twitter.com/intent/tweet?text=Voici une super offre\u00a0!&url=https://url.com/offer',
      undefined
    )
  })

  it('should open WhatsApp when sharing with WhatsApp', () => {
    const { getByText } = render(<WebShareModal {...defaultProps} />)
    fireEvent.click(getByText('WhatsApp'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://api.whatsapp.com/send?text=Voici%20une%20super%20offre%20!%0Ahttps%3A%2F%2Furl.com%2Foffer',
      undefined
    )
  })

  it('should open Telegram when sharing with Telegram', () => {
    const { getByText } = render(<WebShareModal {...defaultProps} />)
    fireEvent.click(getByText('Telegram'))
    expect(openUrl).toHaveBeenCalledWith(
      'https://telegram.me/share/msg?url=https://url.com/offer&text=Voici une super offre\u00a0!',
      undefined
    )
  })
})
