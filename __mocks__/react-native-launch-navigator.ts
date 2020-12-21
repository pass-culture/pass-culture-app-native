export const getAvailableApps = jest.fn(() =>
  Promise.resolve({ google_maps: true, waze: true, citymapper: false })
)

export default {
  getAvailableApps,
}
