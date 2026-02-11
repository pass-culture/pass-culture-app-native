let clipboardContent = 'Some text'

export default {
  setString: jest.fn((text: string) => {
    clipboardContent = text
  }),
  getString: jest.fn(() => Promise.resolve(clipboardContent)),
}
