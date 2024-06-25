# SipBlast-SEOGenerator

Welcome to the SipBlast SEO Blog Post Generator! This application allows users to generate blog post topics and full blog posts using OpenAI's GPT models. Users can register, log in, select from different GPT models, and generate content easily.

## Table of Contents

- [Features](#features)
- [Setup](#setup)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [MongoDB Setup](#mongodb-setup)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
  - [Running the App](#running-the-app)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and login
- Generate blog post topics
- Generate full blog posts based on selected topics
- Switch between different GPT models (GPT-4o, GPT-3.5 Turbo)
- Secure authentication and API request handling

## Setup

### Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v14.x or later)
- npm (v6.x or later)
- MongoDB instance (local or hosted)

### Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/chatgpt-blog-post-generator.git
    cd chatgpt-blog-post-generator
    ```

2. **Install backend dependencies:**

    ```bash
    cd backend
    npm install
    ```

3. **Install frontend dependencies:**

    ```bash
    cd /chatgpt-frontend
    npm install
    ```

### MongoDB Setup

1. **Install MongoDB**: Follow the [official MongoDB installation guide](https://docs.mongodb.com/manual/installation/) for your operating system.

2. **Start MongoDB**:

    ```bash
    sudo systemctl start mongod
    sudo systemctl enable mongod
    ```

3. **Login to MongoDB using `mongosh`**:

    ```bash
    mongosh
    ```

4. **Switch to the admin database**:

    ```bash
    use admin
    ```

5. **Create an admin user**:

    ```javascript
    db.createUser({
      user: "admin",
      pwd: "adminpassword",
      roles: [{ role: "userAdminAnyDatabase", db: "admin" }]
    });
    ```

6. **Exit `mongosh`**:

    ```bash
    exit
    ```

7. **Enable authentication**: Edit the MongoDB configuration file (typically located at `/etc/mongod.conf`):

    ```yaml
    security:
      authorization: "enabled"
    ```

8. **Restart MongoDB**:

    ```bash
    sudo systemctl restart mongod
    ```

9. **Authenticate future sessions using admin credentials**:

    ```bash
    mongosh -u admin -p adminpassword --authenticationDatabase admin
    ```

10. **Create a database user for the application**:

    ```javascript
    use seomon
    db.createUser({
      user: "seomonUser",
      pwd: "seomonPassword",
      roles: [{ role: "readWrite", db: "seomon" }]
    });
    ```

### Environment Variables

Create a `.env` file in the `backend` directory and add the following variables:

    ```plaintext
    PORT=3001
    DB_URI=mongodb://seomonUser:seomonPassword@localhost:27017/seomon?authSource=admin
    ACCESS_TOKEN_SECRET=your_access_token_secret
    REFRESH_TOKEN_SECRET=your_refresh_token_secret
    OPENAI_API_KEY=your_openai_api_key
    ```

## Usage

### Running the App

1. **Start the backend server:**

    ```bash
    cd backend
    npm start
    ```

    The backend server will start on `http://localhost:3000`.

2. **Start the frontend server:**

    ```bash
    cd ../frontend
    npm start
    ```

    The frontend server will start on `http://localhost:3001`.

3. **Open your browser and navigate to:**

    ```plaintext
    http://localhost:3001
    ```

    You should see the SipBlast SEO Blog Post Generator application running.

## Contributing

Contributions are always welcome! Please follow these steps:

1. **Fork the repository.**
2. **Create a new branch:**

    ```bash
    git checkout -b feature-name
    ```

3. **Make your changes and commit them:**

    ```bash
    git commit -m 'Add some feature'
    ```

4. **Push to the branch:**

    ```bash
    git push origin feature-name
    ```

5. **Create a pull request.**

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

---

Feel free to reach out if you have any questions or need further assistance. Happy coding!

