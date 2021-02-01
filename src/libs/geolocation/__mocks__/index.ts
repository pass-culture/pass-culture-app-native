export const useGeolocation = jest.fn(() => ({
  position: {
    latitude: 90,
    longitude: 90,
    accuracy: 1,
    altitude: null,
    heading: null,
    speed: null,
    altitudeAccuracy: null,
  },
}))
