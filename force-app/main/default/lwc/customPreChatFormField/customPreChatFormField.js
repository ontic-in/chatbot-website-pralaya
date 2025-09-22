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
        return lightningCmp.reportValidity();
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