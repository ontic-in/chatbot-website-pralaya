import { track, api, LightningElement } from "lwc";

export default class CustomPreChatFormField extends LightningElement {
    choiceListDefaultValue;

    /**
    * Form field data.
    * @type {Object}
    */
    @api fieldInfo = {};

    connectedCallback() {
        console.log('DEBUG: CustomPreChatFormField connectedCallback');
        console.log('DEBUG: fieldInfo received:', JSON.stringify(this.fieldInfo, null, 2));
        console.log('DEBUG: field type:', this.type);
        console.log('DEBUG: isTypeChoiceList:', this.isTypeChoiceList);
        console.log('DEBUG: isTypeCheckbox:', this.isTypeCheckbox);
    }

    @api
    get name() {
        return this.fieldInfo.name;
    }

    @api
    get value() {
        const lightningCmp = this.isTypeChoiceList ? this.template.querySelector("lightning-combobox") : this.template.querySelector("lightning-input");
        return this.isTypeCheckbox ? lightningCmp.checked : lightningCmp.value;
    }

    @api
    reportValidity() {
        const lightningCmp = this.isTypeChoiceList ? this.template.querySelector("lightning-combobox") : this.template.querySelector("lightning-input");

        // Add custom Gmail validation for email fields
        if (this.type === "email" && lightningCmp) {
            if (!this.validateEmailDomain(lightningCmp.value)) {
                return false;
            }
        }

        return lightningCmp.reportValidity();
    }

    /**
     * Validates that email domain is not Gmail
     * @param {string} email - Email address to validate
     * @returns {boolean} - True if valid (not Gmail), false if Gmail
     */
    validateEmailDomain(email) {
        const lightningCmp = this.template.querySelector("lightning-input");
        if (!lightningCmp || !email) {
            return true;
        }

        // Check if email contains @gmail.com
        const isGmail = email.toLowerCase().includes('@gmail.com');

        if (isGmail) {
            lightningCmp.setCustomValidity('Gmail addresses are not allowed');
            lightningCmp.reportValidity();
            return false;
        } else {
            lightningCmp.setCustomValidity('');
            return true;
        }
    }

    /**
     * Handles blur event on email input for real-time validation
     */
    handleEmailBlur(event) {
        if (this.type === "email") {
            this.validateEmailDomain(event.target.value);
        }
    }

    get type() {
        switch (this.fieldInfo.type) {
            case "Phone":
                return "tel";
            case "Text":
            case "Email":
            case "Number":
            case "Checkbox":
            case "ChoiceList":
                return this.fieldInfo.type.toLowerCase();
            default:
                return "text";
        }
    }

    get isTypeCheckbox() {
        return this.type === "Checkbox".toLowerCase();
    }

    get isTypeChoiceList() {
        return this.type === "ChoiceList".toLowerCase();
    }

    /**
    * Formats choiceList options and sets the default value.
    * @type {Array}
    */
    get choiceListOptions() {
        console.log('DEBUG: choiceListOptions getter called');
        console.log('DEBUG: fieldInfo.choiceListValues:', this.fieldInfo.choiceListValues);
        
        let choiceListOptions = [];
        const choiceListValues = [...(this.fieldInfo.choiceListValues || [])];
        choiceListValues.sort((valueA, valueB) => valueA.order - valueB.order);
        for (const listValue of choiceListValues) {
            if (listValue.isDefaultValue) {
                this.choiceListDefaultValue = listValue.choiceListValueName;
            }
            choiceListOptions.push({ label: listValue.label, value: listValue.choiceListValueName });
        }
        console.log('DEBUG: processed choiceListOptions:', choiceListOptions);
        return choiceListOptions;
    }
}