import { createElement } from 'lwc';
import CustomPreChatFormField from 'c/customPreChatFormField';

describe('c-custom-pre-chat-form-field', () => {
    let element;

    afterEach(() => {
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    describe('Text Field Rendering', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
            element.field = {
                name: 'FirstName',
                label: 'First Name',
                type: 'TEXT',
                required: true,
                value: ''
            };
            document.body.appendChild(element);
        });

        it('should render lightning-input for text fields', () => {
            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            const lightningCombobox = element.shadowRoot.querySelector('lightning-combobox');
            
            expect(lightningInput).toBeTruthy();
            expect(lightningCombobox).toBeFalsy();
        });

        it('should display correct label with required indicator', () => {
            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            expect(lightningInput.label).toBe('Name *');
        });

        it('should handle input changes', async () => {
            const mockDispatchEvent = jest.fn();
            element.dispatchEvent = mockDispatchEvent;

            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            lightningInput.dispatchEvent(new CustomEvent('change', {
                detail: { value: 'John Doe' }
            }));

            await Promise.resolve();

            expect(element.fieldValue).toBe('John Doe');
            expect(mockDispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'fieldchange',
                    detail: {
                        name: 'Name',
                        value: 'John Doe',
                        isValid: true
                    }
                })
            );
        });
    });

    describe('Email Field Rendering', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
            element.field = {
                name: 'Email_Address',
                label: 'Email',
                type: 'EMAIL',
                required: true,
                value: ''
            };
            document.body.appendChild(element);
        });

        it('should render lightning-input with email type', () => {
            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            expect(lightningInput.type).toBe('email');
        });

        it('should validate email format', async () => {
            element.fieldValue = 'invalid-email';
            element.validateField();
            await Promise.resolve();

            expect(element.fieldError).toBe('Please enter a valid email address');
        });

        it('should accept valid email format', async () => {
            element.fieldValue = 'user@company.com';
            element.validateField();
            await Promise.resolve();

            expect(element.fieldError).toBe('');
        });
    });

    describe('Phone Field Rendering', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
            element.field = {
                name: 'Phone_Number',
                label: 'Phone',
                type: 'PHONE',
                required: true,
                value: ''
            };
            document.body.appendChild(element);
        });

        it('should render lightning-input with tel type', () => {
            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            expect(lightningInput.type).toBe('tel');
        });

        it('should display help text for phone fields', () => {
            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            expect(lightningInput.fieldLevelHelp).toBe('Enter with country code (e.g., +971501234567)');
        });

        it('should validate phone format', async () => {
            element.fieldValue = '1234567890';
            element.validateField();
            await Promise.resolve();

            expect(element.fieldError).toBe('Please enter a valid international phone number (e.g., +971501234567)');
        });

        it('should accept valid international phone format', async () => {
            element.fieldValue = '+971501234567';
            element.validateField();
            await Promise.resolve();

            expect(element.fieldError).toBe('');
        });
    });

    describe('Choice List Field Rendering', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
            element.field = {
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
            };
            document.body.appendChild(element);
        });

        it('should render lightning-combobox for choice list fields', () => {
            const lightningCombobox = element.shadowRoot.querySelector('lightning-combobox');
            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            
            expect(lightningCombobox).toBeTruthy();
            expect(lightningInput).toBeFalsy();
        });

        it('should have correct options', () => {
            const lightningCombobox = element.shadowRoot.querySelector('lightning-combobox');
            expect(lightningCombobox.options).toEqual(element.field.choiceList);
        });

        it('should handle selection changes', async () => {
            const mockDispatchEvent = jest.fn();
            element.dispatchEvent = mockDispatchEvent;

            const lightningCombobox = element.shadowRoot.querySelector('lightning-combobox');
            lightningCombobox.dispatchEvent(new CustomEvent('change', {
                detail: { value: 'Contract Staffing' }
            }));

            await Promise.resolve();

            expect(element.fieldValue).toBe('Contract Staffing');
            expect(mockDispatchEvent).toHaveBeenCalledWith(
                expect.objectContaining({
                    type: 'fieldchange',
                    detail: {
                        name: 'Service_Selection',
                        value: 'Contract Staffing',
                        isValid: true
                    }
                })
            );
        });
    });

    describe('Field Validation', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
            element.field = {
                name: 'FirstName',
                label: 'First Name',
                type: 'TEXT',
                required: true,
                value: ''
            };
            document.body.appendChild(element);
        });

        it('should validate required fields', async () => {
            element.fieldValue = '';
            element.validateField();
            await Promise.resolve();

            expect(element.fieldError).toBe('Name is required');
        });

        it('should validate required fields with whitespace', async () => {
            element.fieldValue = '   ';
            element.validateField();
            await Promise.resolve();

            expect(element.fieldError).toBe('Name is required');
        });

        it('should clear error for valid input', async () => {
            element.fieldValue = 'John Doe';
            element.validateField();
            await Promise.resolve();

            expect(element.fieldError).toBe('');
        });

        it('should handle blur validation', async () => {
            const lightningInput = element.shadowRoot.querySelector('lightning-input');
            
            element.fieldValue = '';
            lightningInput.dispatchEvent(new CustomEvent('blur'));
            await Promise.resolve();

            expect(element.fieldError).toBe('Name is required');
        });
    });

    describe('Business Email Validation', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
            element.field = {
                name: 'Email_Address',
                label: 'Email',
                type: 'EMAIL',
                required: true,
                value: ''
            };
            document.body.appendChild(element);
        });

        it('should validate business email for non-job seeker services', async () => {
            element.fieldValue = 'user@gmail.com';
            element.validateFromParent('Contract Staffing');
            await Promise.resolve();

            expect(element.fieldError).toBe('Please use your business email address');
        });

        it('should allow personal email for job seekers', async () => {
            element.fieldValue = 'user@gmail.com';
            element.validateFromParent('I\'m looking for a job');
            await Promise.resolve();

            expect(element.fieldError).toBe('');
        });

        it('should allow personal email for partnership inquiries', async () => {
            element.fieldValue = 'user@yahoo.com';
            element.validateFromParent('Partnership enquiry');
            await Promise.resolve();

            expect(element.fieldError).toBe('');
        });
    });

    describe('Public API Methods', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
            element.field = {
                name: 'FirstName',
                label: 'First Name',
                type: 'TEXT',
                required: true,
                value: ''
            };
            document.body.appendChild(element);
        });

        it('should return field data via getFieldData method', () => {
            element.fieldValue = 'John Doe';
            element.fieldError = '';

            const fieldData = element.getFieldData();

            expect(fieldData).toEqual({
                name: 'Name',
                value: 'John Doe',
                isValid: true,
                error: ''
            });
        });

        it('should return invalid field data when there are errors', () => {
            element.fieldValue = '';
            element.fieldError = 'Name is required';

            const fieldData = element.getFieldData();

            expect(fieldData).toEqual({
                name: 'Name',
                value: '',
                isValid: false,
                error: 'Name is required'
            });
        });

        it('should validate from parent and return validation status', () => {
            element.fieldValue = 'John Doe';
            
            const isValid = element.validateFromParent();
            
            expect(isValid).toBe(true);
            expect(element.fieldError).toBe('');
        });
    });

    describe('Computed Properties', () => {
        beforeEach(() => {
            element = createElement('c-custom-pre-chat-form-field', {
                is: CustomPreChatFormField
            });
        });

        it('should correctly identify choice list fields', () => {
            element.field = {
                choiceList: [{ label: 'Option 1', value: 'value1' }]
            };
            expect(element.isChoiceList).toBe(true);

            element.field = { choiceList: [] };
            expect(element.isChoiceList).toBe(false);

            element.field = {};
            expect(element.isChoiceList).toBe(false);
        });

        it('should correctly identify required fields', () => {
            element.field = { required: true };
            expect(element.isRequired).toBe(true);

            element.field = { required: false };
            expect(element.isRequired).toBe(false);

            element.field = {};
            expect(element.isRequired).toBe(false);
        });

        it('should map field types correctly', () => {
            element.field = { type: 'EMAIL' };
            expect(element.fieldType).toBe('email');

            element.field = { type: 'PHONE' };
            expect(element.fieldType).toBe('tel');

            element.field = { type: 'TEXT' };
            expect(element.fieldType).toBe('text');
        });

        it('should apply error CSS class when there are errors', () => {
            element.fieldError = 'Some error';
            expect(element.fieldClass).toBe('field-error');

            element.fieldError = '';
            expect(element.fieldClass).toBe('');
        });
    });
});