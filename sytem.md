To build a structured, real-time civic awareness platform that enables users to
report and discover live infrastructure and public service conditions using verified
visual evidence (photo/video), organized strictly by administrative hierarchy (City
→ Area).


3. Scope Definition (MVP)
3.1 Allowed Categories
A. Roads & Transportation
Traffic congestion
Road damage
Flooding
Construction blockage
B. Public Services
Untitled 3
Power outage
Water shortage
Hospital congestion
Government office delays
C. Business Conditions (Evidence-Based Only)
Hygiene issues
Overcrowding
Closed/unavailable status
3.2 Explicitly Excluded
Political content
Religious content
Entertainment content
Personal attacks
Opinion-only submissions without media evidence
4. System Structure (Non-Geospatial
Model)
Reports are organized using structured administrative tagging:
Country
└── City
 └── Area / Sub-city
 └── Optional Specific Place Name
Each report must include:
City
Untitled 4
Area
Category
Media evidence
No GPS coordinates or radius-based filtering.
5. Functional Requirements
5.1 User Management
Registration & login
JWT-based authentication
Role-based access control:
User
Admin
Super Admin
Profile management
Account suspension/ban
Password reset
5.2 Report Creation
Required Fields
Title
Description
Category
Urgency Level (Info / Warning / Critical)
City
Area
Untitled 5
At least one image or video
Auto-generated timestamp
Optional Fields
Specific place name
Business rating (business category only)
System Rules
Max video length (default: 30s)
Allowed file formats enforced
Media compression
Thumbnail generation
Duplicate detection
Empty submission rejection
5.3 Report Lifecycle
States
Published
Under Review
Removed
Verified
Time-Sensitive Handling
Auto-expiry (configurable hours)
Archiving with search availability
5.4 Multi-Search System (Text-Based)
Untitled 6
Keyword Search
Title
Description
Place name
Filters
Category
Urgency
City
Area
Date range
Media type
Status
Sorting
Most recent
Most urgent
Highest confidence
Most validated
No geospatial search capability.
5.5 Trust & Validation System
Each report displays:
Real votes
Fake votes
Confidence score
Confidence Score Factors
Untitled 7
Vote ratio
Reporter trust score
Report age
Counter-reports
User Trust Score Increases When
Reports validated
Low removal rate
Low violation history
Low-Trust Restrictions
Reduced visibility
Higher moderation threshold
Posting frequency limits
5.6 Moderation System
Automated Moderation
Profanity detection
Spam detection
Duplicate detection
Media validation
Manual Moderation Flow
1. Report flagged
2. Admin review
3. Action:
Approve
Untitled 8
Remove
Ban
Mark verified
4. Action logged with mandatory reason
All actions recorded in audit logs.
5.7 Subscription & Notification System
Users may subscribe to:
City
Specific Area
Category within Area
Trigger Events
Critical reports
Verified reports
High-confidence reports
No GPS-based notifications.
6. Non-Functional Requirements
Performance
Report submission < 3s
Search < 300ms average
Async media processing
Concurrent user support
Scalability
Untitled 9
Horizontal backend scaling
Queue-based media pipeline
CDN-backed delivery
Stateless API design
Security
JWT authentication
Role-based authorization
Rate limiting
Secure file validation
Input sanitization
Secure hashing (bcrypt/argon2)
Full audit logging
Reliability
Automated backups
Centralized logging
Monitoring & alerts
Graceful failure handling
Governance
Clear content policy enforcement
Appeal process
Data deletion requests
Configurable retention policy