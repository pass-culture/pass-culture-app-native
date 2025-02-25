import React, { FunctionComponent } from 'react'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ContactBlock } from 'features/venue/components/ContactBlock/ContactBlock'
import { NoInformationPlaceholder } from 'features/venue/components/Placeholders/NoInformationPlaceholder'
import { AccessibilityBlock } from 'shared/accessibility/AccessibilityBlock'
import { Separator } from 'ui/components/Separator'
import { TypoDS, getSpacing } from 'ui/theme'

import { OpeningHours } from '../OpeningHours/OpeningHours'

type Props = { venue: VenueResponse }
type Section = { title: string; body: React.JSX.Element; isDisplayed: boolean }

export const PracticalInformation: FunctionComponent<Props> = ({ venue }) => {
  const sections: Section[] = [
    {
      title: 'Modalités de retrait',
      body: <TypoDS.Body>{venue.withdrawalDetails}</TypoDS.Body>,
      isDisplayed: !!venue.withdrawalDetails,
    },
    {
      title: 'Description',
      body: <TypoDS.Body>{venue.description}</TypoDS.Body>,
      isDisplayed: !!venue.description,
    },
    {
      title: 'Contact',
      body: <ContactBlock venue={venue} />,
      isDisplayed:
        !!venue.contact &&
        !!(venue.contact.phoneNumber || venue.contact.email || venue.contact.website),
    },
    {
      title: 'Accessibilité',
      body: (
        <AccessibilityBlock
          basicAccessibility={venue.accessibility}
          detailedAccessibilityUrl={venue.externalAccessibilityUrl}
          detailedAccessibilityData={venue.externalAccessibilityData}
          detailedAccessibilityId={venue.externalAccessibilityId}
        />
      ),
      isDisplayed:
        !!venue.isOpenToPublic &&
        !!venue.accessibility &&
        Object.values(venue.accessibility).some((value) => value !== null && value !== undefined),
    },
    {
      title: 'Horaires d’ouverture',
      body: <OpeningHours openingHours={venue.openingHours} />,
      isDisplayed: !!venue.isOpenToPublic && !!venue.openingHours,
    },
  ]
  const sectionsToDisplay = sections.filter((section) => section.isDisplayed)

  if (sectionsToDisplay.length === 0) {
    return <NoInformationPlaceholder />
  }

  return (
    <Container>
      {sectionsToDisplay.map((section, index) => (
        <React.Fragment key={`${section.title}-${index}`}>
          <Section title={section.title}>{section.body}</Section>
          <Separator.Horizontal />
        </React.Fragment>
      ))}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginVertical: getSpacing(2),
}))

const Section: FunctionComponent<{ title: string; children?: React.JSX.Element }> = ({
  title,
  children,
}) => (
  <StyledViewGap>
    <TypoDS.BodyAccentXs>{title}</TypoDS.BodyAccentXs>
    {children}
  </StyledViewGap>
)

const StyledViewGap = styled.View({
  marginVertical: getSpacing(4),
  gap: getSpacing(4),
})
