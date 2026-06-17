import type { Meta } from '@storybook/react-vite'
import React from 'react'
import styled from 'styled-components/native'

import { ScreenOrigin } from 'features/location/enums'

import { LocationWidget } from './LocationWidget'

const meta: Meta<typeof LocationWidget> = {
  title: 'Features/location/LocationWidget',
  component: LocationWidget,
}
export default meta

const StoryContainer = styled.View({
  width: '100%',
  alignItems: 'center',
})

const Template = () => (
  <StoryContainer>
    <LocationWidget screenOrigin={ScreenOrigin.HOME} />
  </StoryContainer>
)

export const Default = {
  name: 'LocationWidget',
  render: () => Template(),
}
