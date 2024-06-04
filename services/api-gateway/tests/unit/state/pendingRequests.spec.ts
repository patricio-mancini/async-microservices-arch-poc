import { addPendingRequest, resolvePendingRequest, rejectPendingRequest } from '../../../src/state/pendingRequests';

describe('pendingRequests', () => {
  it('should add, resolve and reject pending requests', () => {
    const resolver = jest.fn();
    addPendingRequest('test-id', resolver);

    resolvePendingRequest('test-id', 'test-data');
    expect(resolver).toHaveBeenCalledWith('test-data');

    const rejectResolver = jest.fn();
    addPendingRequest('test-reject-id', rejectResolver);

    rejectPendingRequest('test-reject-id', new Error('test-error'));
    expect(rejectResolver).toHaveBeenCalled();
    expect(rejectResolver.mock.calls[0][0]).rejects.toThrow('test-error');
  });
});
