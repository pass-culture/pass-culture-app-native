import React from 'react'

import { render } from 'tests/utils'
import { EventCardList } from 'ui/components/eventCard/EventCardList'

const dummyData = [
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '8h',
    subtitleLeft: 'VO, 3D',
    subtitleRight: '5,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '9h30',
    subtitleLeft: 'VF, ICE, 3D',
    subtitleRight: '7,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: true,
    title: '10h55',
    subtitleLeft: 'Complet',
    subtitleRight: '12,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: true,
    title: '13h12',
    subtitleLeft: 'Crédit insuffisant',
  },
]

describe('EventCardList', () => {
  it('should render correctly', () => {
    const eventCardList = render(<EventCardList data={dummyData} />)

    expect(eventCardList).toMatchSnapshot()
  })
})
