/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                dockaudit: {
                    900: '#0F172A',
                    800: '#1E293B',
                    bg: '#0B0F19'
                }
            }
        },
    },
    plugins: [],
}
