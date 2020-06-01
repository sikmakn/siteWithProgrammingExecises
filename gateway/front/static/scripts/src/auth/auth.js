import {Validator} from './validate/validator.js';

validate(['username', 'password', 'repeatPassword', 'email']);

function validate(fields) {
    const validators = makeValidators(fields);
    const form = document.getElementById('form');
    const submit = document.querySelector('input[type="submit"');
    submit.addEventListener('click', e => validateAll(e, validators));
    form.addEventListener('submit', e => validateAll(e, validators));
}

function makeValidators(fields) {
    const validators = fields.map(f => Validator.getValidator(f).validator);
    validators.forEach(v => v.registerListeners());
    return validators;
}

function validateAll(event, validators) {
    if (validators.some(v => !v.validate()))
        event.preventDefault();
}