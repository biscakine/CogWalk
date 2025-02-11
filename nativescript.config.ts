import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.app',
  appPath: 'app',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  webpackConfigPath: 'webpack.config.js',
  useLibs: true,
  preview: {
    // Disable service worker in preview mode
    serviceWorker: false,
    hmr: false
  }
} as NativeScriptConfig;