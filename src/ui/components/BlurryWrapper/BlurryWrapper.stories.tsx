import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { ButtonPrimary } from 'ui/components/buttons/ButtonPrimary'

import { BlurryWrapper } from './BlurryWrapper'

const meta: ComponentMeta<typeof BlurryWrapper> = {
  title: 'ui/BlurryWrapper',
  component: BlurryWrapper,
}

export default meta

const Template: ComponentStory<typeof BlurryWrapper> = (props) => (
  <Background>
    <BlurryWrapper {...props} />
  </Background>
)

export const Default = Template.bind({})
Default.args = {
  children: <ButtonPrimary wording="Réserver l’offre" mediumWidth />,
}

const Background = styled.View({
  width: '100%',
  height: '400px',
  backgroundImage:
    "url('https://img.freepik.com/photos-gratuite/produit-beaute-explosant-couleurs-vibrantes-ia-generatrice-poudre_188544-9687.jpg?size=626&ext=jpg&ga=GA1.1.953763522.1701356022')",

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})
