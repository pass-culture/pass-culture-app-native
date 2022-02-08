import 'jest-canvas-mock'

jest.unmock('react-native-modal')

window.open = jest.fn()

export {}
