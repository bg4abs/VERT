export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // 如果请求的是静态资源，直接返回
    if (url.pathname.startsWith('/_app/') || 
        url.pathname.endsWith('.png') || 
        url.pathname.endsWith('.ico') || 
        url.pathname.endsWith('.json')) {
      return env.ASSETS.fetch(request);
    }

    // 否则返回200.html
    return env.ASSETS.fetch(`${url.origin}/200.html`);
  }
}; 