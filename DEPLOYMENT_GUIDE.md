# Custom Pre-Chat Form LWC - Deployment Guide

## Overview
This custom Lightning Web Component replaces the standard pre-chat form in Salesforce Embedded Service Deployments, following the official Salesforce documentation structure exactly.

## Component Structure

### Main Components
1. **customPreChatForm** - Parent component with @api fields property
2. **customPreChatFormField** - Child component for rendering individual fields

### Key Features
- ✅ Dynamic field rendering based on Embedded Service configuration
- ✅ Correct @api fields property (array structure)
- ✅ Simple key-value event payload structure
- ✅ Exact implementation per Salesforce documentation

## Deployment Steps

### Step 1: Deploy Components to Org
```bash
sfdx force:source:push
```

### Step 2: Configure Pre-Chat Fields in Embedded Service Deployment

1. Go to **Setup** → **Embedded Service Deployments**
2. Edit your "PreChat" deployment
3. Configure pre-chat fields:
   - **Service Field**: Custom field `Service_Selection` (Picklist)
     - Add all required service options from business requirements
   - **Name Field**: Custom field `Name` 
   - **Email Field**: Custom field `Email_Address`
   - **Phone Field**: Custom field `Phone_Number`

### Step 3: Select Custom Pre-Chat Form

1. In Embedded Service Deployment settings
2. Go to **Pre-Chat** section
3. Select **"Custom Pre-Chat Form"**
4. Choose `customPreChatForm` component
5. Save and republish deployment

### Step 4: Field Configuration Example

The component expects fields as an array in this format:
```javascript
[
    {
        name: 'Service_Selection',
        label: 'Service',
        type: 'PICKLIST',
        required: true,
        value: '',
        choiceList: [
            { label: 'Contract Staffing', value: 'Contract Staffing' },
            { label: 'Partnership enquiry', value: 'Partnership enquiry' },
            { label: 'I\'m looking for a job', value: 'I\'m looking for a job' }
            // ... other service options
        ]
    },
    {
        name: 'Name',
        label: 'Name',
        type: 'TEXT',
        required: true,
        value: ''
    },
    {
        name: 'Email_Address',
        label: 'Email',
        type: 'EMAIL',
        required: true,
        value: ''
    },
    {
        name: 'Phone_Number',
        label: 'Phone',
        type: 'PHONE', 
        required: true,
        value: ''
    }
]
```

## Event Structure

The component dispatches the correct event structure per Salesforce documentation:

**Event Name**: `'preChatSubmit'` (note the capital C)

**Payload Structure**:
```javascript
{
    'Service_Selection': 'Contract Staffing',
    'Name': 'John Doe',
    'Email_Address': 'john.doe@company.com',
    'Phone_Number': '+971501234567'
}
```

## Business Logic Features

### Customer Journey Routing
- **Job Seekers**: Shows careers page redirect (no chat initiation)
- **Partnership Inquiries**: Shows contact email (no chat initiation)
- **Business Services**: Proceeds to chat with lead creation

### Validation Rules
- **Email Validation**: Blocks personal domains (Gmail, Yahoo, etc.) for business services
- **Phone Validation**: Requires international format (+country code)
- **Real-time Validation**: Immediate feedback on field changes
- **Required Field Validation**: Enforced before submission

## Testing

### Run Unit Tests
```bash
npm test -- --testPathPattern=customPreChat
```

### Test Coverage
- Component initialization and rendering
- Dynamic field handling
- Form validation (all scenarios)
- Business logic routing
- Event dispatch structure
- API property handling

## Integration Verification

1. **Deploy to test website/community**
2. **Verify form renders with configured fields**
3. **Test all validation scenarios**
4. **Verify customer journey routing**
5. **Check agent receives pre-chat data correctly**

## Troubleshooting

### Common Issues

1. **Fields not rendering**: Check Embedded Service field configuration
2. **Event not dispatched**: Verify form validation passes
3. **Agent not receiving data**: Check field name mapping in deployment
4. **Styling issues**: Verify CSS is properly scoped

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify component is selected in Embedded Service settings
3. Test with simple field configuration first
4. Validate field API names match component expectations

## Next Steps

After successful deployment:
1. Monitor form completion rates
2. Gather user feedback on UX
3. Test performance on mobile devices
4. Verify lead creation and routing works correctly
5. Train agents on new pre-chat data format

## Support

For issues or questions:
1. Check Salesforce official documentation
2. Review component test cases for expected behavior
3. Verify Embedded Service Deployment configuration
4. Test with minimal field configuration to isolate issues