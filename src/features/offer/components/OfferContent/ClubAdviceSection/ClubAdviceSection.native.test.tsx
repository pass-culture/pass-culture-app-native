import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { advicesFixture } from 'features/advices/fixtures/advices.fixture'
import { adviceVariantInfoFixture } from 'features/advices/fixtures/adviceVariantInfo.fixture'
import { ClubAdviceSection } from 'features/offer/components/OfferContent/ClubAdviceSection/ClubAdviceSection'
import { render, screen, userEvent } from 'tests/utils'

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: jest.fn(),
})

jest.mock('queries/subcategories/useSubcategoriesQuery')

describe('ChroniclesSection', () => {
  const user = userEvent.setup()

  it('should render correctly', () => {
    render(
      <ClubAdviceSection
        variantInfo={adviceVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={advicesFixture}
        navigateTo={{ screen: 'Offer' }}
        onShowClubAdviceWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText(adviceVariantInfoFixture.titleSection)).toBeOnTheScreen()
    expect(screen.getByText(adviceVariantInfoFixture.subtitleSection)).toBeOnTheScreen()
    expect(screen.getByText('Voir tous les avis')).toBeOnTheScreen()
    expect(screen.getAllByTestId(/advice-card-*/).length).toBeGreaterThan(0)
  })

  it('should navigate', async () => {
    jest.useFakeTimers()
    render(
      <ClubAdviceSection
        variantInfo={adviceVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={advicesFixture}
        navigateTo={{ screen: 'Offer' }}
        onShowClubAdviceWritersModal={jest.fn()}
      />
    )

    await user.press(screen.getByText('Voir tous les avis'))

    expect(mockNavigate.mock.calls[0][0]).toBe('Offer')

    jest.useRealTimers()
  })

  it('should not display all reviews button when there is only one review', () => {
    render(
      <ClubAdviceSection
        variantInfo={adviceVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={[advicesFixture[0]]}
        navigateTo={{ screen: 'Offer' }}
        onShowClubAdviceWritersModal={jest.fn()}
      />
    )

    expect(screen.queryByText('Voir tous les avis')).not.toBeOnTheScreen()
  })
})
