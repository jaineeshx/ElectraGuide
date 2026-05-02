jest.mock('mongoose', () => {
  const actual = jest.requireActual('mongoose');
  return {
    ...actual,
    connect: jest.fn().mockResolvedValue(true),
    Schema: actual.Schema,
    model: jest.fn().mockReturnValue({
      findOne: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue(true),
      prototype: {
        save: jest.fn().mockResolvedValue(true)
      }
    })
  };
});
