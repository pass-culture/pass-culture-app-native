import { Activity } from 'api/gen'

import { getClusterColorByDominantActivity } from './getClusterColorByDominantActivity'

describe('getClusterColorByDominantActivity', () => {
  it('should return the color upon venue type occurences (orange)', () => {
    const activities: Activity[] = [Activity.GAMES_CENTRE, Activity.ART_GALLERY, Activity.LIBRARY]

    expect(getClusterColorByDominantActivity(activities)).toBe('orange')
  })

  it('should return the color upon venue type occurences (blue_orange)', () => {
    const activities: Activity[] = [
      Activity.GAMES_CENTRE,
      Activity.ART_GALLERY,
      Activity.LIBRARY,
      Activity.OTHER,
    ]

    expect(getClusterColorByDominantActivity(activities)).toBe('blue_orange')
  })

  it('should return the color upon venue type occurences (blue)', () => {
    const activities: Activity[] = [
      Activity.HERITAGE_SITE,
      Activity.CULTURAL_CENTRE,
      Activity.OTHER,
    ]

    expect(getClusterColorByDominantActivity(activities)).toBe('blue')
  })

  it('should return the color upon venue type occurences (pink)', () => {
    const activities: Activity[] = [
      Activity.BOOKSTORE,
      Activity.CREATIVE_ARTS_STORE,
      Activity.DISTRIBUTION_STORE,
    ]

    expect(getClusterColorByDominantActivity(activities)).toBe('pink')
  })

  it('should return the color upon venue type occurences (orange_pink)', () => {
    const activities: Activity[] = [
      Activity.GAMES_CENTRE,
      Activity.BOOKSTORE,
      Activity.CREATIVE_ARTS_STORE,
      Activity.DISTRIBUTION_STORE,
    ]

    expect(getClusterColorByDominantActivity(activities)).toBe('orange_pink')
  })

  it('should return the color with higher priority (blue_orange_pink)', () => {
    const activities: Activity[] = [Activity.GAMES_CENTRE, Activity.BOOKSTORE, Activity.OTHER]

    expect(getClusterColorByDominantActivity(activities)).toBe('blue_orange_pink')
  })

  it('should return the color with higher priority (blue_pink)', () => {
    const activities: Activity[] = [Activity.BOOKSTORE, Activity.OTHER]

    expect(getClusterColorByDominantActivity(activities)).toBe('blue_pink')
  })
})
