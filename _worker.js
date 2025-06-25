export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 让 Cloudflare 内部服务请求通过
    if (url.pathname.startsWith('/cdn-cgi/')) {
      return env.ASSETS.fetch(request);
    }
    
    // 处理所有静态资源 - 更精确的匹配
    if (
      // SvelteKit 应用资源
      url.pathname.startsWith('/_app/') ||
      // 静态文件扩展名
      url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg|webp|json|woff|woff2|ttf|eot)$/) ||
      // 特定静态文件
      url.pathname === '/favicon.ico' ||
      url.pathname === '/manifest.json' ||
      url.pathname === '/200.html'
    ) {
      return env.ASSETS.fetch(request);
    }

    // API 请求返回404
    if (url.pathname.startsWith('/api/')) {
      return new Response('Not Found', { status: 404 });
    }

    // 其他所有请求返回 SPA 入口文件
    try {
      const response = await env.ASSETS.fetch(`${url.origin}/200.html`);
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
          ...Object.fromEntries(response.headers),
          'Content-Type': 'text/html;charset=UTF-8'
        }
      });
    } catch (error) {
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};