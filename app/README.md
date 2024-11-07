#### Development

### DEMOCREDIT APP
DemoCredit is a financial application designed to provide users with secure account management, including the ability to create an account, fund it, transfer funds to other users, and make withdrawals. Additionally, the system incorporates blacklist validation to prevent users flagged by Lendsqr Adjutor Karma from being onboarded. Unit tests are included to ensure robust functionality across all features.

Table of Contents
Features
Getting Started
Requirements
Installation
Usage
E-R Diagram
Testing

Features
User Registration: A new user can create an account with the application.

Account Funding: Users can fund their accounts .

Fund Transfer: Users can transfer funds to another registered user’s account securely.

Withdrawal: Users can withdraw funds from their account.

Blacklist Check: Users found in the Lendsqr Adjutor Karma blacklist will not be allowed to onboard.

Unit Testing: Comprehensive unit tests ensure reliability of each functionality.

### Getting Started
To get a local copy of this project up and running, follow these simple steps.

### Requirements
Node.js (for running the application)
MySQL (or another SQL database if configured)
Workbench or preferred GUI
KnexJs ORM
Git for cloning the repository

### Installation
Clone the Repository:

git clone https://github.com/polymathmode/Demo-Credit.git

Navigate to the Project Directory:

cd demo-credit
cd app
cd server

Install Dependencies:
# run *yarn*


### Set up environment variables
Create a .env file in the project root.
Add database connection details, API keys, and other configuration variables in the 
## .env.example file

Run Database Migrations: Run the necessary database migrations to set up tables and relationships:

# run *yarn migrate*

### Start the application with:
# run *yarn start*

### Running Tests
Run all tests with the following command:
# run *yarn test*

### E-R Diagram
The E-R Diagram provides a visual representation of the database structure and relationships
### ![ER Diagram](/app/server/assets/E.R%20diagram.png)
