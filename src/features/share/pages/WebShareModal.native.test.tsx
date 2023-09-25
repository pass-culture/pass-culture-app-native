import React from 'react'

import { render } from 'tests/utils'

import { WebShareModal } from './WebShareModal'

const defaultProps = {
  visible: true,
  headerTitle: 'Partager l’offre',
  shareContent: {
    message: 'Voici une super offre !',
    messageWithoutLink: 'Message',
    url: 'https://url.com/offer',
  },
  dismissModal: jest.fn(),
}

describe('<WebShareModal />', () => {
  it('should not render in native', () => {
    const renderAPI = render(<WebShareModal {...defaultProps} />)
    expect(renderAPI.toJSON()).not.toBeOnTheScreen()
  })
})
