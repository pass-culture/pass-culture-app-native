import type { Meta } from '@storybook/react'
import React from 'react'

import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'
import { Markdown } from 'ui/components/Markdown/Markdown'
import { VariantsTemplate, type Variants, type VariantsStory } from 'ui/storybook/VariantsTemplate'

const meta: Meta<typeof CollapsibleText> = {
  title: 'ui/CollapsibleText',
  component: CollapsibleText,
}
export default meta

const variantConfig: Variants<typeof CollapsibleText> = [
  {
    label: 'CollapsibleText default',
    props: {
      children:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.',
      collapsedLineCount: 5,
    },
  },
  {
    label: 'CollapsibleText without button',
    props: {
      children: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      collapsedLineCount: 5,
    },
  },
  {
    label: 'CollapsibleText with markdown',
    props: {
      children: (
        <Markdown>
          {
            'Lorem ipsum **_dolor sit amet_**, consectetur adipiscing elit. **Maecenas nec tellus** in magna convallis egestas eget id justo. _Donec lorem ante_, tempor eu diam quis, laoreet rhoncus tortor.'
          }
        </Markdown>
      ),
      collapsedLineCount: 5,
    },
  },
]

export const Template: VariantsStory<typeof CollapsibleText> = {
  name: 'CollapsibleText',
  render: (props) => (
    <VariantsTemplate variants={variantConfig} Component={CollapsibleText} defaultProps={props} />
  ),
}
