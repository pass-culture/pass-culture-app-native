import { ComponentMeta } from '@storybook/react'
import React from 'react'

import { computedTheme } from 'tests/computedTheme'
import { mapSnackBarTypeToStyle } from 'ui/components/snackBar/mapSnackBarTypeToStyle'
import { SnackBarType } from 'ui/components/snackBar/types'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'
import { getSpacing } from 'ui/theme'

import { SnackBar } from './SnackBar'

const meta: ComponentMeta<typeof SnackBar> = {
  title: 'ui/SnackBar',
  component: SnackBar,
}
export default meta

const variantConfig: Variants<typeof SnackBar> = [
  {
    label: 'SnackBar success',
    props: {
      visible: true,
      message: 'Une petite snackbar de succès',
      ...mapSnackBarTypeToStyle(computedTheme, SnackBarType.SUCCESS),
    },
    minHeight: getSpacing(10),
  },
  {
    label: 'SnackBar info',
    props: {
      visible: true,
      message: 'Une petite snackbar d’info',
      ...mapSnackBarTypeToStyle(computedTheme, SnackBarType.INFO),
    },
    minHeight: getSpacing(10),
  },
  {
    label: 'SnackBar error',
    props: {
      visible: true,
      message: 'Une petite snackbar d’erreur',
      ...mapSnackBarTypeToStyle(computedTheme, SnackBarType.ERROR),
    },
    minHeight: getSpacing(10),
  },
]

const Template: VariantsStory<typeof SnackBar> = () => (
  <VariantsTemplate variants={variantConfig} Component={SnackBar} />
)

export const AllVariants = Template.bind({})
AllVariants.storyName = 'SnackBar'
