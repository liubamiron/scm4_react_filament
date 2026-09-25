import base from './vite.config'
export default {
  ...base,
  server: { port: 5199, proxy: {
    '/api': { target: 'https://scm4.md', changeOrigin: true },
    '/storage': { target: 'https://scm4.md', changeOrigin: true },
  } },
}
