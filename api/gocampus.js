const BASE_URL = 'https://gc-api.raphysicsedu.com';

async function parseResponse(response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : null;
  } catch {
    return text;
  }
}

function buildError(payload, fallbackMessage) {
  if (!payload) {
    return new Error(fallbackMessage);
  }

  if (typeof payload === 'string') {
    return new Error(payload || fallbackMessage);
  }

  if (payload.message) {
    return new Error(payload.message);
  }

  if (payload.detail) {
    return new Error(payload.detail);
  }

  if (payload.non_field_errors?.length) {
    return new Error(payload.non_field_errors[0]);
  }

  return new Error(fallbackMessage);
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const payload = await parseResponse(response);

  if (!response.ok || payload?.success === false) {
    throw buildError(payload, `Request failed with status ${response.status}`);
  }

  return payload;
}

export async function login(id, password) {
  return request('/rest-auth/login/', {
    method: 'POST',
    body: { id, password },
  });
}

export async function logout(token) {
  return request('/rest-auth/logout/', {
    method: 'POST',
    token,
  });
}

export async function getStudentProfile(token) {
  const payload = await request('/student/profile/?view=profile', { token });
  return payload.data;
}

export async function getStudentStats(token) {
  const payload = await request('/student/profile/?view=stats', { token });
  return payload.data;
}

export async function getStudentHistory(token) {
  return request('/student/ride-history/', { token });
}

export async function topUpWallet(token, amount) {
  return request('/student/payments/?action=top-up', {
    method: 'POST',
    token,
    body: { amount },
  });
}

export async function getDriverProfile(token) {
  const payload = await request('/ecart/profile/?view=profile', { token });
  return payload.ecart;
}

export async function getDriverStats(token) {
  const payload = await request('/ecart/profile/?view=stats', { token });
  return payload.stats;
}

export async function getDriverHistory(token) {
  return request('/ecart/ride-history/', { token });
}

export async function getDriverEarnings(token) {
  return request('/ecart/earnings/', { token });
}

export async function scanStudentId(token, cardId) {
  return request('/ecart/student-ops/?action=scan-id', {
    method: 'POST',
    token,
    body: { card_id: cardId },
  });
}

export { BASE_URL };
