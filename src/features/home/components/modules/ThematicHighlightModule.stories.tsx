import type { Meta } from '@storybook/react-vite'
import mockDate from 'mockdate'
import React from 'react'

import { CURRENT_DATE } from 'features/auth/fixtures/fixtures'
import { Variants, VariantsStory, VariantsTemplate } from 'ui/storybook/VariantsTemplate'

import { ThematicHighlightModule } from './ThematicHighlightModule'

mockDate.set(CURRENT_DATE)

const meta: Meta<typeof ThematicHighlightModule> = {
  title: 'Features/home/ThematicHighlightModule',
  component: ThematicHighlightModule,
}
export default meta

const defaultArgs = {
  id: 'toto',
  title: 'Lorem ipsum',
  subtitle: 'Dolor sit amet',
  imageUrl:
    'https://img-19.ccm2.net/8vUCl8TXZfwTt7zAOkBkuDRHiT8=/1240x/smart/b829396acc244fd484c5ddcdcb2b08f3/ccmcms-commentcamarche/20494859.jpg',
  beginningDate: new Date('2022-12-21'),
  endingDate: new Date('2023-01-01'),
  thematicHomeEntryId: '351351',
  index: 0,
}

const variantConfig: Variants<typeof ThematicHighlightModule> = [
  {
    label: 'ThematicHighlightModule Default',
    props: {
      ...defaultArgs,
    },
  },
  {
    label: 'ThematicHighlightModule OneDayHighlight',
    props: {
      ...defaultArgs,
      beginningDate: new Date('2022-12-21'),
      endingDate: new Date('2022-12-21'),
    },
  },
]

export const Template: VariantsStory<typeof ThematicHighlightModule> = {
  name: 'ThematicHighlightModule',
  render: (props) => (
    <VariantsTemplate
      variants={variantConfig}
      Component={ThematicHighlightModule}
      defaultProps={props}
    />
  ),
}
