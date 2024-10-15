import { CLUSTER_IMAGE_COLOR_NAME } from 'features/venueMap/components/VenueMapView/constant'
import { getClusterImage } from 'features/venueMap/helpers/venueMapCluster/getClusterImage'

describe('getClusterImage', () => {
  it('should show nothing when points are less than 2', () => {
    const points = 1

    expect(getClusterImage(points)).toBeUndefined()
  })

  it('should show cluster of 2 when points are 2', () => {
    const points = 2

    expect(getClusterImage(points)).toBe('map_pin_cluster_blue_2')
  })

  it('should show cluster of 9 when points are 9', () => {
    const points = 9

    expect(getClusterImage(points)).toBe('map_pin_cluster_blue_9')
  })

  it('should show cluster 9+ when points are more than 9', () => {
    const points = 10

    expect(getClusterImage(points)).toBe('map_pin_cluster_blue_9plus')
  })

  it('should show cluster with different colors', () => {
    expect(getClusterImage(3, CLUSTER_IMAGE_COLOR_NAME.ORANGE)).toBe('map_pin_cluster_orange_3')
    expect(getClusterImage(6, CLUSTER_IMAGE_COLOR_NAME.PINK)).toBe('map_pin_cluster_pink_6')
  })
})
