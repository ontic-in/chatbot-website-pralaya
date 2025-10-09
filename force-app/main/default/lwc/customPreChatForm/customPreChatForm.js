import { track, api, LightningElement } from "lwc";

export default class CustomPreChatForm extends LightningElement {
    /**
    * Deployment configuration data....
    * @type {Object}
    */
    @api configuration = {};

    startConversationLabel;

    isSubmitButtonDisabled = false;

    get prechatForm() {
        const forms = this.configuration.forms || [];
        console.log('DEBUG: prechatForm getter - forms array:', forms);
        const prechatForm = forms.find(form => form.formType === "PreChat") || {};
        console.log('DEBUG: prechatForm getter - found form:', prechatForm);
        return prechatForm;
    }

    get prechatFormFields() {
        const fields = this.prechatForm.formFields || [];
        console.log('DEBUG: prechatFormFields getter - fields:', fields);
        return fields;
    }

    /**
    * Returns pre-chat form fields sorted by their display order.
    * @type {Object[]}
    */
    get fields() {
        console.log('DEBUG: fields getter called');
        let fields =  JSON.parse(JSON.stringify(this.prechatFormFields));
        console.log('DEBUG: fields getter - before processing:', fields);
        
        // Fallback fields for testing if no configuration fields found
        if (fields.length === 0) {
            console.log('DEBUG: No configuration fields found, using fallback fields');
            fields = [
                { 
                    name: 'Service_Selection', 
                    labels: { display: 'Service' },
                    type: 'Text', 
                    required: true,
                    order: 1
                },
                { 
                    name: 'Name', 
                    labels: { display: 'Name' },
                    type: 'Text', 
                    required: true,
                    order: 2
                },
                { 
                    name: 'Email_Address', 
                    labels: { display: 'Email' },
                    type: 'Email', 
                    required: true,
                    order: 3
                },
                { 
                    name: 'Phone_Number', 
                    labels: { display: 'Phone' },
                    type: 'Phone', 
                    required: true,
                    order: 4
                }
            ];
        }
        
        this.addChoiceListValues(fields);
        const sortedFields = fields.sort((fieldA, fieldB) => fieldA.order - fieldB.order);
        console.log('DEBUG: fields getter - final sorted fields:', sortedFields);
        return sortedFields;
    }

    connectedCallback() {
        this.startConversationLabel = "Start Conversation";
        
        // Debug logging
        console.log('DEBUG: CustomPreChatForm connectedCallback');
        console.log('DEBUG: configuration object:', JSON.stringify(this.configuration, null, 2));
        console.log('DEBUG: prechatForm:', JSON.stringify(this.prechatForm, null, 2));
        console.log('DEBUG: prechatFormFields:', JSON.stringify(this.prechatFormFields, null, 2));
        console.log('DEBUG: processed fields:', JSON.stringify(this.fields, null, 2));
    }

    /**
    * Adds values to choiceList (dropdown) fields.
    */
    addChoiceListValues(fields) {
        for (let field of fields) {
            if (field.type === "ChoiceList") {
                const valueList = this.configuration.choiceListConfig.choiceList.find(list => list.choiceListId === field.choiceListId) || {};
                field.choiceListValues = valueList.choiceListValues || [];
            }
        }
    }

    /**
    * Iterates over and validates each form field. Returns true if all the fields are valid.
    * @type {boolean}
    */
    isValid() {
        let isFormValid = true;
        this.template.querySelectorAll("c-custom-pre-chat-form-field").forEach(formField => {
            if (!formField.reportValidity()) {
                isFormValid = false;
            }
        });
        return isFormValid;
    }

    /**
    * Gathers and submits pre-chat data to the app on start-conversation-button click.
    * @type {boolean}
    */
    onStartConversationClick() {
        const prechatData = {};
        if (this.isValid()) {
            this.template.querySelectorAll("c-custom-pre-chat-form-field").forEach(formField => {
                prechatData[formField.name] = String(formField.value);
            });

            this.isSubmitButtonDisabled = true;

            this.dispatchEvent(new CustomEvent(
                "prechatsubmit",
                {
                    detail: { value: prechatData }
                }
            ));
        }
    }
}