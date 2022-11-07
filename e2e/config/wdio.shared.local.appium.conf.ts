import { config } from './wdio.shared.conf'
import { env } from './environment/env'

//
// ======
// Appium
// ======
//
config.services = (config.services || []).concat([
  [
    'appium',
    {
      // This will use the globally installed version of Appium
      command: 'appium',
      args: {
        // This is needed to tell Appium that we can execute local ADB commands
        // and to automatically download the latest version of ChromeDriver
        relaxedSecurity: true,
        address: 'localhost',
        // Write the Appium logs to a file in the root of the directory
        log: './appium.log',
      },
    },
  ],
])

//
// =====================
// Server Configurations
// =====================
//
config.port = env.APPIUM_TEST_SERVER_PORT

export default config
