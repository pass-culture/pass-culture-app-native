import { NavigationContainer } from '@react-navigation/native'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { TutorialTypes } from 'features/tutorial/enums'
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

const meta: ComponentMeta<typeof AgeButton> = {
  title: 'features/tutorial/AgeButton',
  component: AgeButton,
  argTypes: {
    Icon: selectArgTypeFromObject({
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
}
export default meta

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

export const WithIcon = Template.bind({})
WithIcon.args = {
  children: TextExample({}),
  Icon: <BicolorAll />,
  navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
}

export const WithoutIcon = Template.bind({})
WithoutIcon.args = {
  children: TextExample({}),
  Icon: undefined,
  navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
}

export const WithSubtitle = Template.bind({})
WithSubtitle.args = {
  children: TextExample({ withSubtitle: true }),
  Icon: <BicolorAll />,
  navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
}

export const Dense = Template.bind({})
Dense.args = {
  children: TextExample({}),
  Icon: <BicolorAll />,
  dense: true,
  navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
}

export const DenseWithSubtitle = Template.bind({})
DenseWithSubtitle.args = {
  children: TextExample({ withSubtitle: true }),
  Icon: <BicolorAll />,
  dense: true,
  navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
}

export const DenseWithoutIcon = Template.bind({})
DenseWithoutIcon.args = {
  children: TextExample({}),
  dense: true,
  Icon: undefined,
  navigateTo: { screen: 'AgeSelection', params: { type: TutorialTypes.ONBOARDING } },
}
