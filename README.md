# STREVO E-Commerce Application

A full-stack fashion e-commerce web application inspired by premium brands. Built with HTML/CSS/JS for the frontend and Java Spring Boot for the backend.

## Architecture
- **Frontend:** Pure HTML5, CSS3 (Vanilla), JavaScript (ES6+). Communicates with backend via Fetch API.
- **Backend:** Java Spring Boot, Spring Security (JWT), Spring Data JPA.
- **Database:** Supabase PostgreSQL.

## Prerequisites
1. Java 17 or higher
2. Maven
3. A Supabase account and a PostgreSQL database url.

## Setup Instructions

### 1. Database Configuration
1. Rename `.env.example` to `.env` or set these environment variables directly on your machine:
   ```
   SUPABASE_DB_URL=jdbc:postgresql://<your-supabase-host>:5432/postgres
   SUPABASE_DB_USER=postgres
   SUPABASE_DB_PASSWORD=<your-db-password>
   ```

### 2. Run the Backend
1. Open terminal and navigate to the `backend/` directory.
2. Build the project:
   ```bash
   mvn clean install -DskipTests
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```
4. The backend will start on `http://localhost:8080`.
5. On the first run, if the database is empty, it will automatically create the tables and seed dummy products.

### 3. Run the Frontend
1. Open the `frontend/` directory.
2. You can simply open `index.html` in your web browser. For a better experience, run a local live server (e.g., VSCode Live Server or `npx serve`) in the `frontend` directory.
3. Make sure the backend is running so the frontend can fetch products and handle authentication.

## Features implemented
- User Registration and Login with JWT
- Premium responsive UI
- View products, filtered by category/gender
- Add items to cart
- View cart summary
- Place order
