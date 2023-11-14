import React, { Fragment, FunctionComponent } from 'react'
import { FlatList } from 'react-native'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ContactBlock } from 'features/venue/components/ContactBlockNew/ContactBlockNew'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'

type Props = { venue: VenueResponse }
type Section = { title: string; body: JSX.Element | null }
type SectionToDisplay = { title: string; body: JSX.Element }

export const PracticalInformation: FunctionComponent<Props> = ({ venue }) => {
  const sections: Section[] = [
    {
      title: 'Modalités de retrait',
      body: venue.withdrawalDetails ? <Typo.Body>{venue.withdrawalDetails}</Typo.Body> : null,
    },
    {
      title: 'Description',
      body: venue.description ? <Typo.Body>{venue.description}</Typo.Body> : null,
    },
    {
      title: 'Contact',
      body: <ContactBlock venue={venue} />,
    },
    {
      title: 'Accessibilité',
      body: <AccessibilityBlock {...venue.accessibility} />,
    },
  ]
  const sectionsToDisplay = sections.filter(
    (section): section is SectionToDisplay => section.body !== null
  )

  return (
    <Container>
      <Spacer.Column numberOfSpaces={2} />
      <FlatList
        data={sectionsToDisplay}
        renderItem={({ item: section }) => <Section title={section.title}>{section.body}</Section>}
        ItemSeparatorComponent={Separator.Horizontal}
      />
      <Spacer.Column numberOfSpaces={2} />
    </Container>
  )
}

const Container = styled.View(({ theme }) => ({
  marginHorizontal: theme.contentPage.marginHorizontal,
}))

const Section: FunctionComponent<{ title: string; children?: JSX.Element }> = ({
  title,
  children,
}) => (
  <Fragment>
    <Spacer.Column numberOfSpaces={4} />
    <Typo.Caption>{title}</Typo.Caption>
    <Spacer.Column numberOfSpaces={4} />
    {children}
    <Spacer.Column numberOfSpaces={4} />
  </Fragment>
)
