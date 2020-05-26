const authForm = document.getElementById('authForm');
authForm.onclick = ()=> {
    const usernameInput = document.getElementById('username');
    if (usernameInput.validity.patternMismatch) {
        const message = "Имя пользователя должно состоять не менее чем из 6 английсских букв либо цифр";
        usernameInput
            .setCustomValidity(message);
        usernameInput.insertAdjacentHTML('afterend', `<p class="error-message">${message}</p>`)
    }

    const passwordInput = document.getElementById('password');
    if (passwordInput.validity.patternMismatch) {
        const message = "Пароль должен состоять не менее чем из 6 английсских букв либо цифр";
        passwordInput
            .setCustomValidity(message);
        passwordInput.insertAdjacentHTML('afterend', `<p class="error-message">${message}</p>`)
    }

    const repeatPasswordInput = document.getElementById('repeatPassword');
    if (repeatPasswordInput.validity.patternMismatch || passwordInput.value !== repeatPasswordInput.value) {
        const message = "Оба пароля должны совпадать";
        repeatPasswordInput
            .setCustomValidity(message);
        repeatPasswordInput.insertAdjacentHTML('afterend', `<p class="error-message">${message}</p>`)
    }

    const emailInput = document.getElementById('email');
    if (emailInput.validity.patternMismatch) {
        const message = "Оба пароля должны совпадать";
        emailInput
            .setCustomValidity(message);
        repeatPasswordInput.insertAdjacentHTML('afterend', `<p class="error-message">${message}</p>`)
    }
};