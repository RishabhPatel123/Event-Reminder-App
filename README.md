# Event Reminder App

This is a full-stack web application that allows users to create and manage events, and receive push notifications as reminders.

## Features

- **User Authentication:** Secure user registration and login using Firebase Authentication.
- **Event Management:** Users can create, view, and manage their events.
- **Push Notifications:** Get real-time reminders for upcoming events 30 minutes before they start.
- **Public Event View:** A public page showcasing upcoming events.
- **Automated Status Updates:** Events are automatically marked as "Completed" after the event time.

## Tech Stack

**Frontend:**
- React
- Vite
- Chakra UI
- Axios
- Firebase
- React Router

**Backend:**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Firebase Admin
- Web Push
- Node Cron

## Getting Started

### Prerequisites

- Node.js and npm installed
- MongoDB instance (local or cloud)
- Firebase project

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/event-reminder-app.git
   cd event-reminder-app
   ```

2. **Install server dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

4. **Set up environment variables:**
   - In the `server` directory, create a `.env` file with the following:
     ```
     MONGO_URI=your_mongodb_connection_string
     PORT=8080
     VAPID_PUBLIC_KEY=your_vapid_public_key
     VAPID_PRIVATE_KEY=your_vapid_private_key
     ```
   - You will also need to add your `serviceAccountKey.json` from your Firebase project to the `server` directory.

5. **Start the servers:**
   - **Backend:**
     ```bash
     cd server
     npm start
     ```
   - **Frontend:**
     ```bash
     cd ../client
     npm run dev
     ```

## API Endpoints

### Events

- `POST /api/events`: Create a new event.
- `GET /api/events`: Get all events for the logged-in user.
- `GET /api/events/public`: Get all upcoming public events.

### Push Subscriptions

- `POST /api/subscribe`: Create or update a push notification subscription.

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
