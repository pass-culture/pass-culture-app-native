import Package from '../../package.json'

export const getAppBuildVersion = () => Package.build
export const getAppVersion = () => Package.version
