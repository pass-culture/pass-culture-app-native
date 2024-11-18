const path = require('path')
const fs = require('fs')
const globalMocks = require('./global-mocks.ts')

function customResolver(request, options) {
  const resolvedPath = options.defaultResolver(request, options)

  if (globalMocks) {
    const isTargetedForMock = globalMocks.some((target) =>
      resolvedPath.includes(path.join(...target.split('/')))
    )

    if (isTargetedForMock) {
      const dirName = path.dirname(resolvedPath)

      const mockPath = path.join(dirName, '__mocks__', path.basename(resolvedPath))

      if (fs.existsSync(mockPath)) {
        return mockPath
      }
    }
  }

  return resolvedPath
}

module.exports = customResolver
