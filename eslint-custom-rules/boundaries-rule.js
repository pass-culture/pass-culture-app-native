const fs = require('fs')
const path = require('path')

const featureDirs = fs
  .readdirSync(path.resolve(__dirname, '../src/features'))
  .filter((dir) => fs.statSync(path.resolve(__dirname, '../src/features', dir)).isDirectory())
  .map((dir) => ({
    type: `feature-${dir}`,
    pattern: `src/features/${dir}`,
  }))

const queryDirs = featureDirs.map((dir) => {
  return {
    type: `queries-${dir.type}`,
    pattern: `${dir.pattern.slice(4)}/queries`,
  }
})

const boundariesElements = [...featureDirs, ...queryDirs]

const boundariesRule = {
  default: 'allow',
  rules: [
    ...featureDirs.map((feature) => {
      const forbiddenQueries = queryDirs
        .filter((query) => !query.type.includes(feature.type))
        .map((query) => query.type)

      return {
        from: feature.type,
        disallow: forbiddenQueries,
        message:
          'Importing queries from other features is not allowed. If this query is used by multiple features, please move it to src/queries. Otherwise, keep it within its feature directory.',
      }
    }),
  ],
}

module.exports = {
  boundariesRule,
  boundariesElements,
}
