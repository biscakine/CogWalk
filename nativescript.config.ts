import { NativeScriptConfig } from '@nativescript/core';

export default {
  id: 'org.nativescript.app',
  appPath: 'app',
  appResourcesPath: '../../tools/assets/App_Resources',
  android: {
    compileSdk: 33,   // ← NOUVEAU
    minSdk: 21,       // (ou 22 si vous préférez)
    targetSdk: 33,    // ← cohérent
    v8Flags: '--expose_gc',
    markingMode: 'none'
  },
  webpackConfigPath: 'webpack.config.js',
  useLibs: true,
  previewAppSchema: 'ns-preview',
  preview: { port: 3000 }
} as NativeScriptConfig;
