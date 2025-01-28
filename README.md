# Car Managment Backend

This is the backend for a Car Managment application, built using Node.js, Express.js, and MongoDB. It provides authentication, category, car, user, and dashboard functionalities.

## Project Structure

```
CAR-MANAGMENT-BACKEND/
│── helper/
│   ├── auth.js
│   ├── init_mongodb.js
│   ├── sendEmail.js
│   ├── userDashboardPipeline.js
│── node_modules/
│── src/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── carController.js
│   │   ├── categoryController.js
│   │   ├── dashboardController.js
│   │   ├── userController.js
│   ├── models/
│   │   ├── carModel.js
│   │   ├── categoryModel.js
│   │   ├── userModel.js
│   ├── routes/
│   │   ├── authRouter.js
│   │   ├── carRouter.js
│   │   ├── categoryRouter.js
│   │   ├── dashboardRouter.js
│   │   ├── userRouter.js
│── .env
│── .gitignore
│── app.js
│── docker-compose.yml
│── Dockerfile
│── package.json
```

## Features

- Authentication (JWT based)
- User management
- Car management
- Category management
- Dashboard APIs
- MongoDB integration
- Secure API with rate limiting and helmet

## Prerequisites

Ensure you have the following installed:

- Node.js (v16+ recommended)
- MongoDB
- Docker (optional for containerization)

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd mern-backend
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following variables:

   ```sh
   PORT=3000
   MONGO_URI=<your-mongodb-connection-string>
   JWT_SECRET=<your-jwt-secret>
   ```

4. Start the server:
   ```sh
   npm start
   ```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Reset password

### Users

- `GET /api/user/get-profile` - Get user profile
- `PATCH /api/user/update-profile` - Update user profile

### Categories

- `POST /api/category/create-category` - Create a new category
- `GET /api/category/get-all-category` - Get all categories
- `GET /api/category/get-category-by-id/:id` - Get category by ID
- `PATCH /api/category/update-category/:id` - Update category
- `DELETE /api/category/delete-category/:id` - Delete category

### Cars

- `POST /api/car/add-car` - Add a new car
- `GET /api/car/get-all-cars` - Get all cars
- `GET /api/car/get-car-by-id/:id` - Get car details by ID
- `PATCH /api/car/update-car/:id` - Update car details
- `DELETE /api/car/delete-car/:id` - Delete car

### Dashboard

- `GET /api/dashboard/get-admin-dashboard` - Get admin dashboard details
- `GET /api/dashboard/get-user-dashboard` - Get user dashboard details

## Deployment

The backend is deployed and accessible at:

```
https://carmanagment.duckdns.org/api/auth/login
```

## Running with Docker

1. Build the Docker image:
   ```sh
   docker build -t <name> .
   ```
2. Run the container:
   ```sh
   docker run -p 3000:3000 --env-file .env <name>
   ```

## Postman Collection

A Postman collection is provided for testing API endpoints. Import the `Test Project.postman_collection.json` into Postman to test the APIs.
