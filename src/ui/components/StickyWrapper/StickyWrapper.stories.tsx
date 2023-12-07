import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'
import { InformationWithIcon } from 'ui/components/InformationWithIcon'
import { BicolorWarning } from 'ui/svg/icons/BicolorWarning'

import { StickyWrapper } from './StickyWrapper'

const meta: ComponentMeta<typeof StickyWrapper> = {
  title: 'ui/StickyWrapper',
  component: StickyWrapper,
}
export default meta

const Template: ComponentStory<typeof StickyWrapper> = (props) => (
  <React.Fragment>
    <InformationWithIcon
      Icon={BicolorWarning}
      text="To have a correct layout, the parent of StickyWrapper must be in `position: relative;`"
    />
    <Background>
      <StickyWrapper {...props} />
    </Background>
  </React.Fragment>
)

export const Default = Template.bind({})
Default.args = {
  children: <ButtonPrimary wording="Réserver l’offre" />,
}

const Background = styled.View({
  width: '400px',
  height: '400px',
  backgroundImage:
    'url("https://img.freepik.com/free-photo/painting-mountain-lake-with-mountain-background_188544-9126.jpg?w=2000&t=st=1701356049~exp=1701356649~hmac=6a462a2b6bb330ed3be82c39f0cbbf763fa130a646e4874b0c969352ae2641a1")',
  backgroundSize: 'cover',
  position: 'relative',
})
