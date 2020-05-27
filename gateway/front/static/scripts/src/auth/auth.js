const form = document.getElementById('authForm');
const submit = document.querySelector('input[type="submit"');

const validators = makeValidators();
submit.addEventListener('click', validateAll);
form.addEventListener('submit', validateAll);

function makeValidators() {
    const validators = [];
    addValidator(validators, 'username');
    addValidator(validators, 'password');
    addValidator(validators, 'repeatPassword');
    addValidator(validators, 'email');
    validators.forEach(v => v.registerListeners());
    return validators;
}

function addValidator(validators, name) {
    const input = document.getElementById(name);
    const newValidator = new Validator(input, validityObjs[name]);
    validators.push(newValidator);
}

function validateAll(event) {
    let result = true;
    for (let validator of validators) {
        if (!validator.validate()) {
            result = false;
            break;
        }
    }
    if (!result) event.preventDefault();
}