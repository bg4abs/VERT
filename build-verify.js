#!/usr/bin/env node

import { execSync } from 'child_process';
import { readdirSync, existsSync } from 'fs';
import { join } from 'path';

console.log('🔍 验证构建配置...\n');

try {
  // 清理之前的构建
  console.log('🧹 清理之前的构建...');
  execSync('rm -rf build', { stdio: 'inherit' });
  
  // 执行构建
  console.log('🏗️  开始构建...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 检查构建结果
  console.log('\n📁 检查构建结果...');
  
  if (!existsSync('build')) {
    throw new Error('构建目录不存在');
  }
  
  const buildDir = readdirSync('build');
  console.log('构建目录内容:', buildDir);
  
  // 检查 assets 目录
  if (existsSync('build/assets')) {
    const assetsDir = readdirSync('build/assets');
    console.log('\n📦 Assets 目录内容:', assetsDir);
    
    // 检查是否有带 hash 的文件
    const hashedFiles = assetsDir.filter(file => file.includes('-'));
    console.log('带 hash 的文件数量:', hashedFiles.length);
    
    if (hashedFiles.length === 0) {
      console.warn('⚠️  警告: 没有找到带 hash 的文件');
    } else {
      console.log('✅ 找到带 hash 的文件');
    }
  }
  
  // 检查 _app 目录
  if (existsSync('build/_app')) {
    const appDir = readdirSync('build/_app');
    console.log('\n📱 _app 目录内容:', appDir);
  }
  
  console.log('\n✅ 构建验证完成！');
  
} catch (error) {
  console.error('\n❌ 构建验证失败:', error.message);
  process.exit(1);
} 