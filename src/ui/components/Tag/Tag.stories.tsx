import { ComponentStory } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { Camera } from 'ui/svg/icons/Camera'

import { Tag } from './Tag'

export default {
  title: 'ui/Tag',
  component: Tag,
}

const Template: ComponentStory<typeof Tag> = (props) => <Tag {...props} />

export const Default = Template.bind({})
Default.args = {
  label: '1,4km',
}

const StyledCamera = styled(Camera).attrs(({ theme }) => ({
  size: theme.icons.sizes.extraSmall,
}))``

export const WithIcon = Template.bind({})
WithIcon.args = {
  label: '1',
  Icon: StyledCamera,
}
