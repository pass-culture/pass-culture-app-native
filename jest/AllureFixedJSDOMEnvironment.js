/* eslint-disable import/no-extraneous-dependencies */
import { createJestEnvironment } from 'allure-jest/factory'
import FixedJSDom from 'jest-fixed-jsdom'

module.exports = createJestEnvironment(FixedJSDom)
