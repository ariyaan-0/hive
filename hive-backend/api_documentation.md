# Hive API Documentation

Welcome to the Hive API documentation. This API follows RESTful principles and uses JSON for communication.

**Base URL:** `/api/v1`

---

## Table of Contents
1. [Authentication](#authentication)
2. [Users](#users)
3. [Posts](#posts)
4. [Comments](#comments)
5. [Votes](#votes)
6. [Schemas](#schemas)

---

## Authentication

### Login
Authenticates a user and returns an access token.

- **Endpoint:** `POST /auth/login`
- **Content-Type:** `application/x-www-form-urlencoded`
- **Request Body:**
  - `username` (string, required): User's email address.
  - `password` (string, required): User's password.
- **Response:** `200 OK`
  ```json
  {
    "access_token": "string",
    "token_type": "bearer"
  }
  ```
- **Error Responses:**
  - `403 Forbidden`: Invalid Credentials.

---

## Users

### Create User
Registers a new user.

- **Endpoint:** `POST /users/`
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `name` (string, required)
  - `username` (string, required)
  - `email` (string, required)
  - `password` (string, required)
  - `bio` (string, optional)
  - `file` (UploadFile, optional): Profile image.
- **Response:** `201 Created`
  ```json
  {
    "id": "UUID",
    "name": "string",
    "username": "string",
    "email": "user@example.com",
    "imageURL": "string or null",
    "bio": "string or null",
    "created_at": "ISO-8601 string"
  }
  ```

### Get User
Retrieves a user by their ID. Requires authentication. The response depends on whether the requester is viewing their own profile or someone else's.

- **Endpoint:** `GET /users/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  - If the authenticated user is viewing their own profile, it returns the full [UserOut](#userout) schema (including email).
  - If viewing someone else's profile, it returns the [UserPublicOut](#userpublicout) schema.
- **Error Responses:**
  - `401 Unauthorized`: Not authenticated.
  - `404 Not Found`: User not found.

### Update User
Updates a user's information. Only accessible by the owner of the profile.

- **Endpoint:** `PUT /users/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  - See [UserCreate](#usercreate) schema.
- **Response:** `200 OK`
  - See [UserOut](#userout) schema.
- **Error Responses:**
  - `403 Forbidden`: Not authorized to perform requested action.
  - `404 Not Found`: User not found.

### Delete User
Deletes a user by their ID. Only accessible by the owner of the profile.

- **Endpoint:** `DELETE /users/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `204 No Content`
- **Error Responses:**
  - `403 Forbidden`: Not authorized to perform requested action.
  - `404 Not Found`: User not found.

---

## Posts

### Get All Posts
Retrieves a list of posts with vote and comment counts.

- **Endpoint:** `GET /posts/`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `limit` (int, default: 10)
  - `skip` (int, default: 0)
  - `search` (string, optional)
- **Response:** `200 OK`
  ```json
  [
    {
      "Post": {
        "id": "UUID",
        "title": "string",
        "content": "string",
        "imageURL": "string or null",
        "published": true,
        "created_at": "ISO-8601 string",
        "owner_id": "UUID",
        "owner": {
          "id": "UUID",
          "name": "string",
          "username": "string",
          "imageURL": "string or null"
        }
      },
      "votes": 0,
      "comment_count": 0
    }
  ]
  ```

### Get User Posts
Retrieves posts for a specific user.

- **Endpoint:** `GET /posts/user`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `user_id` (UUID, optional): Defaults to the current authenticated user if not provided.
- **Response:** `200 OK`
  - See [PostOut](#postout) schema (List).

### Create Post
Creates a new post.

- **Endpoint:** `POST /posts/`
- **Headers:** `Authorization: Bearer <token>`
- **Content-Type:** `multipart/form-data`
- **Request Body:**
  - `title` (string, required)
  - `content` (string, required)
  - `published` (bool, default: true)
  - `file` (UploadFile, optional): Post image.
- **Response:** `201 Created`
  - See [Post](#post) schema.

### Get Single Post
Retrieves a post by its ID.

- **Endpoint:** `GET /posts/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `200 OK`
  - See [PostOut](#postout) schema.

### Update Post
Partially updates a post.

- **Endpoint:** `PATCH /posts/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  - See [PostUpdate](#postupdate) schema.
- **Response:** `200 OK`
  - See [PostOut](#postout) schema.

### Delete Post
Deletes a post.

- **Endpoint:** `DELETE /posts/{id}`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `204 No Content`

---

## Comments

### Create Comment
Adds a comment to a post.

- **Endpoint:** `POST /comments/`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  - `content` (string, required)
  - `post_id` (UUID, required)
- **Response:** `201 Created`
  - See [Comment](#comment-1) schema.

### Get Comments for Post
Retrieves all comments for a specific post.

- **Endpoint:** `GET /comments/{post_id}`
- **Response:** `200 OK`
  ```json
  [
    {
      "id": "UUID",
      "content": "string",
      "post_id": "UUID",
      "created_at": "ISO-8601 string",
      "user_id": "UUID",
      "user": {
        "id": "UUID",
        "name": "string",
        "username": "string",
        "imageURL": "string or null"
      }
    }
  ]
  ```

---

## Votes

### Vote on Post
Casts or removes a vote on a post.

- **Endpoint:** `POST /vote/`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  - `post_id` (UUID, required)
  - `dir` (int, required): `1` for upvote, `-1` for downvote, `0` to remove vote.
- **Response:** `201 Created`

---

## Schemas

### UserCreate
```json
{
  "name": "string",
  "username": "string",
  "email": "user@example.com",
  "password": "string",
  "imageURL": "string or null",
  "bio": "string or null"
}
```

### UserOut
```json
{
  "id": "UUID",
  "name": "string",
  "username": "string",
  "email": "user@example.com",
  "imageURL": "string or null",
  "bio": "string or null",
  "created_at": "ISO-8601 string"
}
```

### UserPublicOut
```json
{
  "name": "string",
  "username": "string",
  "imageURL": "string or null",
  "bio": "string or null"
}
```

### PostOwner
```json
{
  "id": "UUID",
  "name": "string",
  "username": "string",
  "imageURL": "string or null"
}
```

### Post
```json
{
  "id": "UUID",
  "title": "string",
  "content": "string",
  "imageURL": "string or null",
  "published": true,
  "created_at": "ISO-8601 string",
  "owner_id": "UUID",
  "owner": { "see PostOwner" }
}
```

### PostOut
```json
{
  "Post": { "see Post" },
  "votes": 0,
  "comment_count": 0
}
```

### PostUpdate
```json
{
  "title": "string (optional)",
  "content": "string (optional)",
  "imageURL": "string (optional)",
  "published": "bool (optional)"
}
```

### Comment
```json
{
  "id": "UUID",
  "content": "string",
  "post_id": "UUID",
  "created_at": "ISO-8601 string",
  "user_id": "UUID",
  "user": { "see PostOwner" }
}
```

### Vote
```json
{
  "post_id": "UUID",
  "dir": "1 | -1 | 0"
}
```
