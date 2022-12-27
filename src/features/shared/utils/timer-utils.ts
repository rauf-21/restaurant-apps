export function setAbortableTimeout(
  callback: () => void,
  delayInMilliseconds: number,
  options?: { signal?: AbortSignal }
) {
  /* eslint-disable @typescript-eslint/no-use-before-define */
  options?.signal?.addEventListener('abort', handleAbort);

  const internalTimer = setTimeout(() => {
    options?.signal?.removeEventListener('abort', handleAbort);
    callback();
  }, delayInMilliseconds);

  function handleAbort() {
    clearTimeout(internalTimer);
  }
}
