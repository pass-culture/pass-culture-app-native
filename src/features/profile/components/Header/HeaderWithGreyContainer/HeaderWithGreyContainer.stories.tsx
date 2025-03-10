import { NavigationContainer } from '@react-navigation/native'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { theme } from 'theme'
import { Typo } from 'ui/theme'

import { HeaderWithGreyContainer } from './HeaderWithGreyContainer'

const meta: Meta<typeof HeaderWithGreyContainer> = {
  title: 'features/Profile/HeaderWithGreyContainer',
  component: HeaderWithGreyContainer,
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
}
export default meta

type Story = StoryObj<typeof HeaderWithGreyContainer>

export const WithActivationBanner: Story = {
  args: {
    title: 'Jean Dubois',
  },
}

export const WithTitle: Story = {
  args: {
    title: 'Jean Dubois',
  },
}

export const WithStringSubtitle: Story = {
  args: {
    title: 'Jean Dubois',
    subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
  },
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

export const WithComponentAsSubtitle: Story = {
  args: {
    title: 'Jean Dubois',
    subtitle: (
      <Row>
        <Typo.Body>Profite de ton crédit jusqu’au&nbsp;</Typo.Body>
        <Typo.BodyAccent>{formatToSlashedFrenchDate('2023-02-16T17:16:04.735235')}</Typo.BodyAccent>
      </Row>
    ),
  },
}

export const WithInfoBanner: Story = {
  args: {
    title: 'Jean Dubois',
    bannerText: 'Some really important information',
  },
}

export const WithLargeContent: Story = {
  args: {
    title: 'Jean Dubois',
    subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
    children: (
      <Typo.Body>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro molestiae laudantium
        voluptatibus accusamus aperiam maiores culpa sint repellendus nobis quisquam minus totam
        esse neque eum soluta, illum, labore, distinctio asperiores?
      </Typo.Body>
    ),
  },
}

export const WithSmallContent: Story = {
  args: {
    title: 'Jean Dubois',
    subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
    children: <Typo.Body>Lorem ipsum dolor, sit amet consectetur</Typo.Body>,
  },
  parameters: {
    chromatic: {
      viewports: [theme.breakpoints.md, theme.breakpoints.lg, theme.breakpoints.xl],
    },
  },
}
