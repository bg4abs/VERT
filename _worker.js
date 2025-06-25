export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 静态资源直接返回
    if (url.pathname.startsWith('/_app/') || 
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|json|woff2)$/)) {
      return env.ASSETS.fetch(request);
    }

    // API 请求直接返回404
    if (url.pathname.startsWith('/api/') || 
        url.pathname.startsWith('/cdn-cgi/')) {
      return new Response('Not Found', { status: 404 });
    }

    // 其他所有请求返回200.html
    const response = await env.ASSETS.fetch(`${url.origin}/200.html`);
    return new Response(response.body, {
      ...response,
      headers: {
        ...response.headers,
        'Content-Type': 'text/html;charset=UTF-8'
      }
    });
  }
}; 