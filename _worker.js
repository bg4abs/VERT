export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 静态资源直接返回
    if (url.pathname.startsWith('/_app/') || 
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|json|woff2|svg)$/)) {
      try {
        const response = await env.ASSETS.fetch(request);
        if (response.status === 404) {
          // 如果资源不存在，返回200.html
          return env.ASSETS.fetch(`${url.origin}/200.html`);
        }
        return response;
      } catch (error) {
        // 如果获取资源失败，返回200.html
        return env.ASSETS.fetch(`${url.origin}/200.html`);
      }
    }

    // API 请求直接返回404
    if (url.pathname.startsWith('/api/') || 
        url.pathname.startsWith('/cdn-cgi/')) {
      return new Response('Not Found', { 
        status: 404,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }

    // 其他所有请求返回200.html
    try {
      const response = await env.ASSETS.fetch(`${url.origin}/200.html`);
      return new Response(response.body, {
        ...response,
        headers: {
          ...response.headers,
          'Content-Type': 'text/html;charset=UTF-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
    } catch (error) {
      return new Response('Internal Server Error', { 
        status: 500,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
  }
}; 