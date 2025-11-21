# Event Reminder App

This is a full-stack web application that allows users to create and manage events, and receive push notifications as reminders.

---

## 🚀 Live Demo Links

* **Frontend (Vercel):** https://event-reminder-app-kappa.vercel.app
* **Backend (Render):** https://event-reminder-jpzw.onrender.com

---

## ✨ Features

* **User Authentication:** Secure user registration and login using Firebase Authentication.
* **Event Management:** Users can create, view, and manage their events (with image uploads).
* **Push Notifications:** Get real-time reminders for upcoming events 30 minutes before they start.
* **Public Event View:** A public home page showcasing upcoming events with a "beautiful" gradient, animations, and widgets.
* **Automated Status Updates:** Events are automatically marked as "Completed" after the event time.
* **Dashboard:** Includes event totals (total, active, completed) and filters.
* **Micro-interactions:** Smooth animations for event creation forms and card hovers.

---

## 🛠 Tech Stack

**Frontend:**
* **React (Vite):** A fast, modern library for building user interfaces.
* **React Router:** For all client-side routing.
* **Chakra UI:** For a clean, beautiful, and accessible component library.
* **Framer Motion:** Used for all micro-interactions and page animations.
* **Axios:** For making requests to the backend API.
* **Firebase:** For client-side authentication.

**Backend:**
* **Node.js:** JavaScript runtime for the server.
* **Express:** A minimal and flexible web framework for building the API.
* **MongoDB (Atlas):** A cloud-based NoSQL database to store user and event data.
* **Mongoose:** An object data modeling (ODM) library for MongoDB and Node.js.
* **Firebase Admin SDK:** Used by the backend to verify user tokens and secure API routes.
* **Web Push (`web-push`):** For sending push notifications.
* **`node-cron`:** A task scheduler used to check for upcoming events and send reminders.

---

## 🏃‍♂️ Getting Started

### Prerequisites

* Node.js (v18 or later)
* npm
* A free MongoDB Atlas account
* A free Firebase project

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/your-username/event-reminder-app.git](https://github.com/your-username/event-reminder-app.git)
    cd event-reminder-app
    ```

2.  **Install server dependencies:**
    ```bash
    cd server
    npm install
    ```

3.  **Install client dependencies:**
    ```bash
    cd ../client
    npm install
    ```

4.  **Set up environment variables:**

    * In the **`/server`** directory, create a `.env` file with the following:
        ```.env
        # Your MongoDB Atlas connection string
        MONGO_URI=your_mongodb_connection_string
        
        # Your VAPID keys (generate with 'npx web-push generate-vapid-keys')
        VAPID_PUBLIC_KEY=...
        VAPID_PRIVATE_KEY=...
        VAPID_EMAIL=your-email@example.com
        ```
    * You will also need to add your `serviceAccountKey.json` from your Firebase project to the `/server` directory.

    * In the **`/client`** directory, create a `.env` file with the following:
        ```.env
        # Your Firebase client config keys
        VITE_FIREBASE_API_KEY=...
        VITE_FIREBASE_AUTH_DOMAIN=...
        VITE_FIREBASE_PROJECT_ID=...
        VITE_FIREBASE_STORAGE_BUCKET=...
        VITE_FIREBASE_MESSAGING_SENDER_ID=...
        VITE_FIREBASE_APP_ID=...

        # Your VAPID public key (must match the server)
        VITE_VAPID_PUBLIC_KEY=...

        # Your OpenWeatherMap API key
        VITE_OPENWEATHER_API_KEY=...

        # The URL for your local backend server
        VITE_API_URL=http://localhost:8080
        ```

5.  **Start the servers:**
    * **Backend:**
        ```bash
        cd server
        npm start
        ```
    * **Frontend (in a new terminal):**
        ```bash
        cd client
        npm run dev
        ```

---

## ☁️ Deployment

This project is deployed as two separate services:

* **Backend (Node/Express):** Deployed on **Render** (free tier). The server uses the `NODE_ENV` variable to correctly locate the `serviceAccountKey.json` from Render's secret file path.
* **Frontend (React):** Deployed on **Vercel** (free tier). The "Root Directory" is set to `/client`, and the `VITE_API_URL` environment variable is set to the live Render backend URL.

---

## 💡 Design Choices

* **Project Structure:** The project is a monorepo with two distinct folders, `client` and `server`. This separation is clean, organized, and makes it easy to manage and deploy the frontend and backend independently.
* **Chakra UI:** Chosen to rapidly build a clean, beautiful, and accessible UI. Its component-based system keeps the code modular, readable, and satisfies the "beautiful UI" requirement.
* **Firebase Authentication:** Chosen over a custom JWT implementation to save time and ensure a highly secure, battle-tested authentication system right out of the box.
* **`node-cron` for Reminders:** A server-side cron job was the most reliable way to implement reminders. It runs every minute to check for upcoming events, ensuring notifications are sent even if the user does not have the app open.

---

## API Endpoints

### Events

* `POST /api/events`: Create a new event.
* `GET /api/events`: Get all events for the logged-in user.
* `GET /api/events/public`: Get all upcoming public events.

### Push Subscriptions

* `POST /api/subscribe`: Create or update a push notification subscription.


## Folder Structure

```
event-reminder-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── ...
│   ├── package.json
│   └── ...
└── server/
    ├── middleware/
    ├── models/
    ├── routes/
    ├── index.js
    ├── package.json
    └── ...
```
