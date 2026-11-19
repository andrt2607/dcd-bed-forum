import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    fileParallelism: false,
    setupFiles: ['dotenv/config'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.js'],
      exclude: [
        'src/app.js',
        'src/Commons/config.js',
        'src/Infrastructures/container.js',
        'src/Infrastructures/database/postgres/pool.js',
        'src/**/_test/**',
      ],
    },
  },
});
