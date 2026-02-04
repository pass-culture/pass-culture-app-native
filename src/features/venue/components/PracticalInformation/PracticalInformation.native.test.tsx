import React from 'react'

import { PracticalInformation } from 'features/venue/components/PracticalInformation/PracticalInformation'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import { setFeatureFlags } from 'libs/firebase/firestore/featureFlags/tests/setFeatureFlags'
import { RemoteStoreFeatureFlags } from 'libs/firebase/firestore/types'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.mock('libs/firebase/analytics/analytics')

const venueOpenToPublic = { ...venueDataTest, isOpenToPublic: true }

describe('PracticalInformation', () => {
  it('should display withdrawal information', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueOpenToPublic} />))

    expect(await screen.findByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should display description information', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueOpenToPublic} />))

    expect(
      await screen.findByText(
        ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus. consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus,'
      )
    ).toBeOnTheScreen()
  })

  it('should display contact block', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueOpenToPublic} />))

    expect(await screen.findByText('contact@venue.com')).toBeOnTheScreen()
  })

  it('should display specific wording placeholder when no practical information provided and venue is open to public', async () => {
    const venueWithoutPracticalInformation = {
      ...venueOpenToPublic,
      withdrawalDetails: undefined,
      description: undefined,
      contact: undefined,
      externalAccessibilityUrl: undefined,
      externalAccessibilityData: undefined,
      openingHours: undefined,
      accessibilityData: {
        audioDisability: null,
        mentalDisability: null,
        motorDisability: null,
        visualDisability: null,
      },
    }
    render(reactQueryProviderHOC(<PracticalInformation venue={venueWithoutPracticalInformation} />))

    expect(
      screen.getByText('Les infos pratiques ne sont pas encore renseignées pour ce lieu')
    ).toBeOnTheScreen()
  })

  it('should display specific wording placeholder when no practical information provided and venue is not open to public', async () => {
    const venueWithoutPracticalInformationNotOpenToPublic = {
      ...venueOpenToPublic,
      isOpenToPublic: false,
      withdrawalDetails: undefined,
      description: undefined,
      contact: undefined,
      externalAccessibilityUrl: undefined,
      externalAccessibilityData: undefined,
      openingHours: undefined,
      accessibility: {
        audioDisability: null,
        mentalDisability: null,
        motorDisability: null,
        visualDisability: null,
      },
    }
    render(
      reactQueryProviderHOC(
        <PracticalInformation venue={venueWithoutPracticalInformationNotOpenToPublic} />
      )
    )

    expect(
      screen.getByText('Les infos pratiques ne sont pas encore renseignées pour cette structure')
    ).toBeOnTheScreen()
  })

  it('should not display withdrawal section when no withdrawal info provided', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation venue={{ ...venueOpenToPublic, withdrawalDetails: undefined }} />
      )
    )

    expect(screen.queryByText('Modalités de retrait')).not.toBeOnTheScreen()
  })

  it('should not display description section when no description provided', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation venue={{ ...venueOpenToPublic, description: undefined }} />
      )
    )

    expect(screen.queryByText('Description')).not.toBeOnTheScreen()
  })

  it('should not display contact section when no contacts provided', async () => {
    render(
      reactQueryProviderHOC(<PracticalInformation venue={{ ...venueOpenToPublic, contact: {} }} />)
    )

    expect(screen.queryByText('Contact')).not.toBeOnTheScreen()
  })

  it('should not display contact section when unused fields are defined but used fields are empty', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation
          venue={{
            ...venueOpenToPublic,
            contact: {
              email: '',
              phoneNumber: '',
              website: '',
              socialMedias: { facebook: 'https://example.com' },
            },
          }}
        />
      )
    )

    expect(screen.queryByText('Contact')).not.toBeOnTheScreen()
  })

  describe('Without AccesLibre use', () => {
    it('should display basic accessibility block', async () => {
      render(reactQueryProviderHOC(<PracticalInformation venue={venueOpenToPublic} />))

      expect(await screen.findByTestId('BasicAccessibilityInfo')).toBeOnTheScreen()
    })

    it('should not display basic accessibility section when no accessibility info provided', async () => {
      render(
        reactQueryProviderHOC(
          <PracticalInformation
            venue={{
              ...venueOpenToPublic,
              externalAccessibilityUrl: undefined,
              externalAccessibilityData: undefined,
              accessibilityData: {
                audioDisability: null,
                mentalDisability: null,
                motorDisability: null,
                visualDisability: null,
              },
            }}
          />
        )
      )

      expect(screen.queryByTestId('BasicAccessibilityInfo')).not.toBeOnTheScreen()
      expect(screen.queryByText('Accessibilité')).not.toBeOnTheScreen()
    })

    it('should not display AccesLibre banner when url is provided', () => {
      render(reactQueryProviderHOC(<PracticalInformation venue={venueOpenToPublic} />))

      expect(
        screen.queryByText(
          'Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.'
        )
      ).not.toBeOnTheScreen()
    })
  })

  it('should display AccesLibre banner when url is provided and AccesLibre used', () => {
    setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_ACCES_LIBRE])
    render(
      reactQueryProviderHOC(<PracticalInformation venue={venueOpenToPublic} enableAccesLibre />)
    )

    expect(
      screen.getByText(
        'Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.'
      )
    ).toBeOnTheScreen()
  })

  it('should display opening hours section', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueOpenToPublic} />))

    expect(screen.getByText('Horaires d’ouverture')).toBeOnTheScreen()
  })

  it('should not display opening hours section', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation venue={{ ...venueOpenToPublic, openingHours: undefined }} />
      )
    )

    expect(screen.queryByText('Horaires d’ouverture')).not.toBeOnTheScreen()
  })

  it('should not display opening hours section when hours not provided', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation
          venue={{
            ...venueOpenToPublic,
            openingHours: {
              SUNDAY: null,
              MONDAY: null,
              TUESDAY: null,
              WEDNESDAY: null,
              THURSDAY: null,
              FRIDAY: null,
              SATURDAY: null,
            },
          }}
        />
      )
    )

    expect(screen.queryByText('Horaires d’ouverture')).not.toBeOnTheScreen()
  })

  describe('venue is not open to public', () => {
    it('should not display opening hours section', async () => {
      render(
        reactQueryProviderHOC(
          <PracticalInformation venue={{ ...venueDataTest, isOpenToPublic: false }} />
        )
      )

      expect(screen.queryByText('Horaires d’ouverture')).not.toBeOnTheScreen()
    })

    it('should not display accessibility section when no accessibility info provided', async () => {
      render(
        reactQueryProviderHOC(
          <PracticalInformation venue={{ ...venueDataTest, isOpenToPublic: false }} />
        )
      )

      expect(screen.queryByText('Accessibilité')).not.toBeOnTheScreen()
    })

    it('should not display accessibility section when AccesLibre used', () => {
      setFeatureFlags([RemoteStoreFeatureFlags.WIP_ENABLE_ACCES_LIBRE])
      render(
        reactQueryProviderHOC(
          <PracticalInformation
            venue={{ ...venueOpenToPublic, isOpenToPublic: false }}
            enableAccesLibre
          />
        )
      )

      expect(
        screen.queryByText(
          'Tu peux retrouver des informations supplémentaires sur l’accessibilité de ce lieu sur le site d’acceslibre.'
        )
      ).not.toBeOnTheScreen()
    })
  })
})
