import React from 'react'

import { OfferAdvicesCounter } from 'features/offer/components/OfferAdvicesCounter/OfferAdvicesCounter'
import { render, screen } from 'tests/utils'
import { BookClubCertification } from 'ui/svg/BookClubCertification'

describe('<OfferReactionSection />', () => {
  it('should return null where there are not advices', () => {
    render(
      <OfferAdvicesCounter
        advicesStatus={{ total: 0, hasPublished: false, hasUnpublished: false }}
        publishedText="0 avis du book club"
        unpublishedText="Recommandé par le book club"
        icon={<BookClubCertification />}
        testID="advices-counter"
        onPress={jest.fn()}
      />
    )

    expect(screen.queryByText('0 avis du book club')).not.toBeOnTheScreen()
    expect(screen.queryByText('Recommandé par le book club')).not.toBeOnTheScreen()
  })

  it('should display unpublished info when there are only unpublished advices', () => {
    render(
      <OfferAdvicesCounter
        advicesStatus={{ total: 2, hasPublished: false, hasUnpublished: true }}
        publishedText="2 avis du book club"
        unpublishedText="Recommandé par le book club"
        icon={<BookClubCertification />}
        testID="advices-counter"
        onPress={jest.fn()}
      />
    )

    expect(screen.getByText('Recommandé par le book club')).toBeOnTheScreen()
  })

  it('should display the number of published advices when there is at least one published offer', () => {
    render(
      <OfferAdvicesCounter
        advicesStatus={{ total: 2, hasPublished: true, hasUnpublished: true }}
        publishedText="2 avis du book club"
        unpublishedText="Recommandé par le book club"
        icon={<BookClubCertification />}
        testID="advices-counter"
        onPress={jest.fn()}
      />
    )

    expect(screen.getByText('2 avis du book club')).toBeOnTheScreen()
  })
})
