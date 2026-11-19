// Small client for the Discover API. Errors carry the HTTP status and server error code.

async function request(path, options) {
  const res = await fetch(path, { cache: 'no-store', ...options });
  let body = null;
  try {
    body = await res.json();
  } catch {
    // non-JSON response
  }
  if (!res.ok) {
    const err = new Error(body?.error?.message || `Request failed (${res.status})`);
    err.status = res.status;
    err.code = body?.error?.code;
    throw err;
  }
  return body;
}

const post = (path, body) =>
  request(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body ?? {}),
  });

export const api = {
  feed: () => request('/feed'),
  matches: () => request('/matches'),
  swipe: (profileId, action) => post('/swipe', { profileId, action }),
  reset: () => post('/reset'),
};
