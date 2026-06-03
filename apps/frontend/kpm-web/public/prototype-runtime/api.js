(function () {
  function resolveApiBase() {
    if (window.KPM_API_BASE) return String(window.KPM_API_BASE).replace(/\/$/, '');
    const origin = window.location.origin || '';
    const port = window.location.port || '';
    if (origin.includes('127.0.0.1:8080') || origin.includes('localhost:8080')) return '';
    if (/^517\d$/.test(port)) return '';
    return 'http://127.0.0.1:8080';
  }

  function toApiUrl(url) {
    if (/^https?:\/\//i.test(url)) return url;
    return `${resolveApiBase()}${url.startsWith('/') ? url : `/${url}`}`;
  }

  window.createKpmApi = function createKpmApi(currentUserGetter) {
    return {
      authHeaders() {
        const token = localStorage.getItem('kpm.authToken');
        return token ? { Authorization: `Bearer ${token}` } : {};
      },
      async request(url, options = {}) {
        const apiUrl = toApiUrl(url);
        window.__kpmApiLog ||= [];
        window.__kpmApiLog.push({ method: options.method || 'GET', url: apiUrl, at: new Date().toISOString() });
        const response = await fetch(apiUrl, {
          headers: { 'Content-Type': 'application/json', ...this.authHeaders(), ...(options.headers || {}) },
          ...options,
        });
        if (!response.ok) throw new Error(`${options.method || 'GET'} ${apiUrl} failed: ${response.status}`);
        const payload = await response.json();
        if (payload && payload.success === false) throw new Error(payload.message || payload.code || 'API request failed');
        return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
      },
      get(url) { return this.request(url); },
      post(url, body) { return this.request(url, { method: 'POST', body: JSON.stringify(body || {}) }); },
      put(url, body) { return this.request(url, { method: 'PUT', body: JSON.stringify(body || {}) }); },
      delete(url) { return this.request(url, { method: 'DELETE' }); },
      async uploadFile(file, category, businessId, uploader = currentUserGetter()) {
        const apiUrl = toApiUrl('/api/files/upload');
        window.__kpmApiLog ||= [];
        window.__kpmApiLog.push({ method: 'POST', url: apiUrl, category, at: new Date().toISOString() });
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        if (businessId) formData.append('businessId', businessId);
        formData.append('uploader', uploader);
        const response = await fetch(apiUrl, { method: 'POST', headers: this.authHeaders(), body: formData });
        if (!response.ok) throw new Error(`POST ${apiUrl} failed: ${response.status}`);
        const payload = await response.json();
        if (payload && payload.success === false) throw new Error(payload.message || payload.code || 'OSS upload failed');
        return payload && Object.prototype.hasOwnProperty.call(payload, 'data') ? payload.data : payload;
      },
      async downloadUrl(objectKey, fileName = '') {
        const query = new URLSearchParams({ objectKey });
        if (fileName) query.set('fileName', fileName);
        return this.get(`/api/files/download-url?${query.toString()}`);
      },
    };
  };
}());
