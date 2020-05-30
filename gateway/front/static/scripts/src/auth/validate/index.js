import {Validator} from './validator.js';
import {validityObjs} from './validationRequirements.js';

export function validate(fields) {
    const validators = makeValidators(fields);
    const form = document.getElementById('form');
    const submit = document.querySelector('input[type="submit"');
    submit.addEventListener('click', e => validateAll(e, validators));
    form.addEventListener('submit', e => validateAll(e, validators));
}


function makeValidators(fields) {
    const validators = fields.map(f => addValidator(f));
    validators.forEach(v => v.registerListeners());
    return validators;
}

function addValidator(name) {
    const input = document.getElementById(name);
    return new Validator(input, validityObjs[name]);
}

function validateAll(event, validators) {
    let result = true;
    for (let validator of validators) {
        if (!validator.validate()) {
            result = false;
            break;
        }
    }
    if (!result) event.preventDefault();
}