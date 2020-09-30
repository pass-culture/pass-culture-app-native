class RNLocalize {
  static registeredHandler = () => {};
  static findBestAvailableLanguage = jest.fn(() => undefined);

  static addEventListener = jest.fn((_, handler) => {
    RNLocalize.registeredHandler = handler;
  });
  static removeEventListener = jest.fn();

  static simulateLocalizationChange = () => {
    RNLocalize.registeredHandler();
  };

  static findBestAvailableLanguage = jest.fn(() => ({
    languageTag: 'en',
    isRTL: false,
  }));
}

module.exports = RNLocalize;
