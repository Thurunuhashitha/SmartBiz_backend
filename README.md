# SmartBiz Backend API

The backend for SmartBiz is a RESTful API built with Node.js and Express, serving as the central logic and data management hub for the business management system.

## Technologies Used
- **Node.js**: JavaScript runtime.
- **Express.js**: Web framework for building APIs.
- **MySQL**: Relational database for persistent storage.
- **JWT (JsonWebToken)**: For secure user authentication.
- **Bcrypt**: For password hashing.
- **OpenAI API**: Powering AI-driven business insights.
- **Cors**: Enabling secure cross-origin requests from the frontend.

## Folder Structure
- `controller/`: Contains the logic for handling API requests (e.g., [authController.js](file:///d:/Runing Projects/SmartBiz/SmartBiz_backend/controller/authController.js)).
- `db/`: Database connection and configuration (e.g., [db-connection.js](file:///d:/Runing Projects/SmartBiz/SmartBiz_backend/db/db-connection.js)).
- `middleware/`: Custom middleware for authentication and validation.
- `routes/`: Express route definitions (e.g., [authRoutes.js](file:///d:/Runing Projects/SmartBiz/SmartBiz_backend/routes/authRoutes.js)).
- `services/`: External service integrations like OpenAI ([aiService.js](file:///d:/Runing Projects/SmartBiz/SmartBiz_backend/services/aiService.js)).
- `uploads/`: Directory for file uploads.

## API Endpoints
- `/auth`: User registration, login, and session management.
- `/product`: Inventory and item management.
- `/customer`: Customer transactions and CRM.
- `/supplier`: Procurement and supplier relations.
- `/expense`: Business expense tracking.
- `/ai`: AI-powered reports and insights.
- `/admin`: Administrative controls.

## Database Schema
The database (`smartBiznew`) includes the following tables:
- `company`: Enterprise profiles.
- `customers`: Sales and customer data.
- `suppliers`: Purchase orders and supplier data.
- `expenses`: Financial outflows.
- `products`: Master inventory list.

### Automated Logic
The system uses MySQL **Triggers** to ensure data integrity:
- `after_supplier_insert`: Automatically increases stock when a supplier purchase is recorded.
- `after_customer_insert`: Automatically decreases stock when a sale is recorded.

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure `.env`:
   Create a `.env` file with your DB credentials and OpenAI API key.
3. Start the server:
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:3000` by default.
