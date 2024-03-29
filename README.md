# Tours Website Readme

Welcome to the Tours Website! This web application allows users to explore and book exciting tours. The website is built using basic HTML and CSS for the frontend, while the backend is powered by Node.js with Express for server-side functionality and MongoDB for data storage.

## Table of Contents

- [Tours Website Readme](#tours-website-readme)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Usage](#usage)
  - [Project Structure](#project-structure)
  - [Dependencies](#dependencies)
  - [Contributing](#contributing)

## Features

- **Tour Listings:** Browse through a variety of tour options.
- **Booking System:** Users can easily book their desired tours.
- **User Authentication:** Secure user authentication system for booking tours.
- **Admin Panel:** Manage tours, bookings, and users through an admin interface.
- **Responsive Design:** The website is designed to work seamlessly on various devices.

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- Node.js: [Download Node.js](https://nodejs.org/)
- MongoDB: [Download MongoDB](https://www.mongodb.com/try/download/community)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/tours-website.git
   ```

2. Navigate to the project directory:

   ```bash
   cd tours-website
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up MongoDB:

   - Create a MongoDB database and obtain the connection URI.
   - Update the `config.env` file with your MongoDB connection URI.

   ```env
   MONGODB_URI=your_mongodb_connection_uri
   ```

5. Start the application:

   ```bash
   npm start
   ```

6. Postman documentation 
   - Published at : https://documenter.getpostman.com/view/31551887/2sA2xh3DW2

The application should now be running at `http://localhost:3000`.

## Usage

- Open your browser and go to `http://localhost:3000` to access the Tours Website.
- Explore available tours, register, and book your favorite tours.

## Project Structure

- **`public/`**: Contains static assets such as images, stylesheets, and client-side JavaScript.
- **`routes/`**: Backend route handlers.
- **`models/`**: MongoDB data models.
- **`controllers/`**: Business logic for handling routes.
- **`app.js`**: Entry point for the application.

## Dependencies

- **Express:** Web application framework for Node.js.
- **MongoDB:** NoSQL database for data storage.
- **Mongoose:** MongoDB object modeling for Node.js.
## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.Also, this project is still in progress,I have to implement many features yet. 
