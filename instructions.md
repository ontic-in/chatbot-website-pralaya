Agent Pre-Chat Form - Business Requirements Document
1. Purpose
The agent pre-chat form collects customer information before they start chatting with our support team. This ensures our agents have the necessary details to provide better service.
2. Form Fields Required
2.1 Service Selection
Type: Dropdown menu
Required: Yes
Description: Customer selects the service they need help with
Options:
Contract Staffing
Permanent Hiring
PEO/EOR Services
Recruitment Process Outsourcing
Payroll Outsourcing
Emiratisation
Temporary Staffing
Remote Hiring
HR Operations Outsourcing
GRO-PRO Outsourcing
Business/Company Setup Services
Permanent Residency
KSA Office Space
Partnership enquiry
I'm looking for a job
2.2 Customer Name
Type: Text field
Required: Yes
Description: Customer enters their full name
Validation: Must not be empty
2.3 Email Address
Type: Email field
Required: Yes
Description: Customer's business email address
Validation Rules:
Must be a valid email format
Must be a business email (no personal emails like Gmail, Yahoo, etc.)
Exception: Personal emails allowed for "Partnership enquiry" and "I'm looking for a job"
Error Message: "Please use your business email address" when personal email is used
2.4 Phone Number
Type: Phone field
Required: Yes
Description: Customer's contact number with country code
Format: Must start with + followed by country code and phone number (e.g., +971501234567)
Validation: Must be between 7-16 digits total including country code
3. Form Behavior
3.1 Real-Time Validation
Show error messages immediately when customer enters invalid information
Don't wait until form submission to show errors
Submit button should be disabled until all fields are valid
3.2 Loading State
Show "Starting Chat..." message with loading indicator when customer clicks submit
Prevent multiple form submissions while processing
4. Different Customer Journeys
4.1 Job Seekers
When: Customer selects "I'm looking for a job"
Action: Don't start chat, instead show message directing them to careers page
Message: "For job opportunities, please visit our careers page where you can submit your CV."
Show Link: show a dummy link.
4.2 Partnership Inquiries
When: Customer selects "Partnership enquiry"
Action: Don't start chat, instead show contact information
Message: "For partnership inquiries, please contact us at info@tascoutsourcing.com"
4.3 Business Services
When: Customer selects any other service
Action: Create customer record and start chat session
Data Passed: All form information provided to agent
5. Data Storage
All form submissions should create a new lead record in our system
Lead should contain: Customer name, email, phone, and selected service
Service field should use the exact values from our lead management system
6. User Experience Requirements
6.1 Visual Design
Clean, professional appearance
Mobile-friendly (works on phones and tablets)
Clear labels for all fields
Red asterisk (*) to mark required fields
6.2 Error Handling
Show helpful error messages in plain language
Highlight fields with errors in red
Keep previous entries when showing errors (don't clear the form)
6.3 Success Feedback
Show confirmation when form is successfully submitted
Provide clear next steps to the customer


8. Business Rules
8.1 Email Validation
Block common personal email providers (Gmail, Yahoo, Hotmail, etc.)
Allow personal emails only for job seekers and partnership inquiries
Show helpful message explaining business email requirement
8.2 Phone Number Standards
Enforce international format to ensure we can contact customers
Accept all country codes but require proper formatting
8.3 Service Selection Logic
All service options available in dropdown
Customer manually selects appropriate service
No pre-selection based on webpage
9. Success Criteria
Form completion rate above 85%
Valid contact information provided in 95% of submissions
Smooth transition to chat for business service inquiries
Appropriate routing of job seekers and partnership inquiries
Mobile completion rate matches desktop completion rate
10. Form Labels and Messages
10.1 Field Labels
Service: "Service *"
Name: "Name *"
Email: "Email *"
Phone: "Phone *"
10.2 Button Text
Submit: "Start Chat →"
Loading: "Starting Chat..."
10.3 Help Text
Phone field: "Enter with country code (e.g., +971501234567)"
10.4 Header Message
"Please fill the form to interact with our agent."
11. Agent Setup and Deployment Requirements
11.1 Agent Creation
Create a new chat agent in our system
Configure agent with appropriate skills and knowledge base
Set up agent routing rules for different service types
Configure agent availability and working hours
11.2 Website Development
Create a dummy/test website for agent deployment
Website should have multiple pages representing different services
Include contact pages and service-specific landing pages
Ensure website is mobile-responsive
11.3 Agent Integration
Deploy the chat agent on the dummy website
Integrate the pre-chat form with the agent
Test form data passing to agent interface
Verify agent receives customer information correctly
11.4 End-to-End Testing Environment
Complete customer journey testing from website to agent
Test different service selection scenarios
Verify lead creation and agent notification
Test redirect scenarios for job seekers and partnerships
12. Testing Requirements
12.1 Component Testing
Write Jest unit tests for the form component
Test all form field validations
Test form submission scenarios
Test error handling and display
Test loading states and user interactions
12.2 Test Scenarios to Cover
Form Validation Tests:
Required field validation for all fields
Email format validation
Business email validation rules
Phone number format validation
Service selection validation
User Interaction Tests:
Form field input handling
Submit button enable/disable logic
Error message display and clearing
Loading state during form submission
Business Logic Tests:
Job seeker redirect functionality
Partnership inquiry redirect functionality
Business service form submission
Lead creation data formatting
Error Handling Tests:
Network error scenarios
Invalid input handling
Form reset after errors
12.3 Test Coverage Requirements
Minimum 95% code coverage
All user-facing functionality must be tested
All validation rules must have corresponding tests
All error scenarios must be tested
Note: All form data should integrate with our existing lead management system using standard lead field values.


