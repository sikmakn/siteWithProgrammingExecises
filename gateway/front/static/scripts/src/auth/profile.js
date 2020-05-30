import {Validator} from "./validate/validator.js";

const {input: email, validator: emailValidator} = Validator.getValidator('email');
emailValidator.registerListeners();
const {input: oldPassword, validator: oldPasswordValidator} = Validator.getValidator('oldPassword');
oldPasswordValidator.registerRequiredListeners();
const {input: password, validator: passwordValidator} = Validator.getValidator('password');
passwordValidator.registerRequiredListeners();
const {input: repeatPassword, validator: repeatPasswordValidator} = Validator.getValidator('repeatPassword');
repeatPasswordValidator.registerRequiredListeners();

const form = document.getElementById('form');
const submit = document.querySelector('input[type="submit"');
submit.addEventListener('click', validateAll);
form.addEventListener('submit', validateAll);

function validateAll(e) {
    let result = true;
    if (oldPassword.value || password.value || repeatPassword.value) {
        result = result && oldPasswordValidator.validate();
        result = result && passwordValidator.validate();
        result = result && repeatPasswordValidator.validate();
    }
    if (email.value) {
        result = result && emailValidator.validate();
    }
    if (!result) e.preventDefault();
}