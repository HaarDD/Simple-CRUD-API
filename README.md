# CRUD API Project

The project is a CRUD API for user management, working with an in-memory database.

## Stack

- Node.js (v22.x.x)
- TypeScript
- In-memory database
- Jest testing
- Cluster API for goreizontal clustering

## Install & config

### 1. Clone repository & switch branch

Start the console in the project folder and type

```bash
git clone https://github.com/HaarDD/Simple-CRUD-API.git
git switch dev
```

### 2. Install dependencies

Start the console in the project folder and type

```bash
npm install
```

### 3. Create .env

Create an `.env` file based on `.env.example` in the root of the project

### 4. Running Modes

**Development mode:**

- Single process (with hot reloading):
  
  ```bash
  npm run start:dev
  ```
  
- Cluster mode (with hot reloading):

  ```bash
  npm run start:multidev
  ```

**Production Mode:**

- Single process:

  ```bash
  npm run start:prod
  ```

- Cluster mode:

  ```bash
  npm run start:multi
  ```
  
### 5. Horizontal Scaling (Cluster Mode)

The cluster mode is used to handle requests across multiple processes.

- In development mode, the cluster is launched with hot reloading.
- In production mode, the cluster is used for scaling and improving performance.

The cluster mode implements load balancing using the Round-robin algorithm. For example, if `PORT=4000`, the cluster will distribute requests across the following addresses:

- `localhost:4001`
- `localhost:4002`
- `localhost:4003`, and so on.
