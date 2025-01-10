import { ComponentStory, ComponentMeta } from '@storybook/react'
import { userEvent, screen } from '@storybook/testing-library'
import React, { Fragment } from 'react'

import { TypoDS } from 'ui/theme'

import { QuickAccess } from './QuickAccess'

const meta: ComponentMeta<typeof QuickAccess> = {
  title: 'ui/accessibility/QuickAccess',
  component: QuickAccess,
}
export default meta

const caption = 'QuickAccess'
const body = ' is a component that should be visible only when giving focus'

const Template: ComponentStory<typeof QuickAccess> = (args) => (
  <Fragment>
    <TypoDS.Body>
      <TypoDS.BodyAccentXs>{caption}</TypoDS.BodyAccentXs>
      {body}
    </TypoDS.Body>
    <QuickAccess {...args} />
  </Fragment>
)

export const Default = Template.bind({})
Default.storyName = 'QuickAccess'
Default.args = {
  href: '#',
  title: 'Go to link',
}
Default.play = async () => {
  await screen.findByRole('link') // wait first render

  userEvent.tab()
}
