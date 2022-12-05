import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { All } from 'ui/svg/icons/bicolor/All'
import { Spacer, Typo } from 'ui/theme'

import { AgeButton } from './AgeButton'

const BicolorAll = styled(All).attrs(({ theme }) => ({
  color: theme.colors.primary,
  color2: theme.colors.secondary,
  size: theme.icons.sizes.small,
}))``

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

export default {
  title: 'features/onboarding/AgeButton',
  component: AgeButton,
  argTypes: {
    icon: selectArgTypeFromObject({
      BicolorAll,
      NoIcon: undefined,
    }),
  },
  decorators: [
    (Story) => (
      <NavigationContainer>
        <Story />
      </NavigationContainer>
    ),
  ],
} as ComponentMeta<typeof AgeButton>

const Template: ComponentStory<typeof AgeButton> = (props) => <AgeButton {...props} />

const TextExample = ({ withSubtitle = false }) => (
  <React.Fragment>
    <StyledBody>
      j’ai <Typo.ButtonTextSecondary>17 ans</Typo.ButtonTextSecondary>
    </StyledBody>
    {!!withSubtitle && (
      <React.Fragment>
        <Spacer.Column numberOfSpaces={1} />
        <Typo.CaptionNeutralInfo numberOfLines={2}>
          j’ai moins de 15 ans ou plus de 18 ans
        </Typo.CaptionNeutralInfo>
      </React.Fragment>
    )}
  </React.Fragment>
)

// TODO(PC-17931): Fix this story
const WithIcon = Template.bind({})
WithIcon.args = {
  children: TextExample({}),
  icon: BicolorAll,
  navigateTo: { screen: 'AgeSelection' },
}

// TODO(PC-17931): Fix this story
const WithoutIcon = Template.bind({})
WithoutIcon.args = {
  children: TextExample({}),
  icon: undefined,
  navigateTo: { screen: 'AgeSelection' },
}

// TODO(PC-17931): Fix this story
const WithSubtitle = Template.bind({})
WithSubtitle.args = {
  children: TextExample({ withSubtitle: true }),
  icon: BicolorAll,
  navigateTo: { screen: 'AgeSelection' },
}

// TODO(PC-17931): Fix this story
const Dense = Template.bind({})
Dense.args = {
  children: TextExample({}),
  icon: BicolorAll,
  dense: true,
  navigateTo: { screen: 'AgeSelection' },
}

// TODO(PC-17931): Fix this story
const DenseWithSubtitle = Template.bind({})
DenseWithSubtitle.args = {
  children: TextExample({ withSubtitle: true }),
  icon: BicolorAll,
  dense: true,
  navigateTo: { screen: 'AgeSelection' },
}

// TODO(PC-17931): Fix this story
const DenseWithoutIcon = Template.bind({})
DenseWithoutIcon.args = {
  children: TextExample({}),
  dense: true,
  icon: undefined,
  navigateTo: { screen: 'AgeSelection' },
}
