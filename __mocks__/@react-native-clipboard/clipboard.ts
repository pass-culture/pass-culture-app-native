export default {
  setString: jest.fn(),
  getString: jest.fn().mockResolvedValue('Some text'),
}
