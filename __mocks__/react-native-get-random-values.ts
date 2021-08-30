export default {
  getRandomBase64: jest.fn(),
  getRandomValues: jest.fn().mockReturnValue(new Uint32Array(10)),
}
