import React from 'react'

import { PracticalInformation } from 'features/venue/components/PracticalInformation/PracticalInformation'
import { venueDataTest } from 'features/venue/fixtures/venueDataTest'
import * as useFeatureFlagAPI from 'libs/firebase/firestore/featureFlags/useFeatureFlag'
import { reactQueryProviderHOC } from 'tests/reactQueryProviderHOC'
import { render, screen } from 'tests/utils'

jest.spyOn(useFeatureFlagAPI, 'useFeatureFlag').mockReturnValue(false)

describe('PracticalInformation', () => {
  it('should display withdrawal information', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueDataTest} />))

    expect(await screen.findByText('How to withdraw, https://test.com')).toBeOnTheScreen()
  })

  it('should display description information', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueDataTest} />))

    expect(
      await screen.findByText(
        ' https://pass.culture.fr/ lorem ipsum consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, labore nesciunt numquam. Id itaque in sed sapiente blanditiis necessitatibus. consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus, consectetur adipisicing elit. Debitis officiis maiores quia unde, hic quisquam odit ea quo ipsam possimus,'
      )
    ).toBeOnTheScreen()
  })

  it('should display contact block', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueDataTest} />))

    expect(await screen.findByText('contact@venue.com')).toBeOnTheScreen()
  })

  it('should display accessibility block', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueDataTest} />))

    expect(await screen.findAllByTestId('accessibilityBadgeContainer')).not.toHaveLength(0)
  })

  it('should display placeholder when no practical information provided', async () => {
    const venueWithoutPracticalInformation = {
      ...venueDataTest,
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
    render(reactQueryProviderHOC(<PracticalInformation venue={venueWithoutPracticalInformation} />))

    expect(
      screen.getByText('Les infos pratiques ne sont pas encore renseignées pour ce lieu')
    ).toBeOnTheScreen()
  })

  it('should not display withdrawal section when no withdrawal info provided', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation venue={{ ...venueDataTest, withdrawalDetails: undefined }} />
      )
    )

    expect(screen.queryByText('Modalités de retrait')).not.toBeOnTheScreen()
  })

  it('should not display description section when no description provided', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation venue={{ ...venueDataTest, description: undefined }} />
      )
    )

    expect(screen.queryByText('Description')).not.toBeOnTheScreen()
  })

  it('should not display contact section when no contacts provided', async () => {
    render(
      reactQueryProviderHOC(<PracticalInformation venue={{ ...venueDataTest, contact: {} }} />)
    )

    expect(screen.queryByText('Contact')).not.toBeOnTheScreen()
  })

  it('should not display contact section when unused fields are defined but used fields are empty', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation
          venue={{
            ...venueDataTest,
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

  it('should not display accessibility section when no accessibility info provided', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation
          venue={{
            ...venueDataTest,
            externalAccessibilityUrl: undefined,
            externalAccessibilityData: undefined,
            accessibility: {
              audioDisability: null,
              mentalDisability: null,
              motorDisability: null,
              visualDisability: null,
            },
          }}
        />
      )
    )

    expect(screen.queryByText('Accessibilité')).not.toBeOnTheScreen()
  })

  it('should display opening hours section', async () => {
    render(reactQueryProviderHOC(<PracticalInformation venue={venueDataTest} />))

    expect(screen.getByText('Horaires d’ouverture')).toBeOnTheScreen()
  })

  it('should not display opening hours section', async () => {
    render(
      reactQueryProviderHOC(
        <PracticalInformation venue={{ ...venueDataTest, openingHours: undefined }} />
      )
    )

    expect(screen.queryByText('Horaires d’ouverture')).not.toBeOnTheScreen()
  })
})
