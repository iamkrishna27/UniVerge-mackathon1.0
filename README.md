UniVerge - Student Alumni Communication Platform
🌟 Overview
UniVerge is an innovative platform designed to bridge the communication gap between students and alumni of educational institutions. By leveraging modern web technologies, blockchain for secure credentials, and machine learning for smart matching, UniVerge creates a seamless ecosystem for mentorship, networking, and career guidance.

🚀 Features
🔐 User Authentication & Profiles - Secure login for students and alumni with comprehensive profiles

🤝 Smart Matching System - ML-powered matching based on interests, skills, and career goals

💬 Real-time Communication - Messaging and forum discussions between students and alumni

📜 Blockchain Credential Verification - Secure, immutable verification of alumni credentials using Web3/IPFS

📊 Analytics Dashboard - Insights into engagement, mentorship success, and platform activity

🔍 Advanced Search - Filter alumni by industry, skills, location, and availability

🏗️ Architecture
text
Frontend (HTML/JS/CSS) 
       ↓
    Flask API (app.py)
       ↓
    Business Logic Layer
  ↓              ↓
PostgreSQL      MongoDB
(Structured)  (Unstructured)
       ↓
   Blockchain/IPFS
(Credential Storage)
📦 Tech Stack
Backend
Framework: Flask 2.3.3

Database: PostgreSQL (relational), MongoDB (NoSQL)

Blockchain: Web3.py 6.14.0, IPFS

ML/AI: Scikit-learn 1.3.2, Pandas 2.0.0, NumPy 1.26.3

Authentication: Flask session-based with bcrypt

Frontend
Core: HTML5, CSS3, JavaScript (ES6+)

Styling: Bootstrap/Custom CSS

APIs: Fetch API for async communication

📁 Complete Project Structure
text
UniVerge/
├── app.py                      # Main Flask application
├── requirements.txt            # Dependencies
├── .env                        # Environment variables
├── config.py                   # Configuration settings
│
├── static/                     # Static assets
│   ├── css/
│   │   └── style.css          # Main stylesheet
│   ├── js/
│   │   └── main.js            # Frontend JavaScript
│   └── images/                 # Images and icons
│
├── templates/                  # HTML templates
│   ├── layout.html            # Base template
│   ├── index.html             # Landing page
│   ├── login.html             # Login page
│   ├── register.html          # Registration
│   ├── dashboard.html         # Main dashboard
│   ├── profile.html           # User profile
│   ├── search.html            # Search alumni
│   ├── chat.html              # Messaging interface
│   ├── forum.html             # Discussion forum
│   └── admin.html             # Admin panel
│
├── models/                     # Data models
│   ├── __init__.py
│   ├── user_models.py         # User models (SQLAlchemy)
│   ├── chat_models.py         # Chat models (MongoDB)
│   └── blockchain_models.py   # Blockchain models
│
├── routes/                     # Route handlers
│   ├── __init__.py
│   ├── auth.py                # Authentication routes
│   ├── profile.py             # Profile management
│   ├── chat.py                # Chat routes
│   ├── forum.py               # Forum routes
│   ├── search.py              # Search and matching
│   └── blockchain.py          # Blockchain operations
│
├── services/                   # Business logic
│   ├── __init__.py
│   ├── matching_service.py    # ML matching algorithm
│   ├── chat_service.py        # Chat functionality
│   ├── blockchain_service.py  # Blockchain interactions
│   └── analytics_service.py   # Data analytics
│
├── utils/                      # Utilities
│   ├── __init__.py
│   ├── validators.py          # Input validation
│   ├── helpers.py             # Helper functions
│   └── decorators.py          # Custom decorators
│
└── tests/                      # Test files
    ├── test_auth.py
    ├── test_models.py
    └── test_services.py
📋 Installation & Setup
Prerequisites
Python 3.8+

PostgreSQL 12+

MongoDB 5.0+

Node.js (for future frontend enhancements)

MetaMask (for blockchain features)

1. Clone Repository
bash
git clone https://github.com/iamkrishna27/UniVerge-mackathon1.0.git
cd UniVerge-mackathon1.0
2. Create Virtual Environment
bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
3. Install Dependencies
bash
pip install -r requirements.txt
4. Environment Configuration
Create .env file in root directory:

env
# Flask Configuration
FLASK_APP=app.py
FLASK_ENV=development
SECRET_KEY=your-secret-key-here
DEBUG=True
