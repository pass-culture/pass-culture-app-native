import isEmpty from 'lodash/isEmpty'
import React, { Fragment, FunctionComponent } from 'react'
import { FlatList, ListRenderItemInfo } from 'react-native'
import styled from 'styled-components/native'

import { VenueResponse } from 'api/gen'
import { ContactBlock } from 'features/venue/components/ContactBlockNew/ContactBlockNew'
import { AccessibilityBlock } from 'ui/components/accessibility/AccessibilityBlock'
import { Separator } from 'ui/components/Separator'
import { Spacer, Typo } from 'ui/theme'

type Props = { venue: VenueResponse }
type Section = { title: string; body: JSX.Element; isDisplayed: boolean }

export const PracticalInformation: FunctionComponent<Props> = ({ venue }) => {
  const sections: Section[] = [
    {
      title: 'Modalités de retrait',
      body: <Typo.Body>{venue.withdrawalDetails}</Typo.Body>,
      isDisplayed: !!venue.withdrawalDetails,
    },
    {
      title: 'Description',
      body: <Typo.Body>{venue.description}</Typo.Body>,
      isDisplayed: !!venue.description,
    },
    {
      title: 'Contact',
      body: <ContactBlock venue={venue} />,
      isDisplayed: !!venue.contact && !isEmpty(venue.contact),
    },
    {
      title: 'Accessibilité',
      body: <AccessibilityBlock {...venue.accessibility} />,
      isDisplayed: !!venue.accessibility && !isEmpty(venue.accessibility),
    },
  ]
  const sectionsToDisplay = sections.filter((section) => section.isDisplayed)

  return (
    <Container>
      <Spacer.Column numberOfSpaces={2} />
      <FlatList
        scrollEnabled={false}
        data={sectionsToDisplay}
        renderItem={renderItem}
        ItemSeparatorComponent={Separator.Horizontal}
      />
      <Spacer.Column numberOfSpaces={2} />
    </Container>
  )
}

const renderItem = ({ item: section }: ListRenderItemInfo<Section>) => (
  <Section title={section.title}>{section.body}</Section>
)

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
