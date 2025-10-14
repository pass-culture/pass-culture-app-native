import React, { FunctionComponent, ReactNode, useMemo } from 'react'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ContactBlock } from 'features/venue/components/ContactBlock/ContactBlock'
import { NoInformationPlaceholder } from 'features/venue/components/Placeholders/NoInformationPlaceholder'
import { isSectionWithBody } from 'features/venue/helpers/isSectionWithBody/isSectionWithBody'
import { BasicAccessibilityInfo } from 'ui/components/accessibility/BasicAccessibilityInfo'
import { DetailedAccessibilityInfo } from 'ui/components/accessibility/DetailedAccessibilityInfo'
import { Separator } from 'ui/components/Separator'
import { Typo } from 'ui/theme'
import { getHeadingAttrs } from 'ui/theme/typographyAttrs/getHeadingAttrs'

import { OpeningHours } from '../OpeningHours/OpeningHours'

type Props = {
  venue: VenueResponse
  enableAccesLibre?: boolean
}

export const PracticalInformation: FunctionComponent<Props> = ({ venue, enableAccesLibre }) => {
  const {
    withdrawalDetails,
    description,
    contact,
    isOpenToPublic,
    accessibility,
    openingHours,
    externalAccessibilityData,
    externalAccessibilityId,
    externalAccessibilityUrl,
  } = venue

  const shouldDisplayDetailedAccessibility =
    !!isOpenToPublic &&
    enableAccesLibre &&
    !!externalAccessibilityUrl &&
    !!externalAccessibilityData &&
    !!externalAccessibilityId

  const shouldDisplayBasicAccessibility =
    !!isOpenToPublic &&
    !!accessibility &&
    Object.values(accessibility).some((value) => value != null)

  const accessibilitySection = useMemo(() => {
    if (shouldDisplayDetailedAccessibility) {
      return (
        <DetailedAccessibilityInfo
          url={externalAccessibilityUrl}
          accessibilities={externalAccessibilityData}
          acceslibreId={externalAccessibilityId}
        />
      )
    }
    if (shouldDisplayBasicAccessibility) {
      return <BasicAccessibilityInfo accessibility={accessibility} />
    }
    return null
  }, [
    shouldDisplayDetailedAccessibility,
    shouldDisplayBasicAccessibility,
    externalAccessibilityUrl,
    externalAccessibilityData,
    externalAccessibilityId,
    accessibility,
  ])

  const shouldDisplayOpeningHours =
    !!isOpenToPublic &&
    !!openingHours &&
    Object.values(openingHours).some((value) => value !== null)

  const sections = [
    {
      title: 'Modalités de retrait',
      body: <Typo.Body>{withdrawalDetails}</Typo.Body>,
      shouldBeDisplayed: !!withdrawalDetails,
    },
    {
      title: 'Description',
      body: <Typo.Body>{description}</Typo.Body>,
      shouldBeDisplayed: !!description,
    },
    {
      title: 'Contact',
      body: <ContactBlock venue={venue} />,
      shouldBeDisplayed: !!contact && !!(contact.phoneNumber || contact.email || contact.website),
    },
    {
      title: 'Accessibilité',
      body: accessibilitySection,
      shouldBeDisplayed: !!accessibilitySection,
    },
    {
      title: 'Horaires d’ouverture',
      body: <OpeningHours openingHours={openingHours} title="Horaires d’ouverture" />,
      shouldBeDisplayed: shouldDisplayOpeningHours,
    },
  ].filter(isSectionWithBody)

  if (sections.length === 0) {
    return <NoInformationPlaceholder />
  }

  return (
    <Container>
      {sections.map((section, index) => (
        <React.Fragment key={`${section.title}-${index}`}>
          <SectionComponent title={section.title}>{section.body}</SectionComponent>
          {index < sections.length - 1 ? <Separator.Horizontal /> : null}
        </React.Fragment>
      ))}
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
  marginVertical: theme.designSystem.size.spacing.s,
}))

const SectionComponent: FunctionComponent<{ title: string; children?: ReactNode }> = ({
  title,
  children,
}) => (
  <StyledViewGap>
    <Typo.BodyAccentXs {...getHeadingAttrs(2)}>{title}</Typo.BodyAccentXs>
    {children}
  </StyledViewGap>
)

const StyledViewGap = styled.View(({ theme }) => ({
  marginVertical: theme.designSystem.size.spacing.l,
  gap: theme.designSystem.size.spacing.l,
}))
