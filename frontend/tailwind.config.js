/** @type {import('tailwindcss').Config} */
export default {
    darkMode: "class",
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                "primary": "#002452",
                "secondary": "#006a63",
                "tertiary": "#372000",
                "background": "#faf9fe",
                "surface": "#ffffff",
                "on-surface": "#1a1b1f",
                "outline": "#747780"
            },
            fontFamily: {
                "headline": ["Manrope"],
                "body": ["Plus Jakarta Sans"]
            },
            borderRadius: { "3xl": "1.5rem", "4xl": "2rem" },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/container-queries'),
    ],
}
