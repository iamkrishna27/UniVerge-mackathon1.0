# app.py

from flask import Flask, render_template, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import random
from pymongo import MongoClient
from pymongo.errors import DuplicateKeyError
from bson.objectid import ObjectId
import re
from datetime import datetime, timedelta

# --- Database Configuration ---
DATABASE_URL = os.environ.get('DATABASE_URL', 'mongodb+srv://krishna:destroyer1357@smartnav.uz1gfre.mongodb.net/?retryWrites=true&w=majority&appName=SMARTNAV')
DB_NAME = 'univerge_data'

# Initialize Flask app
app = Flask(__name__, static_folder='static', template_folder='templates')
CORS(app)

# --- MongoDB Setup ---
try:
    client = MongoClient(DATABASE_URL)
    db = client[DB_NAME]
    users_collection = db.users
    mentorship_slots_collection = db.mentorship_slots
    resources_collection = db.resources
    # NEW: Cultural Confidence Corner Posts Collection
    confidence_corner_posts_collection = db.confidence_corner_posts
    
    users_collection.create_index("email", unique=True)
    print(f"Successfully connected to MongoDB: {DB_NAME}")
except Exception as e:
    print(f"Error connecting to MongoDB: {e}")

# --- Global current_user (for session simulation in this demo) ---
current_user = None

# --- Custom Static Route for JavaScript files ---
@app.route('/script/<path:filename>')
def serve_script_static(filename):
    script_dir = os.path.join(app.root_path, 'script')
    return send_from_directory(script_dir, filename)

# --- Helper to convert MongoDB ObjectId to string for JSON response ---
def doc_to_dict(doc):
    if not doc:
        return None
    doc_dict = {k: v for k, v in doc.items() if k != '_id'}
    doc_dict['id'] = str(doc['_id'])
    
    if 'alumni_id' in doc_dict and isinstance(doc_dict['alumni_id'], ObjectId):
        doc_dict['alumni_id'] = str(doc_dict['alumni_id'])
    if 'student_id' in doc_dict and isinstance(doc_dict['student_id'], ObjectId):
        doc_dict['student_id'] = str(doc_dict['student_id'])
    if 'user_id' in doc_dict and isinstance(doc_dict['user_id'], ObjectId): # For confidence corner posts
        doc_dict['user_id'] = str(doc_dict['user_id'])
    
    # Convert datetime objects to ISO format strings for JSON
    if 'start_time' in doc_dict and isinstance(doc_dict['start_time'], datetime):
        doc_dict['start_time'] = doc_dict['start_time'].isoformat()
    if 'end_time' in doc_dict and isinstance(doc_dict['end_time'], datetime):
        doc_dict['end_time'] = doc_dict['end_time'].isoformat()
    if 'created_at' in doc_dict and isinstance(doc_dict['created_at'], datetime): # For resources and confidence corner posts
        doc_dict['created_at'] = doc_dict['created_at'].isoformat()

    return doc_dict

# --- Routes ---

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/login', methods=['POST'])
def login():
    global current_user
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    user_doc = users_collection.find_one({"email": email, "password": password})

    if user_doc:
        current_user = doc_to_dict(user_doc)
        return jsonify({"message": f"Welcome, {current_user['name']}!", "user": current_user, "success": True}), 200
    else:
        return jsonify({"message": "Invalid email or password.", "success": False}), 401

@app.route('/api/register', methods=['POST'])
def register():
    global current_user
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    user_type = data.get('type')
    hometown = data.get('hometown')
    language = data.get('language')

    # Basic validation
    if not all([email, password, name, user_type, hometown, language]):
        return jsonify({"message": "All fields are required.", "success": False}), 400
    if user_type not in ['student', 'alumni']:
        return jsonify({"message": "Invalid user type. Must be 'student' or 'alumni'.", "success": False}), 400

    new_user_data = {
        "email": email,
        "password": password, # In a real app, hash this password!
        "name": name,
        "type": user_type,
        "hometown": hometown,
        "language": language
    }

    # Only add profession if user is alumni. Do NOT add 'story' here.
    if user_type == 'alumni':
        # 'profession' can be an empty string if not provided in the form, or default to None
        new_user_data["profession"] = data.get('profession', None) 
    else: # user_type == 'student'
        # Ensure 'profession' is explicitly not set or set to None for students
        new_user_data["profession"] = None # Or simply don't add the key if it's not needed

    try:
        result = users_collection.insert_one(new_user_data)
        new_user_doc = users_collection.find_one({"_id": result.inserted_id})
        
        current_user = doc_to_dict(new_user_doc)
        return jsonify({"message": f"Registration successful! Welcome, {current_user['name']}!", "user": current_user, "success": True}), 201
    except DuplicateKeyError:
        return jsonify({"message": "Email already registered.", "success": False}), 409
    except Exception as e:
        print(f"An error occurred during registration: {str(e)}")
        return jsonify({"message": f"An error occurred during registration: {str(e)}", "success": False}), 500

@app.route('/api/logout', methods=['POST'])
def logout():
    global current_user
    current_user = None
    return jsonify({"message": "Logged out successfully.", "success": True}), 200

@app.route('/api/current_user', methods=['GET'])
def get_current_user():
    if current_user:
        return jsonify({"user": current_user, "success": True}), 200
    else:
        return jsonify({"message": "No user logged in.", "success": False}), 401

@app.route('/api/simulate_match', methods=['POST'])
def simulate_match():
    global current_user

    if not current_user or current_user['type'] != 'student':
        return jsonify({"message": "Only students can simulate matches.", "success": False}), 403

    potential_mentors_docs = list(users_collection.find({
        "type": "alumni",
        "hometown": current_user.get('hometown'),
        "language": current_user.get('language')
    }))

    if potential_mentors_docs:
        matched_alumni_doc = random.choice(potential_mentors_docs)
        matched_alumni_data = doc_to_dict(matched_alumni_doc)
        matched_alumni_data.pop('password', None) 

        return jsonify({
            "message": "Simulated match found!",
            "match": matched_alumni_data,
            "success": True
        }), 200
    else:
        return jsonify({"message": "No direct match found yet. Try updating your profile's hometown or language!", "success": False}), 200
    
@app.route('/api/storyboards', methods=['GET'])
def get_storyboards():
    """Returns a list of all alumni storyboards."""
    # Filter for alumni who have a 'story' field (meaning they've created a storyboard)
    alumni_users_docs = list(users_collection.find({"type": "alumni", "story": {"$exists": True, "$ne": None, "$ne": ""}}))

    alumni_stories = []
    for u_doc in alumni_users_docs:
        alumni_dict = doc_to_dict(u_doc)
        alumni_stories.append({
            "name": alumni_dict['name'],
            "profession": alumni_dict.get('profession', 'Alumni'),
            "hometown": alumni_dict['hometown'],
            "story": alumni_dict['story'],
            "story_title": alumni_dict.get('story_title', 'My Journey'),
            "image_url": alumni_dict.get('story_image', '')
        })
    return jsonify({"storyboards": alumni_stories, "success": True}), 200

@app.route('/api/profile', methods=['PUT'])
def update_profile():
    global current_user
    
    if not current_user:
        return jsonify({"message": "Authentication required.", "success": False}), 401

    data = request.get_json()
    
    update_fields = {}
    if 'hometown' in data: # Allow setting to empty string
        update_fields['hometown'] = data['hometown']
    if 'language' in data: # Allow setting to empty string
        update_fields['language'] = data['language']
    
    if current_user['type'] == 'alumni':
        if 'profession' in data: # Allow setting to empty string
            update_fields['profession'] = data['profession']

    try:
        if update_fields:
            users_collection.update_one(
                {"_id": ObjectId(current_user['id'])},
                {"$set": update_fields}
            )
            
            updated_user_doc = users_collection.find_one({"_id": ObjectId(current_user['id'])})
            current_user = doc_to_dict(updated_user_doc)
            
            return jsonify({"message": "Profile updated successfully!", "user": current_user, "success": True}), 200
        else:
            return jsonify({"message": "No fields to update.", "success": False}), 400
    except Exception as e:
        print(f"Error updating profile: {e}")
        return jsonify({"message": "An error occurred during profile update.", "success": False}), 500

@app.route('/api/storyboards/create', methods=['POST'])
def create_storyboard():
    global current_user 

    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"message": "Only alumni can share stories.", "success": False}), 403

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')
    image_url = data.get('image_url') 

    if not title or not description:
        return jsonify({"message": "Story title and description are required.", "success": False}), 400

    try:
        update_data = {
            "story": description,
            "story_title": title,
            "story_image": image_url if image_url else None # Store None if empty
        }

        users_collection.update_one(
            {"_id": ObjectId(current_user['id'])},
            {"$set": update_data}
        )

        updated_user_doc = users_collection.find_one({"_id": ObjectId(current_user['id'])})
        current_user = doc_to_dict(updated_user_doc)

        return jsonify({"message": "Your journey has been shared successfully!", "success": True}), 201
    except Exception as e:
        print(f"Error sharing journey: {e}")
        return jsonify({"message": f"An error occurred while sharing your journey: {str(e)}", "success": False}), 500

# Route to serve the content of the dummy Impact Tracker HTML
@app.route('/impact-tracker-dummy-content')
def serve_impact_tracker_dummy_content():
    """Serves only the content of the dummy Impact Tracker HTML page's main section."""
    file_path = os.path.join(app.root_path, app.template_folder, 'impact_tracker_dummy.html')
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            full_html = f.read()
        
        main_content_match = re.search(r'<main[^>]*>(.*?)</main>', full_html, re.DOTALL)
        if main_content_match:
            return main_content_match.group(1)
        else:
            return "<!-- Error: Main content not found in dummy HTML -->", 500
    except FileNotFoundError:
        return "<!-- Error: impact_tracker_dummy.html not found -->", 404
    except Exception as e:
        return f"<!-- Server Error loading dummy content: {str(e)} -->", 500

# --- Quick Mentorship Slots / Instant Connect Routes ---

@app.route('/api/slots/create', methods=['POST'])
def create_mentorship_slot():
    global current_user

    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"message": "Only alumni can create mentorship slots.", "success": False}), 403

    data = request.get_json()
    slot_date_str = data.get('date')
    slot_time_str = data.get('time')
    duration_minutes = int(data.get('duration', 30))

    if not slot_date_str or not slot_time_str:
        return jsonify({"message": "Date and time are required to create a slot.", "success": False}), 400

    try:
        start_datetime_str = f"{slot_date_str} {slot_time_str}"
        start_time = datetime.strptime(start_datetime_str, '%Y-%m-%d %H:%M')
        end_time = start_time + timedelta(minutes=duration_minutes)

        new_slot = {
            "alumni_id": ObjectId(current_user['id']),
            "alumni_name": current_user['name'],
            "start_time": start_time,
            "end_time": end_time,
            "duration_minutes": duration_minutes,
            "is_booked": False,
            "student_id": None,
            "student_name": None
        }
        result = mentorship_slots_collection.insert_one(new_slot)
        new_slot['_id'] = result.inserted_id
        return jsonify({"message": "Mentorship slot created successfully!", "slot": doc_to_dict(new_slot), "success": True}), 201
    except ValueError:
        return jsonify({"message": "Invalid date or time format. Use YYYY-MM-DD and HH:MM.", "success": False}), 400
    except Exception as e:
        print(f"Error creating mentorship slot: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}", "success": False}), 500

@app.route('/api/slots/available', methods=['GET'])
def get_available_slots():
    if not current_user:
        return jsonify({"message": "Authentication required to view slots.", "success": False}), 401
    
    available_slots_docs = list(mentorship_slots_collection.find({
        "is_booked": False,
        "start_time": {"$gte": datetime.now()}
    }).sort("start_time", 1))

    slots_data = [doc_to_dict(slot) for slot in available_slots_docs]
    return jsonify({"slots": slots_data, "success": True}), 200

@app.route('/api/slots/my', methods=['GET'])
def get_my_slots():
    if not current_user:
        return jsonify({"message": "Authentication required to view your slots.", "success": False}), 401
    
    my_slots_docs = list(mentorship_slots_collection.find({
        "$or": [
            {"alumni_id": ObjectId(current_user['id'])},
            {"student_id": ObjectId(current_user['id'])}
        ]
    }).sort("start_time", 1))

    slots_data = []
    for slot_doc in my_slots_docs:
        slot_data = doc_to_dict(slot_doc)
        slot_data['is_my_alumni_slot'] = (str(slot_data['alumni_id']) == current_user['id'])
        slots_data.append(slot_data)

    return jsonify({"slots": slots_data, "success": True}), 200


@app.route('/api/slots/book/<string:slot_id>', methods=['POST'])
def book_mentorship_slot(slot_id):
    global current_user

    if not current_user or current_user['type'] != 'student':
        return jsonify({"message": "Only students can book mentorship slots.", "success": False}), 403

    try:
        slot_obj_id = ObjectId(slot_id)
        slot = mentorship_slots_collection.find_one({"_id": slot_obj_id})

        if not slot:
            return jsonify({"message": "Slot not found.", "success": False}), 404
        if slot['is_booked']:
            return jsonify({"message": "This slot is already booked.", "success": False}), 409
        if str(slot['alumni_id']) == current_user['id']:
            return jsonify({"message": "You cannot book your own mentorship slot.", "success": False}), 400

        mentorship_slots_collection.update_one(
            {"_id": slot_obj_id},
            {"$set": {
                "is_booked": True,
                "student_id": ObjectId(current_user['id']),
                "student_name": current_user['name']
            }}
        )
        
        updated_slot = mentorship_slots_collection.find_one({"_id": slot_obj_id})
        return jsonify({"message": "Slot booked successfully!", "slot": doc_to_dict(updated_slot), "success": True}), 200

    except Exception as e:
        print(f"Error booking slot: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}", "success": False}), 500

# --- Resource Bank Routes ---

@app.route('/api/resources/create', methods=['POST'])
def create_resource():
    global current_user

    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"message": "Only alumni can upload resources.", "success": False}), 403

    data = request.get_json()
    title = data.get('title')
    url = data.get('url')
    description = data.get('description')
    category = data.get('category')
    
    alumni_hometown = current_user.get('hometown')
    alumni_language = current_user.get('language')

    if not title or not url or not category:
        return jsonify({"message": "Title, URL, and Category are required for a resource.", "success": False}), 400

    new_resource = {
        "title": title,
        "url": url,
        "description": description,
        "category": category,
        "alumni_id": ObjectId(current_user['id']),
        "alumni_name": current_user['name'],
        "alumni_hometown": alumni_hometown,
        "alumni_language": alumni_language,
        "created_at": datetime.now()
    }

    try:
        result = resources_collection.insert_one(new_resource)
        new_resource['_id'] = result.inserted_id
        return jsonify({"message": "Resource uploaded successfully!", "resource": doc_to_dict(new_resource), "success": True}), 201
    except Exception as e:
        print(f"Error creating resource: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}", "success": False}), 500

@app.route('/api/resources', methods=['GET'])
def get_resources():
    global current_user

    if not current_user:
        return jsonify({"message": "Authentication required to view resources.", "success": False}), 401

    query = {}
    if current_user['type'] == 'student':
        student_hometown = current_user.get('hometown')
        student_language = current_user.get('language')
        
        # If student has hometown/language, prioritize resources from alumni with same.
        # This is a simple targeting. More complex logic (e.g., fuzzy matching, AI) would go here.
        # For now, if both are present, we'll try to match both. If only one, match that one.
        # If neither, return all.
        match_criteria = {}
        if student_hometown:
            match_criteria["alumni_hometown"] = student_hometown
        if student_language:
            match_criteria["alumni_language"] = student_language
        
        if match_criteria:
            query = match_criteria # Apply the matching criteria
        else:
            query = {} # If no criteria, return all

    resources_docs = list(resources_collection.find(query).sort("created_at", -1)) # Sort newest first
    resources_data = [doc_to_dict(res) for res in resources_docs]
    
    return jsonify({"resources": resources_data, "success": True}), 200

# --- Cultural Confidence Corner Routes ---

@app.route('/api/confidence_corner/post', methods=['POST'])
def create_confidence_post():
    global current_user

    if not current_user:
        return jsonify({"message": "Authentication required to post.", "success": False}), 401

    data = request.get_json()
    content = data.get('content')

    if not content:
        return jsonify({"message": "Post content cannot be empty.", "success": False}), 400

    new_post = {
        "user_id": ObjectId(current_user['id']), # Store user_id for moderation, but not displayed
        "user_type": current_user['type'], # Store user_type for moderation context
        "content": content,
        "created_at": datetime.now(),
        "is_reported": False,
        "is_deleted": False # For soft deletion/moderation
    }

    try:
        result = confidence_corner_posts_collection.insert_one(new_post)
        new_post['_id'] = result.inserted_id
        return jsonify({"message": "Post submitted anonymously!", "post": doc_to_dict(new_post), "success": True}), 201
    except Exception as e:
        print(f"Error creating confidence post: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}", "success": False}), 500

@app.route('/api/confidence_corner/posts', methods=['GET'])
def get_confidence_posts():
    global current_user

    if not current_user:
        return jsonify({"message": "Authentication required to view posts.", "success": False}), 401
    
    # By default, only show posts that are not deleted
    query = {"is_deleted": False}

    # If the current user is an alumni, they can see reported posts as well
    # (i.e., we don't filter out reported posts for alumni)
    if current_user['type'] == 'alumni':
        query = {"is_deleted": False} # Alumni still don't see deleted posts, but see reported ones
    
    posts_docs = list(confidence_corner_posts_collection.find(query).sort("created_at", -1)) # Newest first
    posts_data = []
    for post_doc in posts_docs:
        post_data = doc_to_dict(post_doc)
        # IMPORTANT: Anonymize the post for frontend display
        post_data.pop('user_id', None) 
        post_data.pop('user_type', None)
        posts_data.append(post_data)

    return jsonify({"posts": posts_data, "success": True}), 200

@app.route('/api/confidence_corner/report/<string:post_id>', methods=['POST'])
def report_confidence_post(post_id):
    global current_user

    if not current_user:
        return jsonify({"message": "Authentication required to report posts.", "success": False}), 401

    try:
        post_obj_id = ObjectId(post_id)
        post = confidence_corner_posts_collection.find_one({"_id": post_obj_id})

        if not post:
            return jsonify({"message": "Post not found.", "success": False}), 404
        
        # Mark as reported
        confidence_corner_posts_collection.update_one(
            {"_id": post_obj_id},
            {"$set": {"is_reported": True}}
        )
        return jsonify({"message": "Post reported for review.", "success": True}), 200

    except Exception as e:
        print(f"Error reporting post: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}", "success": False}), 500

@app.route('/api/confidence_corner/delete/<string:post_id>', methods=['POST'])
def delete_confidence_post(post_id):
    global current_user

    if not current_user or current_user['type'] != 'alumni':
        return jsonify({"message": "Only alumni can delete posts.", "success": False}), 403

    try:
        post_obj_id = ObjectId(post_id)
        post = confidence_corner_posts_collection.find_one({"_id": post_obj_id})

        if not post:
            return jsonify({"message": "Post not found.", "success": False}), 404
        
        # Soft delete the post
        confidence_corner_posts_collection.update_one(
            {"_id": post_obj_id},
            {"$set": {"is_deleted": True}}
        )
        return jsonify({"message": "Post deleted successfully.", "success": True}), 200

    except Exception as e:
        print(f"Error deleting post: {e}")
        return jsonify({"message": f"An error occurred: {str(e)}", "success": False}), 500


# --- Run the Flask app ---
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=True, host='0.0.0.0', port=port)