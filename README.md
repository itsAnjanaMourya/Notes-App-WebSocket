### Prerequisites
    Node.js installed on your local machine.
    MongoDB Atlas or local MongoDB setup.

**Installation**

### Clone the repository
    git clone https://github.com/itsAnjanaMourya/Task-Manager.git

### Navigate to the project directory
    cd NotesApplication

### Navigate to the backend directory
    cd backend

### Install backend dependencies
    npm i

### Create an .env file 
    In the backend folder, create a .env file with the following variables:

    MONGODB_URL= <your-mongodb-atlas-uri>
    PORT=3200
    BASE_URL= <your-frontend-url>
    SECRET_KEY= <secret-key-for-signing-JWT>
    ADMIN_EMAIL=<admin-email-address>
    ADMIN_PASSWORD=<admin-password>

### Start the backend server
    npm start

**Frontend Setup**

### Navigate to the frontend directory
    cd frontend

### Install frontend dependencies:
    npm i

### Start the frontend development server
    npm start


**Usage**
    Register: Create an account by providing a username, email, and password.

    Login: Log in using the registered credentials.

    Manage Notes:
    Add: Create new notes by filling in the title, description, and status.

    Edit: Update existing notes by selecting the edit button.
    
    Delete: Remove notes you no longer need.

    Search: Search any task using search bar.

    Priority Filter: Filter task by High or Low priority (High priority: red, Low Priority: green, Medium Priority: yellow).

**API Endpoints**
### Authentication
    POST /user/register: Register a new user.

    POST /user/login: Log in to get a JWT.

    POST /user/logout: Invalidate the user session.

    GET /admin/users: get all users

    GET /admin/tasks: get all tasks of user

    GET /admin/tasks:userId get task by  user id

### Notes
    GET /notes/getNotes: Get all notes for the authenticated user.

    POST /notes/addNote: Add a new note.

    PUT /notes/updateNote/:id: Update a note by its ID.

    DELETE /notes/deleteNote/:id: Delete a note by its ID.

### Project Screenshots
![home page1](./project_screenshots/Screenshot1.png)
![home page2](./project_screenshots/Screenshot2.png)
![login](./project_screenshots/Screenshot3.png)
![register](./project_screenshots/Screenshot4.png)