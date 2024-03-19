import { getClusterImage } from 'features/venuemap/components/VenueMapCluster/getClusterImage'

describe('getClusterImage', () => {
  it('should show nothing when points are less than 2', () => {
    const points = 1

    expect(getClusterImage(points)).toBeUndefined()
  })

  it('should show cluster of 2 when points are 2', () => {
    const points = 2

    expect(getClusterImage(points)).toBe('map_pin_cluster_2')
  })

  it('should show cluster of 9 when points are 9', () => {
    const points = 9

    expect(getClusterImage(points)).toBe('map_pin_cluster_9')
  })

  it('should show cluster 9+ when points are more than 9', () => {
    const points = 10

    expect(getClusterImage(points)).toBe('map_pin_cluster_9plus')
  })
})
