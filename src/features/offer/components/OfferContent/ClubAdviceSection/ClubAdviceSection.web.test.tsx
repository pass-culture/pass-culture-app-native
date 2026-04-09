import * as reactNavigationNative from '@react-navigation/native'
import React from 'react'

import { advicesFixture } from 'features/advices/fixtures/advices.fixture'
import { adviceVariantInfoFixture } from 'features/advices/fixtures/adviceVariantInfo.fixture'
import { ClubAdviceSection } from 'features/offer/components/OfferContent/ClubAdviceSection/ClubAdviceSection'
import { fireEvent, render, screen } from 'tests/utils/web'

const mockNavigate = jest.fn()
jest.spyOn(reactNavigationNative, 'useNavigation').mockReturnValue({
  navigate: mockNavigate,
  push: jest.fn(),
})

describe('ClubAdviceSection', () => {
  it('should render correctly in mobile', () => {
    render(
      <ClubAdviceSection
        variantInfo={adviceVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={advicesFixture}
        navigateTo={{ screen: 'Offer' }}
        onShowClubAdviceWritersModal={jest.fn()}
      />
    )

    expect(screen.getByText(adviceVariantInfoFixture.titleSection)).toBeInTheDocument()
    expect(
      screen.getByText('Notre communauté de lecteurs te partage leur avis sur ce livre !')
    ).toBeInTheDocument()
    expect(screen.getByText('Voir tous les avis')).toBeInTheDocument()
    expect(screen.getAllByTestId(/advice-card-*/).length).toBeGreaterThan(0)
  })

  it('should render correctly in desktop', () => {
    render(
      <ClubAdviceSection
        variantInfo={adviceVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={advicesFixture}
        navigateTo={{ screen: 'Offer' }}
        onShowClubAdviceWritersModal={jest.fn()}
      />,
      { theme: { isDesktopViewport: true } }
    )

    expect(screen.getByText(adviceVariantInfoFixture.titleSection)).toBeInTheDocument()
    expect(
      screen.getByText('Notre communauté de lecteurs te partage leur avis sur ce livre !')
    ).toBeInTheDocument()
    expect(screen.getByText('Voir tous les avis')).toBeInTheDocument()
    expect(screen.getAllByTestId(/advice-card-*/).length).toBeGreaterThan(0)
  })

  it('should navigate', async () => {
    render(
      <ClubAdviceSection
        variantInfo={adviceVariantInfoFixture}
        ctaLabel="Voir tous les avis"
        data={advicesFixture}
        navigateTo={{ screen: 'Offer' }}
        onShowClubAdviceWritersModal={jest.fn()}
      />
    )

    // Have to use fireEvent here, otherwise test is flaky :/
    await fireEvent.click(screen.getByText('Voir tous les avis'))

    expect(mockNavigate).toHaveBeenCalledTimes(1)
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

    expect(screen.queryByText('Voir tous les avis')).not.toBeInTheDocument()
  })
})
