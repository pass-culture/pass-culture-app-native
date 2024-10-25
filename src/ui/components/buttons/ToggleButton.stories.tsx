import { ComponentStory, ComponentMeta } from '@storybook/react'
import React from 'react'
import styled from 'styled-components/native'

import { ToggleButtonSize, ToggleButton } from 'ui/components/buttons/ToggleButton'
import { Separator } from 'ui/components/Separator'
import { ViewGap } from 'ui/components/ViewGap/ViewGap'
import { Bell } from 'ui/svg/icons/Bell'
import { BellFilled } from 'ui/svg/icons/BellFilled'
import { TypoDS } from 'ui/theme'

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

const FourVariantsTemplate: ComponentStory<typeof ToggleButton> = (args) => (
  <ViewGap gap={4}>
    <TypoDS.BodyAccentXs>ToggleButton inactive medium</TypoDS.BodyAccentXs>
    <ToggleButton {...args} active={false} size={ToggleButtonSize.MEDIUM} />
    <Separator.Horizontal />
    <TypoDS.BodyAccentXs>ToggleButton inactive small</TypoDS.BodyAccentXs>
    <ToggleButton {...args} active={false} size={ToggleButtonSize.SMALL} />
    <Separator.Horizontal />
    <TypoDS.BodyAccentXs>ToggleButton active medium</TypoDS.BodyAccentXs>
    <ToggleButton {...args} active size={ToggleButtonSize.MEDIUM} />
    <Separator.Horizontal />
    <TypoDS.BodyAccentXs>ToggleButton active small</TypoDS.BodyAccentXs>
    <ToggleButton {...args} active size={ToggleButtonSize.SMALL} />
  </ViewGap>
)

export const AllVariants = FourVariantsTemplate.bind({})
AllVariants.args = {
  label: { active: 'Déjà suivi', inactive: 'Suivre' },
  accessibilityLabel: { active: 'Thème déjà suivi', inactive: 'Suivre ce thème' },
  Icon: { active: ActiveBell, inactive: InactiveBell },
}
