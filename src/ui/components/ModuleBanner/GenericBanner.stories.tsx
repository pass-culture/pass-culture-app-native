import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { selectArgTypeFromObject } from 'libs/storybook/selectArgTypeFromObject'
import { Bell } from 'ui/svg/icons/Bell'
import { All } from 'ui/svg/icons/bicolor/All'
import { BicolorEverywhere as Everywhere } from 'ui/svg/icons/BicolorEverywhere'
import { Spacer, Typo } from 'ui/theme'

import { GenericBanner } from './GenericBanner'

const BicolorAll = styled(All).attrs(({ theme }) => ({
  color: theme.colors.primary,
  color2: theme.colors.secondary,
  size: theme.icons.sizes.small,
}))``

const StyledBody = styled(Typo.Body)(({ theme }) => ({
  color: theme.colors.secondary,
}))

export default {
  title: 'ui/GenericBanner',
  component: GenericBanner,
  argTypes: {
    LeftIcon: selectArgTypeFromObject({
      Everywhere,
      Bell,
      BicolorAll,
      NoIcon: undefined,
    }),
    children: { control: false },
  },
} as ComponentMeta<typeof GenericBanner>

const Template: ComponentStory<typeof GenericBanner> = (props) => <GenericBanner {...props} />

const textExample = () => (
  <React.Fragment>
    <Typo.ButtonText>Géolocalise-toi</Typo.ButtonText>
    <Spacer.Column numberOfSpaces={1} />
    <Typo.Body numberOfLines={2}>Pour trouver des offres autour de toi.</Typo.Body>
  </React.Fragment>
)

const StyledTextExample = ({ withSubtitle = true }) => (
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

export const Default = Template.bind({})
Default.args = {
  children: textExample(),
  LeftIcon: Everywhere,
}

export const Tall = Template.bind({})
Tall.args = {
  tall: true,
  LeftIcon: Everywhere,
  children: textExample(),
}

export const TallWithoutSubtitle = Template.bind({})
TallWithoutSubtitle.args = {
  tall: true,
  LeftIcon: BicolorAll,
  children: StyledTextExample({ withSubtitle: false }),
}

export const WithoutIcon = Template.bind({})
WithoutIcon.args = {
  children: StyledTextExample({}),
  LeftIcon: undefined,
}

export const WithoutIconWithoutSubtitle = Template.bind({})
WithoutIconWithoutSubtitle.args = {
  children: StyledTextExample({ withSubtitle: false }),
  LeftIcon: undefined,
}
