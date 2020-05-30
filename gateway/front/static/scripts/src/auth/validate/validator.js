export class Validator {
    constructor(input, validityArr) {
        this.input = input;
        this.validityArr = validityArr;
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