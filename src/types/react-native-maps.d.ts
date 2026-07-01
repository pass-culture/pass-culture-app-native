import type { Component, ComponentType } from 'react'

export type LatLng = {
  latitude: number
  longitude: number
}

export type Region = LatLng & {
  latitudeDelta: number
  longitudeDelta: number
}

type BoundingBox = {
  northEast: LatLng
  southWest: LatLng
}

type Camera = {
  altitude?: number
  zoom?: number
}

export type MapViewProps = any
export type MapMarkerProps = any
export type MarkerPressEvent = any
export type MapPressEvent = any

export const Marker: ComponentType<any>

declare class MapView extends Component<MapViewProps> {
  getCamera(): Promise<Camera>
  getMapBoundaries(): Promise<BoundingBox>
  animateToRegion(region: Region, duration?: number): void
  fitToCoordinates(
    coordinates: LatLng[],
    options?: { edgePadding?: { top: number; right: number; bottom: number; left: number } }
  ): void
  pointForCoordinate(coordinate: LatLng): Promise<{ x: number; y: number }>
}

export default MapView
