const pendingRequests = new Map<string, (data: any) => void>();

export function addPendingRequest(correlationId: string, resolver: (data: any) => void) {
  pendingRequests.set(correlationId, resolver);
}

export function resolvePendingRequest(correlationId: string, data: any) {
  const resolve = pendingRequests.get(correlationId);
  if (resolve) {
    resolve(data);
    pendingRequests.delete(correlationId);
  }
}

export function rejectPendingRequest(correlationId: string, error: Error) {
  const resolve = pendingRequests.get(correlationId);
  if (resolve) {
    resolve(Promise.reject(error));
    pendingRequests.delete(correlationId);
  }
}
