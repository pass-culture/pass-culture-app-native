import LaunchNavigator from 'react-native-launch-navigator'

export enum AppEnum {
  APPLE_MAPS = 'apple_maps',
  GOOGLE_MAPS = 'google_maps',
  WAZE = 'waze',
  CITYMAPPER = 'citymapper',
  NAVIGON = 'navigon',
  TRANSIT_APP = 'transit_app',
  YANDEX = 'yandex',
  UBER = 'uber',
  TOMTOM = 'tomtom',
  BING_MAPS = 'bing_maps',
  SYGIC = 'sygic',
  HERE_MAPS = 'here_maps',
  MOOVIT = 'moovit',
  LYFT = 'lyft',
  MAPS_ME = 'maps_me',
  CABIFY = 'cabify',
  BAIDU = 'baidu',
  TAXIS_99 = 'taxis_99',
  GAODE = 'gaode',
}

// Type definitions for react-native-launch-navigator
// Project: https://github.com/dpa99c/react-native-launch-navigator
// Definitions by: Dave Alden <https://github.com/dpa99c>
// Usage: import { LaunchNavigator, LaunchNavigatorOptions } from 'react-native-launch-navigator';

export interface LaunchNavigatorOptions {
  /**
   * name of the navigation app to use for directions.
   * Specify using LaunchNavigator.APP constants.
   * e.g. `LaunchNavigator.APP.GOOGLE_MAPS`.
   */
  app?: AppEnum

  /**
   * nickname to display in app for destination. e.g. "Bob's House".
   */
  destinationName?: string

  /**
   * Start point of the navigation.
   * If not specified, the current device location will be used.
   * Either:
   *  - a {string} containing the address. e.g. "Buckingham Palace, London"
   *  - a {string} containing a latitude/longitude coordinate. e.g. "50.1. -4.0"
   *  - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
   */
  start?: string | number[]

  /**
   * nickname to display in app for start . e.g. "My House".
   */
  startName?: string

  /**
   * Transportation mode for navigation: "driving", "walking" or "transit". Defaults to "driving" if not specified.
   */
  transportMode?: string

  /**
   * Android: mode in which to open Google Maps app.
   * `LaunchNavigator.LAUNCH_MODE.MAPS` or `LaunchNavigator.LAUNCH_MODE.TURN_BY_TURN`
   * Defaults to `LaunchNavigator.LAUNCH_MODE.MAPS` if not specified.
   *
   * iOS: method to use to open Apple Maps app.
   * `LaunchNavigator.LAUNCH_MODE.URI_SCHEME` or `LaunchNavigator.LAUNCH_MODE.MAPKIT`
   * Defaults to `LaunchNavigator.LAUNCH_MODE.URI_SCHEME` if not specified.
   */
  launchMode?: string

  /**
   * a key/value map of extra app-specific parameters. For example, to tell Google Maps on Android to display Satellite view in "maps" launch mode: `{"t": "k"}`
   */
  extras?: unknown

  /**
   * If true, and input location type(s) doesn't match those required by the app, use geocoding to obtain the address/coords as required. Defaults to true.
   */
  enableGeocoding?: boolean
}

export interface LaunchNavigatorType {
  /**
   * Supported platforms
   */
  PLATFORM: unknown

  /**
   * string constants, used to identify apps in native code
   */
  APP: {
    APPLE_MAPS: AppEnum.APPLE_MAPS
    GOOGLE_MAPS: AppEnum.GOOGLE_MAPS
    WAZE: AppEnum.WAZE
    CITYMAPPER: AppEnum.CITYMAPPER
    NAVIGON: AppEnum.NAVIGON
    TRANSIT_APP: AppEnum.TRANSIT_APP
    YANDEX: AppEnum.YANDEX
    UBER: AppEnum.UBER
    TOMTOM: AppEnum.TOMTOM
    BING_MAPS: AppEnum.BING_MAPS
    SYGIC: AppEnum.SYGIC
    HERE_MAPS: AppEnum.HERE_MAPS
    MOOVIT: AppEnum.MOOVIT
    LYFT: AppEnum.LYFT
    MAPS_ME: AppEnum.MAPS_ME
    CABIFY: AppEnum.CABIFY
    BAIDU: AppEnum.BAIDU
    TAXIS_99: AppEnum.TAXIS_99
    GAODE: AppEnum.GAODE
  }

  /**
   * All possible transport modes
   */
  TRANSPORT_MODE: unknown

  /**
   * Launch modes supported by Google Maps on Android
   */
  LAUNCH_MODE: unknown

  /**
   * Launches navigator app
   * @param destination {string|number[]} Location name or coordinates (as string or array)
   * Either:
   * - a {string} containing the address. e.g. "Buckingham Palace, London"
   * - a {string} containing a latitude/longitude coordinate. e.g. "50.1. -4.0"
   * - an {array}, where the first element is the latitude and the second element is a longitude, as decimal numbers. e.g. [50.1, -4.0]
   * @param options {LaunchNavigatorOptions}
   * @return Promise
   * - resolved when the navigation app is successfully launched
   * - rejected if an error is encountered while launching the app. Will be passed a single string argument containing the error message.
   */
  navigate: (destination: string | number[], options?: LaunchNavigatorOptions) => Promise

  /**
   * Returns a list indicating which apps are installed and available on the current device.
   * @return {object} - a key/value object where the key is the app name as a constant in `LaunchNavigator.APP` and the value is a boolean indicating whether the app is available.
   */
  getAvailableApps: () => Promise<Record<AppEnum, boolean>>
}

export default LaunchNavigator as LaunchNavigatorType
