/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'GolosText-Bold': ['GolosText-Bold'],
        'GolosText-Regular': ['GolosText-Regular'],
        'GolosText-Medium': ['GolosText-Medium'],
        'GolosText-Black': ['GolosText-Black'],
        'GolosText-ExtraBold': ['GolosText-ExtraBold'],
        'GolosText-SemiBold': ['GolosText-SemiBold'],
      },
      colors: {
        whiteBack: '#ffffff',
        interface: '#f5f5f5',
        darkBlue: '#111E23',
        textInput: '#E7E6E6'
      }
    },
  },
  plugins: [],
}