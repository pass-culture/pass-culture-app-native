import React from 'react'

import { render } from 'tests/utils/web'
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
  {
    onPress: () => ({}),
    isDisabled: true,
    title: '14h12',
    subtitleLeft: 'Déjà réservé',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '15h55',
    subtitleLeft: 'Complet',
    subtitleRight: '12,99€',
  },
  {
    onPress: () => ({}),
    isDisabled: true,
    title: '16h12',
    subtitleLeft: 'Crédit insuffisant',
  },
  {
    onPress: () => ({}),
    isDisabled: false,
    title: '17h12',
    subtitleLeft: 'Déjà réservé',
  },
]

describe('EventCardList', () => {
  it('should render correctly', () => {
    const eventCardList = render(<EventCardList data={dummyData} />, {
      theme: { isDesktopViewport: true },
    })

    expect(eventCardList).toMatchSnapshot()
  })
})
