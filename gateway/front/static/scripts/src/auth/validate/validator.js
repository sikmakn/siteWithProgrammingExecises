import {validityObjs} from "./validationRequirements.js";

export class Validator {
    constructor(input, validityArr) {
        this.input = input;
        this.validityArr = validityArr;
    }

    static getValidator(name) {
        const input = document.getElementById(name);
        return {
            input,
            validator: new Validator(input, validityObjs[name])
        };
    }

    validate() {
        for (let validity of this.validityArr) {
            if (validity.isInvalid(this.input)) {
                this._addValidationInputCss(false);
                this._addValidationCss(validity.element, false);
                return false;
            }
            this._addValidationCss(validity.element);
        }
        this._addValidationInputCss();
        return true;
    }

    registerListeners() {
        this.input.addEventListener('keyup', () => this.validate())
    }

    registerRequiredListeners() {
        this.input.addEventListener('keyup', () => {
            if (this.input.value) {
                this.validate();
                return;
            }
            this._removeValidationInputCss();
            this.validityArr.forEach(v => this._removeValidationElementCss(v.element))
        })
    }

    _removeValidationElementCss(element) {
        element.classList.remove('valid');
        element.classList.remove('invalid');
    }

    _removeValidationInputCss() {
        this.input.classList.remove('invalidInput');
        this.input.classList.remove('validInput');
    }

    _addValidationInputCss(isValid = true) {
        if (isValid) {
            this.input.classList.add('validInput');
            this.input.classList.remove('invalidInput');
            return;
        }
        this.input.classList.remove('validInput');
        this.input.classList.add('invalidInput');
    }

    _addValidationCss(element, isValid = true) {
        if (isValid) {
            element.classList.add('valid');
            element.classList.remove('invalid');
            return;
        }
        element.classList.add('invalid');
        element.classList.remove('valid');
    }
}