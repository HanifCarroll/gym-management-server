export const supabaseServiceMock = {
  getClient: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  single: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
};
