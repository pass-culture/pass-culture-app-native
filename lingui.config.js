// @ts-check
/**
 * @type {Partial<import('@lingui/conf').LinguiConfig>}
 */
const config = {
  compileNamespace: 'ts',
  locales: ['fr'],
  sourceLocale: 'fr',
  format: 'po',
  catalogs: [
    {
      path: '<rootDir>/src/locales/{locale}/messages',
      include: ['<rootDir>/src/'],
      exclude: ['**/node_modules/**', '/__tests__/', '*.test.*'],
    },
  ],
  formatOptions: { origins: true, lineNumbers: false },
}
module.exports = config
