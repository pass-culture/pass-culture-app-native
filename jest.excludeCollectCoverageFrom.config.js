module.exports = {
  excludeCollectCoverageFrom: [
    '!**/node_modules/**',
    '!**/coverage/**',
    '!src/**/*.stories.*',
    '!src/ui/{storybook,svg,illustrations}/**',
    '!src/features/cheatcodes/**',
    '!src/theme/**',
    '!src/api/gen/**',
    '!src/**/fixtures/**',
    '!src/**/analytics.*',
    '!src/**/styleUtils.*',
  ],
}
