import { NavigationContainer } from '@react-navigation/native'
import type { Meta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { formatToSlashedFrenchDate } from 'libs/dates'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'
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

const Row = styled.View({
  flexDirection: 'row',
  flexWrap: 'wrap',
})

const variantConfig: Variants<typeof HeaderWithGreyContainer> = [
  {
    label: 'HeaderWithGreyContainer with title',
    props: {
      title: 'Jean Dubois',
    },
  },
  {
    label: 'HeaderWithGreyContainer with info banner',
    props: {
      title: 'Jean Dubois',
      bannerText: 'Some really important information',
    },
  },
  {
    label: 'HeaderWithGreyContainer with subtitle',
    props: {
      title: 'Jean Dubois',
      subtitle: 'Tu as entre 15 et 18 ans\u00a0?',
    },
  },
  {
    label: 'HeaderWithGreyContainer with large content',
    props: {
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
  },
  {
    label: 'HeaderWithGreyContainer with component as subtitle',
    props: {
      title: 'Jean Dubois',
      subtitle: (
        <Row>
          <Typo.Body>Profite de ton crédit jusqu’au&nbsp;</Typo.Body>
          <Typo.BodyAccent>
            {formatToSlashedFrenchDate('2023-02-16T17:16:04.735235')}
          </Typo.BodyAccent>
        </Row>
      ),
    },
  },
]

export const Template: VariantsStory<typeof HeaderWithGreyContainer> = {
  name: 'HeaderWithGreyContainer',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={HeaderWithGreyContainer}
      defaultProps={props}
    />
  ),
}
