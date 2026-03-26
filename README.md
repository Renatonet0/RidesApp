# RidesApp

![RidesApp Screenshot](./assets/mockup.png)

<p align="center">
  <img src="./assets/1.png" width="30%"/>
  <img src="./assets/2.png" width="30%"/>
  <img src="./assets/3.png" width="30%"/>
</p>

RidesApp is a modern mobile application built with Expo, designed to connect users for ride-sharing or ride-booking services. Whether you're looking to offer a ride or find one, RidesApp provides a seamless platform for managing trips, connecting with other users, and ensuring smooth transportation experiences.

## ✨ Key Features & Benefits

RidesApp offers a robust set of features to enhance your ride-sharing experience:

*   **User Authentication:** Secure sign-in and sign-up processes to manage user accounts.
*   **Ride Creation & Management:** Easily create and offer rides, specifying details like destination, time, and available seats.
*   **Ride Discovery:** Browse available rides, filter by criteria, and find suitable options quickly.
*   **Real-time Communication:** Integrated chat functionality (`ChatScreen.jsx`) to connect with ride partners or drivers.
*   **User Profiles:** Personalized profiles (`profile.jsx`, `profileGuest.jsx`) to showcase user information and ratings.
*   **Account Management:** Options to update user information and account settings (`accountChange/acount.jsx`, `accountChange/acountSignUp.jsx`).
*   **Responsive UI:** A fluid and intuitive user interface optimized for mobile devices, powered by NativeWind for styling.

## 🛠️ Prerequisites & Dependencies

Before you begin, ensure you have the following installed on your system:

*   **Node.js**: [LTS version recommended](https://nodejs.org/en/download/)
*   **npm** or **Yarn**: Node.js package managers (npm usually comes with Node.js)
*   **Expo CLI**: While not strictly required for running, `npx expo` commands will be used. Install globally if you prefer: `npm install -g expo-cli`

## 🚀 Installation & Setup Instructions

Follow these steps to get RidesApp up and running on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Renatonet0/RidesApp.git
    cd RidesApp
    ```

2.  **Install project dependencies:**
    ```bash
    npm install
    # or if you use Yarn
    # yarn install
    ```

3.  **Start the Expo development server:**
    ```bash
    npx expo start
    ```

    This command will open a new browser tab with the Expo Dev Tools. You'll see options to:
    *   **Run on Android:** Open the app in an Android emulator or on a physical device using the Expo Go app.
    *   **Run on iOS:** Open the app in an iOS simulator or on a physical device using the Expo Go app.
    *   **Run in web browser:** Preview the app in your browser (may not fully reflect mobile behavior).

    **Note:** For the best experience, download the [Expo Go app](https://expo.dev/client) on your mobile device and scan the QR code displayed in the Expo Dev Tools to open the app directly on your phone.

## 📱 Usage

Once the app is running:

1.  **Sign Up / Sign In:** Navigate through the authentication flow (handled by the `(auth)` directory) to create a new account or log in with existing credentials.
2.  **Create a Ride:** Use the "Create Ride" tab (`createRide.jsx`) to input details for a new ride you want to offer or list.
3.  **Browse Rides:** Explore available rides listed by other users via the "Rides" tab (`rides.jsx`).
4.  **Manage Profile:** Update your personal information, view your ride history, or change account settings in the "Profile" tab (`profile.jsx`).
5.  **Chat:** Engage in real-time conversations with other users related to rides through the chat interface (`ChatScreen.jsx`).

While this repository primarily focuses on the client-side mobile application, any backend API documentation would typically be found in a separate repository or dedicated documentation files if applicable.

## ⚙️ Configuration

### Babel & NativeWind
The project uses [NativeWind](https://www.nativewind.dev/) for styling, combining Tailwind CSS with React Native. The `babel.config.js` file is configured to integrate NativeWind:

```javascript
module.exports = function(api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel"
    ],
  };
};
```
This setup allows you to use Tailwind CSS classes directly within your JSX components, with styles defined in `app/global.css`.

### Environment Variables
For production deployments or sensitive information (e.g., API keys for a backend service, map providers, etc.), you would typically use environment variables. Create a `.env` file in the root directory (and ensure it's in `.gitignore`):

```
# Example environment variables
EXPO_PUBLIC_API_URL=https://your-backend-api.com
# EXPO_PUBLIC_MAPBOX_TOKEN=your_mapbox_public_token
```
Access these variables in your Expo app using `process.env.EXPO_PUBLIC_YOUR_VARIABLE_NAME`.

## 🤝 Contributing

We welcome contributions to RidesApp! If you're interested in improving the app, please follow these steps:

1.  **Fork** the repository on GitHub.
2.  **Clone** your forked repository to your local machine.
3.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name` or `git checkout -b bugfix/issue-description`.
4.  **Make your changes** and commit them with a clear, concise message.
5.  **Push** your changes to your fork.
6.  **Open a Pull Request** to the `main` branch of the original repository, describing your changes in detail.

Please ensure your code adheres to the project's coding style and passes any existing tests.

## ⚖️ License

This project currently does not have a specified license. This means all rights are reserved by the copyright holder (Renatonet0).

It is highly recommended to choose and add a license to clarify how others can use, modify, and distribute your project. Popular choices include MIT, Apache 2.0, or GPLv3.

## 🙏 Acknowledgments

*   Built with [Expo](https://expo.dev) for a seamless mobile development experience.
*   Styled with [NativeWind](https://www.nativewind.dev/) for utility-first CSS in React Native.
*   Icons and assets managed within the project's `constants/icons.js`.
