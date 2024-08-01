# Coding Competition Web Application

## Team Name: BeatCode

### Team Members

- Chelsea Chan - chelseacyy.chan@mail.utoronto.ca

- Jin Zhou - jinting.zhou@mail.utoronto.ca

- Yesom Son - yesom.son@mail.utoronto.ca

### Project Description

Our web application is a coding competition platform where users can compete against each other or an AI in real-time on coding challenges. Users will be able to:

- Match with another user or an AI for a coding challenge.

- View their opponent's real-time progress as they code.

- Use an integrated online code editor (Monaco).

- Have their code compiled and executed using Judge0.

- Track their performance and progress over time.

### Required Elements Fulfillment

- **Modern Frontend Framework**: We will use Angular to create a Single Page Application (SPA).

- **Backend API**: The backend will be developed using Express.

- **RESTful API**: Our application's API will be RESTful.

- **Deployment**: We will deploy our application on a Virtual Machine using Docker and Docker Compose. All deployment files, including CI files for building images, will be committed to GitHub.

- **Public Access**: The application will be publicly accessible without extra steps.

- **Third-party API**: We will integrate with Judge0 API for code compilation and execution.

- **OAuth 2.0**: OAuth 2.0 will be used for user authentication.

### Additional Requirements Fulfillment

- **Real-time Functionality**: The application will have real-time updates, allowing users to see their opponent's progress without refreshing the page.

- **Long-running Task**: Code compilation and execution by Judge0, which can take more than 10 seconds to complete, will be managed as a long-running task.

#### Core Features

1.  **User Registration and Authentication**

- Implement OAuth 2.0 for user authentication

- User registration and login pages

- Password reset functionality

2.  **User Profile Management**

- View and edit user profiles

- Display user statistics and performance history

3.  **Matchmaking System**

- Match users with other users or AI for coding challenges

- Real-time notification of match status

4.  **Coding Environment**

- Integration with Monaco code editor

5.  **Code Compilation and Execution**

- Integration with Judge0 API for code execution

- Support for multiple programming languages

- Display of compilation errors and execution results

6.  **Real-time Features**

- Display opponent's code progress in real-time

- Real-time score updates

### Milestones

#### Alpha Version

- Basic user interface with Angular

- Basic Express backend setup

- Integration with Monaco editor

- Initial integration with Judge0 for code execution

#### Beta Version

- Full user authentication with OAuth 2.0

- Real-time match-making and code progress display

- Deployment setup with Docker and Docker Compose

- Basic user performance tracking

#### Final Version

- Complete and polished user interface

- Fully functional real-time coding competition

- Detailed performance tracking and statistics

- Public deployment and accessibility

#

### Access

To access the application, please go to https://beat.codes

