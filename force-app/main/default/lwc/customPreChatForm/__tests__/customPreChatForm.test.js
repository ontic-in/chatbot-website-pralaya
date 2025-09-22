import { createElement } from 'lwc';
import CustomPreChatForm from 'c/customPreChatForm';

// Mock the custom event dispatch
const mockDispatchEvent = jest.fn();

describe('c-custom-pre-chat-form', () => {
    let element;

    // Mock fields array that would be passed by embedded service
    const mockFields = [
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
    ];

    beforeEach(() => {
        element = createElement('c-custom-pre-chat-form', {
            is: CustomPreChatForm
        });
        // Mock the dispatchEvent method
        element.dispatchEvent = mockDispatchEvent;
        
        // Set the fields property
        element.fields = mockFields;
        element.formType = 'PreChat';
        
        document.body.appendChild(element);
        mockDispatchEvent.mockClear();
    });

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
        jest.clearAllMocks();
    });

    describe('Component Initialization', () => {
        it('should render dynamic form fields based on fields property', async () => {
            await Promise.resolve();
            
            const fieldComponents = element.shadowRoot.querySelectorAll('c-custom-pre-chat-form-field');
            expect(fieldComponents.length).toBe(4); // Service_Selection, Name, Email_Address, Phone_Number
        });

        it('should display header message', () => {
            const headerMessage = element.shadowRoot.querySelector('.header-message h3');
            expect(headerMessage.textContent).toBe('Please fill the form to interact with our agent.');
        });

        it('should have submit button disabled initially', () => {
            const submitButton = element.shadowRoot.querySelector('lightning-button[type="submit"]');
            expect(submitButton.disabled).toBe(true);
        });

        it('should have correct fields array structure', () => {
            expect(Array.isArray(element.fields)).toBe(true);
            expect(element.fields).toHaveLength(4);
            expect(element.fields[0].name).toBe('Service_Selection');
            expect(element.fields[1].name).toBe('Name');
            expect(element.fields[2].name).toBe('Email_Address');
            expect(element.fields[3].name).toBe('Phone_Number');
        });
    });

    describe('Dynamic Field Handling', () => {
        it('should handle fieldchange events from child components', async () => {
            const mockFieldChange = {
                detail: {
                    name: 'Name',
                    value: 'John Doe',
                    isValid: true
                }
            };

            element.handleFieldChange(mockFieldChange);
            
            expect(element.formValues['Name']).toBe('John Doe');
        });

        it('should handle service field changes and trigger business logic', async () => {
            const mockServiceChange = {
                detail: {
                    name: 'Service_Selection',
                    value: 'I\'m looking for a job',
                    isValid: true
                }
            };

            element.handleFieldChange(mockServiceChange);
            
            expect(element.formValues['Service_Selection']).toBe('I\'m looking for a job');
            expect(element.showJobSeekerMessage).toBe(true);
        });
    });

    describe('Form Validation', () => {
        it('should validate form based on required fields', () => {
            // Empty form should be invalid
            expect(element.isFormValid).toBe(false);
            
            // Fill all required fields
            element.formValues = {
                'Service_Selection': 'Contract Staffing',
                'Name': 'John Doe',
                'Email_Address': 'john.doe@company.com',
                'Phone_Number': '+971501234567'
            };
            element.hasFormErrors = false;
            
            expect(element.isFormValid).toBe(true);
        });

        it('should be invalid when hasFormErrors is true', () => {
            element.formValues = {
                'Service_Selection': 'Contract Staffing',
                'Name': 'John Doe',
                'Email_Address': 'john.doe@company.com',
                'Phone_Number': '+971501234567'
            };
            element.hasFormErrors = true;
            
            expect(element.isFormValid).toBe(false);
        });
    });

    describe('Business Logic', () => {
        it('should show job seeker message when appropriate service is selected', () => {
            element.handleCustomerJourneyLogic('I\'m looking for a job');
            
            expect(element.showJobSeekerMessage).toBe(true);
            expect(element.showPartnershipMessage).toBe(false);
        });

        it('should show partnership message when appropriate service is selected', () => {
            element.handleCustomerJourneyLogic('Partnership enquiry');
            
            expect(element.showPartnershipMessage).toBe(true);
            expect(element.showJobSeekerMessage).toBe(false);
        });

        it('should hide redirect messages for business services', () => {
            element.handleCustomerJourneyLogic('Contract Staffing');
            
            expect(element.showJobSeekerMessage).toBe(false);
            expect(element.showPartnershipMessage).toBe(false);
        });

        it('should get correct service value from formValues', () => {
            element.formValues['Service_Selection'] = 'Contract Staffing';
            expect(element.serviceValue).toBe('Contract Staffing');
        });
    });

    describe('Form Submission', () => {
        beforeEach(() => {
            // Set up valid form data
            element.formValues = {
                'Service_Selection': 'Contract Staffing',
                'Name': 'John Doe',
                'Email_Address': 'john.doe@company.com',
                'Phone_Number': '+971501234567'
            };
            element.hasFormErrors = false;
        });

        it('should dispatch prechatsubmit event with correct simple object structure', () => {
            element.submitForm();

            expect(mockDispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'prechatsubmit',
                    detail: {
                        'Service_Selection': 'Contract Staffing',
                        'Name': 'John Doe',
                        'Email_Address': 'john.doe@company.com',
                        'Phone_Number': '+971501234567'
                    }
                })
            );
        });

        it('should set loading state during submission', () => {
            element.submitForm();
            
            expect(element.isLoading).toBe(true);
            expect(element.submitButtonLabel).toBe('Starting Chat...');
        });

        it('should not submit form when redirect message is shown', async () => {
            element.showJobSeekerMessage = true;
            
            const form = element.shadowRoot.querySelector('.pre-chat-form');
            if (form) {
                const mockEvent = { preventDefault: jest.fn() };
                element.handleSubmit(mockEvent);
            }

            expect(mockDispatchEvent).not.toHaveBeenCalled();
        });

        it('should handle form submission event', () => {
            const mockEvent = { preventDefault: jest.fn() };
            
            // Mock validateAllFields and make form valid
            element.validateAllFields = jest.fn();
            element.hasFormErrors = false;
            
            element.handleSubmit(mockEvent);
            
            expect(mockEvent.preventDefault).toHaveBeenCalled();
            expect(element.validateAllFields).toHaveBeenCalled();
        });
    });

    describe('Form State Management', () => {
        it('should enable submit button when form is valid and no redirect', () => {
            element.formValues = {
                'Service_Selection': 'Contract Staffing',
                'Name': 'John Doe',
                'Email_Address': 'john.doe@company.com',
                'Phone_Number': '+971501234567'
            };
            element.hasFormErrors = false;
            element.isLoading = false;
            element.showJobSeekerMessage = false;
            element.showPartnershipMessage = false;
            
            expect(element.isSubmitDisabled).toBe(false);
        });

        it('should disable submit button when form is invalid', () => {
            element.formValues = {};
            element.hasFormErrors = false;
            
            expect(element.isSubmitDisabled).toBe(true);
        });

        it('should disable submit button when loading', () => {
            element.formValues = {
                'Service_Selection': 'Contract Staffing',
                'Name': 'John Doe',
                'Email_Address': 'john.doe@company.com',
                'Phone_Number': '+971501234567'
            };
            element.hasFormErrors = false;
            element.isLoading = true;
            
            expect(element.isSubmitDisabled).toBe(true);
        });

        it('should disable submit button when redirect message is shown', () => {
            element.formValues = {
                'Service_Selection': 'I\'m looking for a job',
                'Name': 'John Doe',
                'Email_Address': 'john.doe@gmail.com',
                'Phone_Number': '+971501234567'
            };
            element.hasFormErrors = false;
            element.showJobSeekerMessage = true;
            
            expect(element.isSubmitDisabled).toBe(true);
        });
    });

    describe('API Properties', () => {
        it('should accept fields as @api property', () => {
            const newFields = [
                {
                    name: 'Custom_Field',
                    label: 'Custom Field',
                    type: 'TEXT',
                    required: false,
                    value: ''
                }
            ];
            
            element.fields = newFields;
            expect(element.fields).toEqual(newFields);
            expect(Array.isArray(element.fields)).toBe(true);
        });

        it('should accept formType as @api property', () => {
            element.formType = 'CustomFormType';
            expect(element.formType).toBe('CustomFormType');
        });

        it('should handle empty fields gracefully', () => {
            element.fields = null;
            expect(element.isFormValid).toBe(false);
            
            element.fields = [];
            expect(element.isFormValid).toBe(false);
        });
    });
});