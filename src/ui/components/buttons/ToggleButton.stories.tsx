import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'

import { ToggleButton } from './ToggleButton'

const meta: ComponentMeta<typeof ToggleButton> = {
  title: 'ui/buttons/ToggleButton',
  component: ToggleButton,
}
export default meta

const Template: ComponentStory<typeof ToggleButton> = (props) => <ToggleButton {...props} />

const InactiveBell = styled(Bell).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const ActiveBell = styled(BellFilled).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

export const Inactive = Template.bind({})
Inactive.args = {
  active: false,
  label: { active: 'Déjà suivi', inactive: 'Suivre' },
  accessibilityLabel: { active: 'Thème déjà suivi', inactive: 'Suivre ce thème' },
  Icon: { active: ActiveBell, inactive: InactiveBell },
}

export const Active = Template.bind({})
Active.args = {
  active: true,
  label: { active: 'Déjà suivi', inactive: 'Suivre' },
  accessibilityLabel: { active: 'Thème déjà suivi', inactive: 'Suivre ce thème' },
  Icon: { active: ActiveBell, inactive: InactiveBell },
}
