import userEvent from '@testing-library/user-event'
import React from 'react'
import { Button } from 'react-native'

import { OfferResponse } from 'api/gen'
import { mockOffer } from 'features/bookOffer/fixtures/offer'
import { act, render } from 'tests/utils/web'

import { useShareOffer } from './useShareOffer'

const Toto = ({ offer }: { offer?: OfferResponse }) => {
  const { share, WebShareModal } = useShareOffer({ offer })

  return (
    <React.Fragment>
      <Button onPress={share} title="Partager" />
      <WebShareModal />
    </React.Fragment>
  )
}

describe('useShareOffer', () => {
  it('should not display web share modal when did not open it', async () => {
    const { queryByText } = render(<Toto offer={mockOffer} />)

    expect(queryByText('Partager l’offre')).toBeFalsy()
  })

  it('should not display web share modal when there is no offer', async () => {
    const { queryByText, getByText } = render(<Toto offer={undefined} />)

    await act(async () => {
      await userEvent.click(getByText('Partager'))
    })

    expect(queryByText('Partager l’offre')).toBeFalsy()
  })

  it('should display web share modal when there is offer', async () => {
    const { queryByText, getByText } = render(<Toto offer={mockOffer} />)

    await act(async () => {
      await userEvent.click(getByText('Partager'))
    })

    expect(queryByText('Partager l’offre')).toBeTruthy()
  })

  it('should hide web share modal when clicking on close button with label "Fermer la modale', async () => {
    const { getByText, queryByText, getByLabelText } = render(<Toto offer={mockOffer} />)

    await act(async () => {
      await userEvent.click(getByText('Partager'))
    })

    await act(async () => {
      await userEvent.click(getByLabelText('Fermer la modale'))
    })

    expect(queryByText('Partager l’offre')).toBeFalsy()
  })
})
