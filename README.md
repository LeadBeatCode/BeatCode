# project-cyj
project-cyj created by GitHub Classroom
# Group Project Proposal

## Project Title: Motiv8or - A Personal Life Management Application

## Team Name: ProductivityBoosters

## Team Members:

- Member 1: Chelsea Chan - chelseacyy.chan@mail.utoronto.ca
- Member 2: Jin Zhou - jinting.zhou@mail.utoronto.ca
- Member 3: Yesom Son - yesom.son@mail.utoronto.ca

## Brief Description:

Motiv8or is a web application designed to help users manage their personal lives effectively by combining task management, goal tracking, a collaborated calendar, and more. It aims to offer a seamless experience in organizing daily activities, setting and achieving goals, and staying motivated through a points and rewards system. Additionally, users can join groups to collaborate and compete with friends on focusing tasks. The focus mode feature allows users to track time spent on tasks and view the cumulative work time of group members, fostering a competitive and motivating environment.

## Required Elements:

- **Frontend Framework**: Using Angular for a modern Single Page Application (SPA) experience.
- **Backend**: Using Express as the core backend API.
- **RESTful API**: Ensuring the API is RESTful where appropriate.
- **Deployment**: Deploying the application on a Virtual Machine using Docker and Docker Compose. Committing all deployment files to GitHub, including CI files for building images.
- **Public Accessibility**: Ensuring the application is accessible to the general public without extra steps.
- **Third-Party API**: Integrating with Google Calendar, Apple Calendar API for calendar synchronization.
- **OAuth 2.0**: Implementing OAuth 2.0 for user authentication and authorization.

## Additional Requirements:

1. **Webhook Interaction**: Integrating with a third-party service to trigger notifications or updates.
2. **Real-Time Feature**: Implementing a real-time collaborated calendar that reflects changes without refreshing the page. Implementing a real-time focus room that allows users to see the status of other users

## Features:

### Core Features:

- **Task Management**:
    - Create, edit, and delete tasks.
    - Assign tasks to different categories (e.g., work, personal, hobbies).
    - Set priority levels for tasks (e.g., low, medium, high).
    - Add due dates and reminders.
    - Recurring tasks for daily, weekly, or monthly activities.
- **Collaborated Calendar**:
    - Integrated calendar view showing tasks and events.
    - Share calendar events with friends, family, or teammates.
    - Sync with Google Calendar, Apple Calendar
- **Goal Tracking**:
    - Set short-term and long-term goals.
    - Break down goals into manageable tasks.
    - Progress tracking with visual indicators (e.g., progress bars).
- **Week Planner**:
    - Weekly overview of tasks and events.
    - Drag-and-drop interface to reschedule tasks.
    - Weekly planning template for setting priorities and goals.
- **Backlog Management**:
    - Maintain a list of all tasks and ideas not yet scheduled.
    - Prioritize and move tasks from backlog to active list.
    - Categorize backlog items for better organization.
- **Points and Rewards System**:
    - Assign points to tasks based on difficulty or importance.
    - Earn rewards or badges for completing tasks and achieving goals.
    - Customizable reward system for personal motivation.
- **Time Tracking**:
    - Log time spent on various tasks and activities.
    - Weekly and monthly time reports.
    - Analyze time usage to improve productivity.
- **Focus Mode**
	- Users can enter a focus mode when starting a task.
	- Track the time spent on the task.
	- See real-time status of other group members' work.
	- View the cumulative time group members have worked for the day.
	- View the ranking of focus time among all users
- **Timeline View**:
	- Daily schedule view for planning tasks and activities.
	- Drag-and-drop interface for easy scheduling.
	- Integration with calendar events for a comprehensive daily plan.
- **Personal Dashboard**:
    - Overview of daily tasks, upcoming deadlines, and progress on goals.
    - Customizable widgets for quick access to important information.
    - Motivational quotes or tips for personal development. (optional)
    - Overview of other group mates' progresses

## Milestones:

### Alpha Version:

- Initial setup of project repository.
- Basic frontend layout with Angular
- Basic backend setup with Express.
- Initial implementation of task management feature.

### Beta Version:

- Completion of all core features.
- Integration with Google Calendar, Apple Calendar API.
- Implementation of OAuth 2.0 for user authentication.
- Deployment of the application on a Virtual Machine using Docker.
- Initial implementation of group collaboration and focus mode.
- Real-time collaborated calendar feature.
- Initial implementation of timeline view.
- Initial testing and bug fixing.

### Final Version:

- Full functionality of all features.
- Polished UI/UX.
- Comprehensive testing and bug fixing.
- Final deployment and ensuring public accessibility.
- Complete documentation and README.md update.
