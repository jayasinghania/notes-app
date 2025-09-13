# Multi-Tenant SaaS Notes Application

This is a multi-tenant SaaS (Software as a Service) application that allows different companies (tenants) to securely manage their users and notes. It features role-based access control, subscription plan limits, and a minimal, functional frontend.

This project was built to demonstrate a robust multi-tenant architecture on the MERN stack (MongoDB, Express, React, Node.js) and is deployed on Vercel.

## Tech Stack

-   **Backend**: Node.js, Express.js, Mongoose, JWT (for authentication)
-   **Frontend**: React (with Vite), React Router, Axios
-   **Database**: MongoDB
-   **Deployment**: Vercel

---

## Multi-Tenancy Approach

For this project, the **Shared Schema with a Tenant ID Column** approach was chosen for its balance of data isolation, scalability, and ease of management.

### How It Works

1.  **Tenants Collection**: A central `tenants` collection stores information about each tenant company (e.g., Acme, Globex), including their name, slug, and subscription plan (`free` or `pro`).

2.  **Tenant ID Foreign Key**: Every data collection that contains tenant-specific information, such as the `users` and `notes` collections, includes a `tenant` field. This field stores a `mongoose.Schema.Types.ObjectId` that references a document in the `tenants` collection.

3.  **API-Level Data Isolation**: Data isolation is strictly enforced at the application level. All backend API endpoints that handle data are protected by an authentication middleware. This middleware verifies the user's JWT and attaches the user's document (including their `tenantId`) to the request object. Subsequent database queries in the controllers use this `tenantId` to scope the results.

    *For example, when a user requests their notes (`GET /api/notes`), the database query is effectively `Note.find({ tenant: req.user.tenantId })`.*

### Why This Approach?

-   **Simplicity**: It avoids the operational complexity of managing multiple databases or schemas, which can be difficult to maintain and scale.
-   **Efficiency**: A single database connection and schema are used, which is resource-efficient.
-   **Ease of Onboarding**: Adding a new tenant is as simple as creating a new document in the `tenants` collection.

This approach ensures that one tenant's data is never exposed to another, fulfilling the core requirement of strict tenant isolation.

---

## Getting Started

Follow these instructions to get a local copy up and running for development and testing.

### Prerequisites

-   Node.js (v18 or later)
-   npm
-   MongoDB (local installation or a cloud service like MongoDB Atlas)

### Installation & Setup

1.  **Clone the repository**
    ```sh
    git clone <your-repo-url>
    cd <your-repo-folder>
    ```

2.  **Setup Backend**
    ```sh
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add your environment variables:
    ```
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

3.  **Setup Frontend**
    ```sh
    cd ../client
    npm install
    ```
    Create a `.env` file in the `client` directory:
    ```
    VITE_API_URL=http://localhost:5000
    ```

4.  **Seed the Database**
    To populate the database with the mandatory test accounts, run the seeder script from the `server` directory:
    ```sh
    # from the /server directory
    node seeder/seed.js
    ```

5.  **Run the Application**
    * To run the backend, from the `/server` directory:
        ```sh
        npm run server
        ```
    * To run the frontend, open a new terminal, and from the `/client` directory:
        ```sh
        npm run dev
        ```

---

## Test Accounts

The following test accounts are available. The password for all accounts is **`password`**.

| Email               | Role   | Tenant |
| ------------------- | ------ | ------ |
| `admin@acme.test`   | Admin  | Acme   |
| `user@acme.test`    | Member | Acme   |
| `admin@globex.test` | Admin  | Globex |
| `user@globex.test`  | Member | Globex |

---

## API Endpoints

### Health

-   `GET /health`: Checks the server status.

### Authentication

-   `POST /api/users/login`: Authenticates a user and returns a JWT.

### Notes (Protected)

-   `POST /api/notes`: Create a new note.
-   `GET /api/notes`: List all notes for the current tenant.
-   `PUT /api/notes/:id`: Update a specific note.
-   `DELETE /api/notes/:id`: Delete a specific note.

### Tenants (Admin Only)

-   `POST /api/tenants/:slug/upgrade`: Upgrades a tenant's plan from 'free' to 'pro'.
