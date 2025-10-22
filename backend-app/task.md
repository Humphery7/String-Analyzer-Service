
# **Backend Wizards — Stage 1 Task: Build a String Analyzer Service** 🎯

Welcome to Stage 1! Build a RESTful API service that analyzes strings and stores their computed properties.

**Explainer Video:** [link if provided]

---

## **1️⃣ What the service should do**

For each analyzed string, compute and store the following properties:

| Property                  | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `length`                  | Number of characters in the string                                                        |
| `is_palindrome`           | Boolean indicating if the string reads the same forwards and backwards (case-insensitive) |
| `unique_characters`       | Count of distinct characters in the string                                                |
| `word_count`              | Number of words separated by whitespace                                                   |
| `sha256_hash`             | SHA-256 hash of the string for unique identification                                      |
| `character_frequency_map` | Object/dictionary mapping each character to its occurrence count                          |

---

## **2️⃣ Endpoints**

### **2.1 Create / Analyze String**

**POST** `/strings`
**Request Body:**

```json
{
  "value": "string to analyze"
}
```

**Success Response (201 Created):**

```json
{
  "id": "sha256_hash_value",
  "value": "string to analyze",
  "properties": {
    "length": 17,
    "is_palindrome": false,
    "unique_characters": 12,
    "word_count": 3,
    "sha256_hash": "abc123...",
    "character_frequency_map": {
      "s": 2,
      "t": 3,
      "r": 2
    }
  },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Responses:**

* `409 Conflict`: String already exists
* `400 Bad Request`: Invalid or missing `"value"` field
* `422 Unprocessable Entity`: `"value"` is not a string

---

### **2.2 Get Specific String**

**GET** `/strings/{string_value}`

**Success Response (200 OK):**

```json
{
  "id": "sha256_hash_value",
  "value": "requested string",
  "properties": { /* same as above */ },
  "created_at": "2025-08-27T10:00:00Z"
}
```

**Error Response:**

* `404 Not Found`: String does not exist

---

### **2.3 Get All Strings with Filtering**

**GET** `/strings` with optional query parameters:

```
/strings?is_palindrome=true&min_length=5&max_length=20&word_count=2&contains_character=a
```

**Query Parameters:**

| Parameter            | Type    | Description                    |
| -------------------- | ------- | ------------------------------ |
| `is_palindrome`      | boolean | true/false                     |
| `min_length`         | integer | Minimum string length          |
| `max_length`         | integer | Maximum string length          |
| `word_count`         | integer | Exact word count               |
| `contains_character` | string  | Single character to search for |

**Success Response (200 OK):**

```json
{
  "data": [
    { "id": "hash1", "value": "string1", "properties": { /* ... */ }, "created_at": "2025-08-27T10:00:00Z" }
  ],
  "count": 15,
  "filters_applied": {
    "is_palindrome": true,
    "min_length": 5,
    "max_length": 20,
    "word_count": 2,
    "contains_character": "a"
  }
}
```

**Error Response:**

* `400 Bad Request`: Invalid query parameter values or types

---

### **2.4 Natural Language Filtering**

**GET** `/strings/filter-by-natural-language?query=your%20query`

**Success Response (200 OK):**

```json
{
  "data": [ /* matching strings */ ],
  "count": 3,
  "interpreted_query": {
    "original": "all single word palindromic strings",
    "parsed_filters": { "word_count": 1, "is_palindrome": true }
  }
}
```

**Example Queries to Support:**

* `"all single word palindromic strings"` → `word_count=1, is_palindrome=true`
* `"strings longer than 10 characters"` → `min_length=11`
* `"palindromic strings that contain the first vowel"` → `is_palindrome=true, contains_character=a`
* `"strings containing the letter z"` → `contains_character=z`

**Error Responses:**

* `400 Bad Request`: Unable to parse natural language query
* `422 Unprocessable Entity`: Query parsed but resulted in conflicting filters

---

### **2.5 Delete String**

**DELETE** `/strings/{string_value}`

**Success Response (204 No Content)**

**Error Response:**

* `404 Not Found`: String does not exist

---

## **3️⃣ Submission Instructions**

* Implement in any language (except Vercel/Render; allowed: Railway, Heroku, AWS, PXXL App, etc.)
* Include GitHub repo with:

  * Clear README with setup instructions
  * Instructions to run locally
  * List of dependencies and installation steps
  * Environment variables (if any)
  * Tests and/or API documentation
* Test your endpoints before submission
* Submit via Slack bot in `stage-1-backend` channel using `/stage-one-backend` command

**Submission Details Required:**

* API base URL (e.g., `https://yourapp.domain.app`)
* GitHub repo link
* Full name
* Email
* Stack used

**Check:** Thanos bot will return error/success messages after each submission attempt.

---

### **4️⃣ Deadline**

**Wednesday, 22nd Oct 2025 | 11:59 PM GMT+1 (WAT)**

