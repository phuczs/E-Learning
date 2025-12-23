import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            includeAssets: ['favicon.ico', '*.png', '*.svg'],
            manifest: {
                name: 'AI Study Assistant',
                short_name: 'StudyAI',
                description: 'AI-powered learning platform with flashcards, quizzes, and smart study tracking',
                theme_color: '#6366f1',
                background_color: '#0f172a',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [
                    {
                        src: '/icon-192x192.svg',
                        sizes: '192x192',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    },
                    {
                        src: '/icon-512x512.svg',
                        sizes: '512x512',
                        type: 'image/svg+xml',
                        purpose: 'any maskable'
                    }
                ]
            },
            workbox: {
                globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
                runtimeCaching: [
                    {
                        urlPattern: /^http:\/\/localhost:5000\/api\/lectures.*/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'lectures-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^http:\/\/localhost:5000\/api\/flashcards.*/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'flashcards-cache',
                            expiration: {
                                maxEntries: 100,
                                maxAgeSeconds: 60 * 60 * 24 * 7
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^http:\/\/localhost:5000\/api\/quizzes.*/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'quizzes-cache',
                            expiration: {
                                maxEntries: 50,
                                maxAgeSeconds: 60 * 60 * 24 * 7
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    },
                    {
                        urlPattern: /^http:\/\/localhost:5000\/api\/progress.*/,
                        handler: 'NetworkFirst',
                        options: {
                            cacheName: 'progress-cache',
                            expiration: {
                                maxEntries: 20,
                                maxAgeSeconds: 60 * 60 * 24 // 1 day
                            },
                            cacheableResponse: {
                                statuses: [0, 200]
                            }
                        }
                    }
                ]
            },
            devOptions: {
                enabled: true
            }
        })
    ],
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true
            }
        }
    }
})
