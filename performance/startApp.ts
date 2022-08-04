import { AppiumDriver } from '@bam.tech/appium-helper'
import { TestCase, PerformanceTester } from '@perf-profiler/e2e'

const bundleId = 'app.passculture.staging'
const appActivity = 'com.passculture.MainActivity'

const getTestCase = async () => {
  const driver = await AppiumDriver.create({
    appPackage: bundleId,
    appActivity: appActivity,
  })

  const startAppTestCase: TestCase = {
    beforeTest: async () => {
      driver.stopApp()
      await driver.wait(3000)
    },
    run: async () => {
      driver.startApp()

      // Works with Appium/UIAutomator only if we disable animations
      // await driver.findElementByText('playlist de lieux')
      // await driver.clickElementById('Search tab')
      // await driver.findElementByText('Explore')
    },
    duration: 10000,
  }

  return startAppTestCase
}

const main = async () => {
  const testCase = await getTestCase()

  const tester = new PerformanceTester(bundleId)

  await tester.iterate(testCase, 10)
  tester.writeResults()
}

main()
