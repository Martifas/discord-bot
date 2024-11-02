## Requirements

**The bot will need to:**

- be triggered by a request
- fetch a random GIF related to a celebration or success from an external GIF service (such as Giphy or Tenor API)
- retrieve a random congratulatory message template from the database. Template would contain a reusable piece of text that you can re-use: "You nailed it! 💪", "You did it! I knew you could. 🤗".
- retrieve a sprint title from the database
- congratulate a user on a configured Discord server with the GIF and a message in a similar manner to what you can see in the Turing College "accomplishments" channel
- store the congratulatory message and valuable metadata in the database so that it can be retrieved later
- on failure, inform the user that the congratulatory message could not be formed/sent/stored

**REST API will need to support the following endpoints:**

- POST /messages - send a congratulatory message to a user on Discord
- GET /messages - get a list of all congratulatory messages
- GET /messages?username=johdoe - get a list of all congratulatory messages for a specific user
- GET /messages?sprint=WD-1.1 - get a list of all congratulatory messages for a specific sprint
- CRUD /templates - POST/GET/PATCH/DELETE endpoints for managing congratulatory message templates
- CRUD /sprints - POST/GET/PATCH/DELETE endpoints for managing sprints

## Instructions

**To initialize project:**

```
npm init
```

**To create databases:**

```
npm run migrate:latest
```

**To generate types (required):**

```
npm run gen:types
```

**To start server:**

```
npm run start
```

**Test can be run with:**

```
npm run test
```

## Endpoints

**Supported endpoints:**
Note: atleast 1 sprint and 1 template is required

- POST /messages - send a congratulatory message to a user on Discord
- GET /messages - get a list of all congratulatory messages
- GET /messages?username=johdoe - get a list of all congratulatory messages for a specific user
- GET /messages?sprint=WD-1.1 - get a list of all congratulatory messages for a specific sprint
- CRUD /templates - POST/GET/PATCH/DELETE endpoints for managing congratulatory message templates
- CRUD /sprints - POST/GET/PATCH/DELETE endpoints for managing sprints

Movie tickets repo: https://github.com/Martifas/movie-tickets
