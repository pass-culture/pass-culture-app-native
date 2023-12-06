import React from 'react'

import * as NavigationHelpers from 'features/navigation/helpers/openUrl'
import { render, fireEvent, checkAccessibilityFor, screen } from 'tests/utils/web'

import { WebShareModal } from './WebShareModalBest'

const mockClipboardWriteText = jest.fn()
// @ts-ignore navigator.clipboard doesn't exist in the tests otherwise
navigator.clipboard = { writeText: mockClipboardWriteText }

const mockDismissModal = jest.fn()
const defaultProps = {
  visible: true,
  headerTitle: 'Partager l’offre',
  shareContent: {
    subject: 'Je t’invite à découvrir une super offre sur le pass Culture\u00a0!',
    body: 'Voici une super offre\u00a0!',
    url: 'https://url.com/offer',
  },
  dismissModal: mockDismissModal,
}

const openUrl = jest.spyOn(NavigationHelpers, 'openUrl')

describe('<WebShareModal/>', () => {
  describe('Accessibility', () => {
    it('should not have basic accessibility issues', async () => {
      const { container } = render(<WebShareModal {...defaultProps} />)

      const results = await checkAccessibilityFor(container)

      expect(results).toHaveNoViolations()
    })
  })

  it('should render correctly when shown', () => {
    const { baseElement } = render(<WebShareModal {...defaultProps} />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should render correctly when hidden', () => {
    const props = { ...defaultProps, visible: false }
    const { baseElement } = render(<WebShareModal {...props} />)

    expect(baseElement).toMatchSnapshot()
  })

  it('should dismiss the modal on cancel button click', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Annuler'))

    expect(mockDismissModal).toHaveBeenCalledTimes(1)
  })

  it('should copy the link on the copy button click', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Copier'))

    expect(mockClipboardWriteText).toHaveBeenCalledWith('https://url.com/offer')
  })

  it('should open the email on the email button click', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('E-mail'))

    expect(openUrl).toHaveBeenCalledWith(
      'mailto:?subject=Je t’invite à découvrir une super offre sur le pass Culture\u00a0!&body=Voici%20une%20super%20offre%C2%A0!%0Ahttps%3A%2F%2Furl.com%2Foffer',
      undefined,
      true
    )
  })

  it('should open Facebook when sharing with Facebook', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Facebook'))

    expect(openUrl).toHaveBeenCalledWith(
      'https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Furl.com%2Foffer&quote=Voici%20une%20super%20offre%C2%A0!',
      undefined,
      true
    )
  })

  it('should open Twitter when sharing with Twitter', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Twitter'))

    expect(openUrl).toHaveBeenCalledWith(
      'https://twitter.com/intent/tweet?text=Voici une super offre\u00a0!&url=https%3A%2F%2Furl.com%2Foffer',
      undefined,
      true
    )
  })

  it('should open WhatsApp when sharing with WhatsApp', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('WhatsApp'))

    expect(openUrl).toHaveBeenCalledWith(
      'https://api.whatsapp.com/send?text=Voici%20une%20super%20offre%C2%A0!%0Ahttps%3A%2F%2Furl.com%2Foffer',
      undefined,
      true
    )
  })

  it('should open Telegram when sharing with Telegram', () => {
    render(<WebShareModal {...defaultProps} />)
    fireEvent.click(screen.getByText('Telegram'))

    expect(openUrl).toHaveBeenCalledWith(
      'https://telegram.me/share/msg?url=https%3A%2F%2Furl.com%2Foffer&text=Voici une super offre\u00a0!',
      undefined,
      true
    )
  })
})
