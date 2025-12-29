# UniVerge - Student Alumni Communication Platform

## Overview
UniVerge is a full-stack web application designed to bridge the gap between current students and alumni. The platform facilitates mentorship, networking, and knowledge sharing through smart matching, real-time communication, and secure credential verification.

## Features
- **User Authentication**: Secure registration/login for students and alumni
- **Smart Matching**: ML-powered matching based on skills, interests, and goals
- **Real-time Chat**: Direct messaging between users
- **Discussion Forums**: Community discussions and Q&A
- **Blockchain Integration**: Secure credential verification using Web3/IPFS
- **Profile Management**: Comprehensive user profiles with education/work history
- **Search & Filter**: Find alumni by skills, industry, or location

## Tech Stack
- **Backend**: Python, Flask 2.3.3
- **Database**: PostgreSQL (relational), MongoDB (NoSQL)
- **Frontend**: HTML, CSS, JavaScript
- **Blockchain**: Web3.py, IPFS
- **ML/AI**: Scikit-learn, Pandas, NumPy
- **Authentication**: Flask-Login, bcrypt

## Installation

### Prerequisites
- Python 3.8+
- PostgreSQL 12+
- MongoDB 5.0+

### Step-by-Step Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/iamkrishna27/UniVerge-mackathon1.0.git
   cd UniVerge-mackathon1.0
Create virtual environment

bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
Install dependencies

bash
pip install -r requirements.txt
Database setup

sql
-- PostgreSQL
CREATE DATABASE univerge_db;
CREATE USER univerge_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE univerge_db TO univerge_user;

-- MongoDB
mongod --dbpath ./data
Environment configuration
Create a .env file in the root directory:

env
FLASK_APP=app.py
SECRET_KEY=your-secret-key-here
DATABASE_URL=postgresql://univerge_user:password@localhost:5432/univerge_db
MONGO_URI=mongodb://localhost:27017/univerge_chat
Run the application

bash
python app.py
Open browser: http://localhost:5000

Project Structure
text
UniVerge/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── .env                  # Environment variables
├── static/               # CSS, JavaScript, images
├── templates/            # HTML templates
├── models/               # Database models
├── routes/               # API routes
├── services/             # Business logic
└── utils/                # Helper functions
API Endpoints
POST /auth/register - User registration

POST /auth/login - User authentication

GET /api/alumni - Get alumni list

POST /chat/send - Send message

GET /profile/:id - Get user profile

POST /match/find - Find matching users

Dependencies
text
Flask==2.3.3
Flask-CORS==4.0.0
Flask-SQLAlchemy==3.1.1
psycopg2-binary==2.9.9
pymongo==4.6.1
web3==6.14.0
scikit-learn==1.3.2
pandas==2.2.0
numpy==1.26.3
python-dotenv==1.0.0
Troubleshooting
Port already in use: Run python app.py --port 5001

Database connection error: Verify PostgreSQL is running

Module not found: Reinstall dependencies with pip install -r requirements.txt

Contributing
Fork the repository

Create a feature branch

Commit your changes

Push to the branch

Create a Pull Request

License
This project is part of UniVerge Hackathon 1.0 submission.

Contact
GitHub: iamkrishna27

Project: UniVerge Hackathon 1.0

text

**Key fixes I made:**
1. **Added proper Markdown headers** (`#`, `##`, `###`)
2. **Fixed code blocks** with triple backticks (```)
3. **Corrected database name** from `universe_db` to `univerge_db`
4. **Fixed the `.env` file** formatting
5. **Added proper structure** with clear sections
6. **Fixed API endpoints** formatting

**Copy ALL the text above** and paste it into your `README.md` file. It will display correctly on GitHub with proper formatting.
