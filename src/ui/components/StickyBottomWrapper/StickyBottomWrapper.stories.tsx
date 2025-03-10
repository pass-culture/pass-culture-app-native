import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { SHARE_APP_IMAGE_SOURCE } from 'features/share/components/shareAppImage'
import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { BicolorWarning } from 'ui/svg/icons/BicolorWarning'

import { StickyBottomWrapper } from './StickyBottomWrapper'

const meta: Meta<typeof StickyBottomWrapper> = {
  title: 'ui/StickyBottomWrapper',
  component: StickyBottomWrapper,
}
export default meta

type Story = StoryObj<typeof StickyBottomWrapper>

const StoryComponent = (props: React.ComponentProps<typeof StickyBottomWrapper>) => (
  <React.Fragment>
    <InformationWithIcon
      Icon={BicolorWarning}
      text="To have a correct layout, the parent of StickyBottomWrapper must be in `position: relative;`"
    />
    <ImageBackground source={SHARE_APP_IMAGE_SOURCE}>
      <StickyBottomWrapper {...props} />
    </ImageBackground>
  </React.Fragment>
)

export const Default: Story = {
  render: (props) => <StoryComponent {...props} />,
  args: {
    children: <ButtonPrimary wording="Réserver l’offre" />,
  },
  name: 'StickyBottomWrapper',
}

const ImageBackground = styled.ImageBackground({
  width: '400px',
  height: '400px',
  position: 'relative',
})
