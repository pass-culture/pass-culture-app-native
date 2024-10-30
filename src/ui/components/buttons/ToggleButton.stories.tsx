import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { ToggleButton, ToggleButtonSize } from 'ui/components/buttons/ToggleButton'
import { VariantsTemplate } from 'ui/storybook/VariantsTemplate'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'

const meta: ComponentMeta<typeof ToggleButton> = {
  title: 'ui/buttons/ToggleButton',
  component: ToggleButton,
}
export default meta

const InactiveBell = styled(Bell).attrs(({ theme }) => ({
  size: theme.icons.sizes.small,
}))``

const ActiveBell = styled(BellFilled).attrs(({ theme }) => ({
  color: theme.colors.primary,
  size: theme.icons.sizes.small,
}))``

const baseProps = {
  Icon: { active: ActiveBell, inactive: InactiveBell },
  label: { active: 'Déjà suivi', inactive: 'Suivre' },
  accessibilityLabel: { active: 'Thème déjà suivi', inactive: 'Suivre ce thème' },
  onPress: () => 'doNothing',
}

const variantConfig = [
  {
    label: 'ToggleButton inactive medium',
    props: { ...baseProps, active: false, size: ToggleButtonSize.MEDIUM },
  },
  {
    label: 'ToggleButton inactive small',
    props: { ...baseProps, active: false, size: ToggleButtonSize.SMALL },
  },
  {
    label: 'ToggleButton active medium',
    props: { ...baseProps, active: true, size: ToggleButtonSize.MEDIUM },
  },
  {
    label: 'ToggleButton active small',
    props: { ...baseProps, active: true, size: ToggleButtonSize.SMALL },
  },
]

const Template: ComponentStory<typeof VariantsTemplate> = () => (
  <VariantsTemplate variants={variantConfig} Component={ToggleButton} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'ToggleButton'
