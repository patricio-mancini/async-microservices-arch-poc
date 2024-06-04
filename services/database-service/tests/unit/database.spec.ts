import { connectDatabase } from '../../src/database';
import mongoose from 'mongoose';

jest.mock('mongoose');

describe('Database Connection', () => {
  it('should connect to MongoDB successfully', async () => {
    const connectMock = mongoose.connect as jest.Mock;
    connectMock.mockResolvedValue(undefined);

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });

    await connectDatabase();
    expect(logSpy).toHaveBeenCalledWith('Connected to MongoDB');
  });

  it('should log error if connection fails', async () => {
    const connectMock = mongoose.connect as jest.Mock;
    const error = new Error('Connection error');
    connectMock.mockRejectedValue(error);

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });

    await expect(connectDatabase()).rejects.toThrow('Connection error');
    expect(errorSpy).toHaveBeenCalledWith('Error connecting to MongoDB:', error);
  });
});
