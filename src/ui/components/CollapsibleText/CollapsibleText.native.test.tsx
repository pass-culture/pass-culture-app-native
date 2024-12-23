import React from 'react'

import { render, screen } from 'tests/utils'
import { CollapsibleText } from 'ui/components/CollapsibleText/CollapsibleText'

const TEXT =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas nec tellus in magna convallis egestas eget id justo. Donec lorem ante, tempor eu diam quis, laoreet rhoncus tortor. Sed posuere quis sapien sit amet rutrum. Nam arcu dui, blandit vitae massa ac, pulvinar rutrum tellus. Mauris molestie, sapien quis elementum interdum, ipsum turpis varius lorem, quis luctus tellus est et velit. Curabitur accumsan, enim ac tincidunt varius, lectus ligula elementum elit, a porta velit libero quis nunc. Maecenas semper augue justo, ac dapibus erat porttitor quis. Cras porttitor pharetra quam, et suscipit felis fringilla in. Aliquam ultricies mauris at vehicula finibus. Donec sed justo turpis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nunc dictum tempus velit, nec volutpat dolor fermentum non. Nullam efficitur diam nec orci aliquam, ut accumsan turpis convallis. Duis erat diam, ultricies non dolor a, elementum sagittis nibh. Curabitur dapibus ipsum eget quam scelerisque, eget venenatis urna laoreet.'
const NUMBER_OF_LINES = 5

jest.mock('libs/firebase/analytics/analytics')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

describe('<CollapsibleText />', () => {
  it('should render collapsible text', () => {
    render(<CollapsibleText numberOfLines={NUMBER_OF_LINES}>{TEXT}</CollapsibleText>)

    expect(screen.getByText(TEXT)).toBeOnTheScreen()
  })
})
