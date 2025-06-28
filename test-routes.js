#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, existsSync, readFileSync } from 'fs';
import { join } from 'path';

console.log('🔍 测试路由配置...\n');

try {
  // 检查构建目录
  if (!existsSync('build')) {
    console.log('📁 构建目录不存在，请先运行 npm run build');
    process.exit(1);
  }

  const buildDir = readdirSync('build');
  console.log('构建目录内容:', buildDir);

  // 检查关键文件
  const criticalFiles = ['200.html', '_app', 'assets'];
  for (const file of criticalFiles) {
    if (existsSync(join('build', file))) {
      console.log(`✅ ${file} 存在`);
    } else {
      console.log(`❌ ${file} 不存在`);
    }
  }

  // 检查 200.html 内容
  if (existsSync('build/200.html')) {
    const content = readFileSync('build/200.html', 'utf8');
    if (content.includes('<!DOCTYPE html>')) {
      console.log('✅ 200.html 包含正确的 HTML 结构');
    } else {
      console.log('❌ 200.html 内容不正确');
    }
  }

  // 检查 _app 目录结构
  if (existsSync('build/_app')) {
    const appDir = readdirSync('build/_app');
    console.log('_app 目录内容:', appDir);
    
    if (existsSync('build/_app/immutable')) {
      const immutableDir = readdirSync('build/_app/immutable');
      console.log('_app/immutable 目录内容:', immutableDir.slice(0, 5), '...');
    }
  }

  // 检查 assets 目录
  if (existsSync('build/assets')) {
    const assetsDir = readdirSync('build/assets');
    console.log('assets 目录内容:', assetsDir.slice(0, 5), '...');
  }

  console.log('\n✅ 路由配置测试完成！');
  console.log('\n📝 建议:');
  console.log('1. 确保 Cloudflare Pages 的构建命令是: npm run build');
  console.log('2. 确保构建输出目录是: build');
  console.log('3. 确保根目录包含: 200.html');
  
} catch (error) {
  console.error('\n❌ 路由配置测试失败:', error.message);
  process.exit(1);
} 