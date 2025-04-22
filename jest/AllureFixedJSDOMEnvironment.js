// eslint-disable-next-line @typescript-eslint/no-var-requires, import/no-extraneous-dependencies
const AllureJSDOMEnvironment = require('allure-jest/dist/cjs/jsdom')

class AllureFixedJSDOMEnvironment extends AllureJSDOMEnvironment {
  constructor(config, context) {
    super(config, context)

    this.customExportConditions = config?.testEnvironmentOptions?.customExportConditions || ['']

    this.global.TextDecoder = global.TextDecoder
    this.global.TextEncoder = global.TextEncoder
    this.global.ReadableStream = global.ReadableStream

    this.global.Blob = global.Blob
    this.global.Headers = global.Headers
    this.global.FormData = global.FormData
    this.global.Request = global.Request
    this.global.Response = global.Response
    this.global.fetch = global.fetch
    this.global.structuredClone = global.structuredClone
    this.global.URL = global.URL
    this.global.URLSearchParams = global.URLSearchParams

    this.global.BroadcastChannel = global.BroadcastChannel
    this.global.TransformStream = global.TransformStream
  }
}

module.exports = AllureFixedJSDOMEnvironment
