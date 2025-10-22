# String Analyzer Service

A RESTful API service that analyzes strings and stores their computed properties. This service provides comprehensive string analysis including palindrome detection, character frequency mapping, word counting, and more.

## Features

- **String Analysis**: Computes length, palindrome status, unique character count, word count, SHA-256 hash, and character frequency mapping
- **RESTful API**: Full CRUD operations for string management
- **Advanced Filtering**: Query strings by various properties with both standard and natural language queries
- **MongoDB Integration**: Persistent storage with Mongoose ODM
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## API Endpoints

### 1. Create/Analyze String
- **POST** `/strings`
- Creates a new string analysis entry

### 2. Get Specific String
- **GET** `/strings/{string_value}`
- Retrieves a specific string by its value

### 3. Get All Strings with Filtering
- **GET** `/strings`
- Retrieves all strings with optional filtering parameters

### 4. Natural Language Filtering
- **GET** `/strings/filter-by-natural-language`
- Query strings using natural language

### 5. Delete String
- **DELETE** `/strings/{string_value}`
- Removes a string from the system

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 14 or higher)
- **npm** (comes with Node.js)
- **MongoDB** (running locally or access to MongoDB Atlas)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd String-Analyzer-Service
   ```

2. **Navigate to the backend directory**
   ```bash
   cd backend-app
   ```

3. **Install dependencies**
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the `backend-app` directory with the following variables:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/string-analyzer
```

### Environment Variables Explained

- **PORT**: The port number on which the server will run (default: 3000)
- **MONGO_URI**: MongoDB connection string
  - For local MongoDB: `mongodb://localhost:27017/string-analyzer`
  - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/string-analyzer`

## Running the Application

### Development Mode (with auto-restart)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

## Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^5.1.0 | Web framework for Node.js |
| `mongoose` | ^8.19.2 | MongoDB object modeling for Node.js |
| `cors` | ^2.8.5 | Enable CORS (Cross-Origin Resource Sharing) |
| `dotenv` | ^17.2.3 | Load environment variables from .env file |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `nodemon` | ^3.1.0 | Automatically restart server during development |

## API Usage Examples

### Create a String
```bash
curl -X POST http://localhost:3000/strings \
  -H "Content-Type: application/json" \
  -d '{"value": "hello world"}'
```

### Get All Strings
```bash
curl http://localhost:3000/strings
```

### Filter Strings
```bash
curl "http://localhost:3000/strings?is_palindrome=true&min_length=5"
```

### Natural Language Query
```bash
curl "http://localhost:3000/strings/filter-by-natural-language?query=all%20single%20word%20palindromic%20strings"
```

### Delete a String
```bash
curl -X DELETE http://localhost:3000/strings/hello%20world
```

## Project Structure

```
backend-app/
├── controller/
│   └── controller.js          # API route handlers
├── db/
│   └── connect.js            # Database connection
├── middleware/
│   ├── errorHandler.js       # Error handling middleware
│   └── notFound.js          # 404 handler
├── model/
│   └── model.js             # MongoDB schema
├── routes/
│   └── route.js             # API routes
├── utils/
│   └── functions.js         # Utility functions
├── app.js                   # Express app configuration
├── server.js                # Server startup
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables (create this)
```

## String Properties Analyzed

For each string, the service computes:

- **length**: Number of characters
- **is_palindrome**: Boolean indicating if string reads the same forwards and backwards (case-insensitive)
- **unique_characters**: Count of distinct characters
- **word_count**: Number of words separated by whitespace
- **sha256_hash**: SHA-256 hash for unique identification
- **character_frequency_map**: Object mapping each character to its occurrence count

## Error Handling

The API returns appropriate HTTP status codes:

- **200**: Success
- **201**: Created
- **204**: No Content (for deletions)
- **400**: Bad Request (invalid input)
- **404**: Not Found
- **409**: Conflict (string already exists)
- **422**: Unprocessable Entity (invalid data type)
- **500**: Internal Server Error

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
