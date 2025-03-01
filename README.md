# Absensi

This project consists of two main parts: a backend built with Express.js and a frontend built with Vue.js. Follow the instructions below to set up and run both parts.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

---

## Backend Setup (Express.js)

### Prerequisites
- Node.js (>=14.x recommended)
- npm (comes with Node.js)

### Installation
Navigate to the `backend` folder and install dependencies:

```sh
cd backend
npm install
```

### Running the Backend
To start the backend server using Nodemon:

```sh
nodemon server.js
```

By default, the backend will run on `http://localhost:5000/` (or another port if specified in the environment variables).

---

## Frontend Setup (Vue.js)

### Prerequisites
- Node.js (>=14.x recommended)
- npm (comes with Node.js)

### Installation
Navigate to the `frontend` folder and install dependencies:

```sh
cd frontend
npm install
```

### Running the Frontend
To start the development server:

```sh
npm run dev
```

By default, the frontend will run on `http://localhost:5173/` (or another port if specified in the environment variables).

---

## Running the Full Project
1. Open two terminal windows.
2. In the first terminal, navigate to the `backend` folder and run:
   ```sh
   nodemon server.js
   ```
3. In the second terminal, navigate to the `frontend` folder and run:
   ```sh
   npm run dev
   ```
4. Ensure the backend is running before interacting with the frontend.

Now, you can access the frontend at `http://localhost:5173/` and it should communicate with the backend at `http://localhost:5000/`.

---

## Customize Configuration
See [Vite Configuration Reference](https://vite.dev/config/) for frontend configuration.

For backend configuration, modify the `.env` file or update the server settings in the Express.js application.

---

## Building for Production

### Backend
If you need to deploy the backend, ensure you install production dependencies and use a process manager like PM2:
```sh
npm install --production
pm install -g pm2
pm start
```

### Frontend
To build the frontend for production:
```sh
npm run build
```
This will generate optimized static files in the `dist` folder.

---

## Additional Notes
- Ensure that any required environment variables are set in a `.env` file for both frontend and backend.
- If you are using a database, make sure it is properly set up and connected.
- Update CORS settings in the backend if needed to allow frontend communication.

Happy coding! 🎉