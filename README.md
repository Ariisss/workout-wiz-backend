# Workout-Wiz Backend

A smart fitness tracking application with AI-powered workout plan generation.

## Overview

WorkoutWiz is a fitness tracking app that helps users create and manage personalized workout plans. It leverages Google's Generative AI to create custom workout routines based on user preferences, fitness levels, and goals.

## Frontend/Client Repository Link:
[Workout Wiz - Fitness Tracker App (Client)](https://github.com/Ariisss/workout-wiz-client)

## Members:
- **Prince Isaac Pantino**
- **Fitzsixto Angelo Singh**
- **Matthew Cedric Calaycay**

## Features

- **AI-powered Workout Plan Generation**: Create personalized workout plans using Google's Generative AI
- **User Authentication**: Secure JWT-based authentication system
- **Exercise Tracking**: Log and monitor workout sessions
- **Personalized Preferences**: Store and manage user fitness preferences
- **Progress Monitoring**: Track fitness progress over time
- **Automated Streak Counting**: Cron-based scheduling for checking workout streaks

## Tech Stack

- **Runtime**: Node.js (v18 or higher)
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **AI Integration**: Google Generative AI
- **Authentication**: JWT with bcrypt
- **Validation**: Joi
- **Task Scheduling**: node-cron

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (latest stable version)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/workout-wiz.git
cd workout-wiz-server
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the expected environment variables:
```bash
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/workout-wiz
JWT_SECRET=your-secret-key
GEMINI_API_KEY=your-generative-ai-key
```

## Usage

1. Start the server:
```bash
npm start
```

2. Stop the server:
```bash
ctrl + c
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.
