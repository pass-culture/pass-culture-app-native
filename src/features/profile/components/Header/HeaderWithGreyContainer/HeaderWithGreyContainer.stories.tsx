import { NavigationContainer } from '@react-navigation/native'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { theme } from 'theme'
import { TypoDS } from 'ui/theme'

import { HeaderWithGreyContainer } from './HeaderWithGreyContainer'

const meta: ComponentMeta<typeof HeaderWithGreyContainer> = {
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

const Template: ComponentStory<typeof HeaderWithGreyContainer> = (props) => (
  <HeaderWithGreyContainer {...props} />
)

export const WithActivationBanner = Template.bind({})
WithActivationBanner.args = {
  showRemoteBanner: true,
  title: 'Jean Dubois',
}

export const WithTitle = Template.bind({})
WithTitle.args = {
  showRemoteBanner: false,
  title: 'Jean Dubois',
}

export const WithStringSubtitle = Template.bind({})
WithStringSubtitle.args = {
  showRemoteBanner: false,
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
}

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

export const WithComponentAsSubtitle = Template.bind({})
WithComponentAsSubtitle.args = {
  showRemoteBanner: false,
  title: 'Jean Dubois',
  subtitle: (
    <Row>
      <TypoDS.Body>Profite de ton crédit jusqu’au&nbsp;</TypoDS.Body>
      <TypoDS.BodyAccent>
        {formatToSlashedFrenchDate('2023-02-16T17:16:04.735235')}
      </TypoDS.BodyAccent>
    </Row>
  ),
}

export const WithInfoBanner = Template.bind({})
WithInfoBanner.args = {
  showRemoteBanner: false,
  title: 'Jean Dubois',
  bannerText: 'Some really important information',
}

export const WithLargeContent = Template.bind({})
WithLargeContent.args = {
  showRemoteBanner: false,
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
  children: (
    <TypoDS.Body>
      Lorem ipsum dolor, sit amet consectetur adipisicing elit. Porro molestiae laudantium
      voluptatibus accusamus aperiam maiores culpa sint repellendus nobis quisquam minus totam esse
      neque eum soluta, illum, labore, distinctio asperiores?
    </TypoDS.Body>
  ),
}

export const WithSmallContent = Template.bind({})
WithSmallContent.args = {
  showRemoteBanner: false,
  title: 'Jean Dubois',
  subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
  children: <TypoDS.Body>Lorem ipsum dolor, sit amet consectetur</TypoDS.Body>,
}
WithSmallContent.parameters = {
  chromatic: {
    viewports: [theme.breakpoints.md, theme.breakpoints.lg, theme.breakpoints.xl],
  },
}
