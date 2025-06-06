import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { BookingListItem, BookingListItemProp } from 'features/bookings/components/BookingListItem'
import { theme } from 'theme'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { ClockFilled } from 'ui/svg/icons/ClockFilled'
import { Typo, getSpacing } from 'ui/theme'

const meta: Meta<typeof BookingListItem> = {
  title: 'features/booking/BookingListItem',
  component: BookingListItem,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

const Row = styled.View({
  flexDirection: 'row',
  gap: getSpacing(2),
  alignItems: 'center',
})

const StyledTypo = styled(Typo.BodyAccentXs)<{ warning?: boolean }>(({ warning, theme }) => ({
  color: warning ? theme.designSystem.color.text.error : theme.designSystem.color.text.default,
}))

const Label = ({ warning, text }: { warning?: boolean; text: string }) => (
  <Row>
    <ClockFilled
      color={warning ? theme.designSystem.color.text.error : theme.designSystem.color.text.default}
    />
    <StyledTypo warning={warning} numberOfLines={2}>
      {text}
    </StyledTypo>
  </Row>
)

const variantConfig: Variants<typeof BookingListItem> = [
  {
    label: 'BookingListItem display full default',
    props: {
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      title: 'Parasites',
      subtitle: 'Librairie La Brèche',
      display: 'full',
      label: <Label text="À retirer avant le 8 mai 2025" />,
    },
  },
  {
    label: 'BookingListItem display full with warning',
    props: {
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      title: 'Parasites',
      subtitle: 'Librairie La Brèche',
      display: 'full',
      label: <Label text="Avant dernier jour pour retirer" warning />,
    },
  },
  {
    label: 'BookingListItem display punched default',
    props: {
      imageUrl:
        'https://storage.googleapis.com/passculture-metier-prod-production-assets-fine-grained/thumbs/mediations/9MPGW',
      title: 'Parasites',
      subtitle: 'Librairie La Brèche',
      display: 'punched',
      label: <Label text="À retirer avant le 8 mai 2025" />,
    },
  },
]

export const Template: VariantsStory<typeof BookingListItem> = {
  name: 'BookingListItem',
  render: (props: BookingListItemProp) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={BookingListItem}
      defaultProps={{ ...props }}
    />
  ),
  parameters: {
    chromatic: { viewports: [theme.breakpoints.xs, theme.breakpoints.xl] },
  },
}
