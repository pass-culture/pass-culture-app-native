const invalidateQueries = jest.fn()
export const useMutation = jest
  .fn()
  .mockImplementation((mutationFunction, mutationOptions) => ({
    mutationFunction,
    mutationOptions,
  }))
export const useQueryClient = jest.fn().mockReturnValue({ invalidateQueries })
