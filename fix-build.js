#!/usr/bin/env node

import { execSync } from 'child_process';
import { existsSync } from 'fs';

console.log('🔧 修复构建配置...\n');

try {
  // 清理构建目录
  console.log('🧹 清理构建目录...');
  if (existsSync('build')) {
    execSync('rm -rf build', { stdio: 'inherit' });
  }
  
  // 清理 node_modules/.vite
  if (existsSync('node_modules/.vite')) {
    execSync('rm -rf node_modules/.vite', { stdio: 'inherit' });
  }
  
  // 清理 .svelte-kit
  if (existsSync('.svelte-kit')) {
    execSync('rm -rf .svelte-kit', { stdio: 'inherit' });
  }
  
  // 重新安装依赖
  console.log('📦 重新安装依赖...');
  execSync('npm install', { stdio: 'inherit' });
  
  // 同步 SvelteKit
  console.log('🔄 同步 SvelteKit...');
  execSync('npm run sync', { stdio: 'inherit' });
  
  // 构建项目
  console.log('🏗️  构建项目...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 测试路由
  console.log('🧪 测试路由配置...');
  execSync('npm run test:routes', { stdio: 'inherit' });
  
  console.log('\n✅ 构建修复完成！');
  console.log('\n📝 下一步:');
  console.log('1. 重新部署到 Cloudflare Pages');
  console.log('2. 清除浏览器缓存');
  console.log('3. 测试网站功能');
  
} catch (error) {
  console.error('\n❌ 构建修复失败:', error.message);
  process.exit(1);
} 