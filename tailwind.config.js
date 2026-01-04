/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                fiordland: {
                    900: '#0f172a', // Slate 900
                    800: '#1e293b', // Slate 800
                    700: '#334155', // Slate 700
                    600: '#475569',
                    500: '#64748b',
                    400: '#94a3b8',
                    300: '#cbd5e1',
                    200: '#e2e8f0',
                    100: '#f1f5f9',
                    50: '#f8fafc',
                },
                primary: {
                    DEFAULT: '#0f172a',
                    foreground: '#f8fafc',
                },
                accent: {
                    DEFAULT: '#0d9488', // Teal 600
                    foreground: '#ffffff',
                }
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            }
        },
    },
    plugins: [],
}
