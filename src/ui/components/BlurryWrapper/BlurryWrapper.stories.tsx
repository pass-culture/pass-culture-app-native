import { StoryObj, Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { BlurryWrapper } from './BlurryWrapper'

const meta: Meta<typeof BlurryWrapper> = {
  title: 'ui/BlurryWrapper',
  component: BlurryWrapper,
}

export default meta

const Template: StoryObj<typeof BlurryWrapper> = (props) => (
  <ImageBackground source={SHARE_APP_IMAGE_SOURCE}>
    <BlurryWrapper {...props} />
  </ImageBackground>
)

export const Default = Template.bind({})
Default.storyName = 'BlurryWrapper'
Default.args = {
  children: <ButtonPrimary wording="Réserver l’offre" mediumWidth />,
}

const ImageBackground = styled.ImageBackground({
  width: '100%',
  height: '400px',
  justifyContent: 'center',
})
