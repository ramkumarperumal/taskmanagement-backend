# TASK MANAGEMENT BACKEND

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## ENV variables

- SERVER_PORT - backend port (default - 5000)
- MONOGODB_URI - mongodb uri (eg: mongodb://localhost:27017/taskmanagement)
- JWT_SECRET_KEY - secret key to create jwt token (eg: mysecretkey)
- JWT_EXPIRESIN - expiry time for jwt token (eg: 24h)
- REDIS_HOST - redis host (eg: localhost)
- REDIS_PORT - redis port (eg: 6379)

## Login

### Endpoint:

- POST /login - endpoint for user login

### Payload:

- email - string
- password - string

## Users - module

### Endpoint:

- GET /users - Get all users
- GET /users/id - Get user based on id
- POST /users - Create a user
- PUT /users/id - Update user based on id
- DELETE /users/id - Delete user based on id

### Payload:

- first_name - string
- last_name - string
- email - string
- role - string (enum - 'Admin', 'User'),
- phone_number - number
- address - string
- country - string
- state - string
- city - string
- zip_code - number
- password - string (minimum of 8 character)

## Tasks - module

### Endpoint:

- GET /tasks - Get all tasks
- GET /tasks/id - Get tasks based on id
- POST /tasks - Create a tasks
- PUT /tasks/id - Update tasks based on id
- DELETE /tasks/id - Delete tasks based on id

### Payload:

- task_name - string
- description - string
- due_date - date
- priority - string (enum - 'Low', 'Medium', 'High', 'Critical', default - 'Medium')
- assignee - user id reference (refer to user to whom this task is assigned to)
- status - string (enum - 'Todo', 'Inprogress', 'Completed', 'Rejected', 'Cancelled', default - 'Todo')
- created_by - user id reference (refer to user who created this task)
