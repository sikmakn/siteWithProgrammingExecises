const validityObjs = {
    username: [
        {
            isInvalid: input => input.value.length < 6 | input.value.length > 20,
            element: document.getElementById('usernameSize'),
        },
        {
            isInvalid: input => input.value.match(/[^a-zA-Z0-9]/g),
            element: document.getElementById('usernameLatin'),
        },
    ],
    oldPassword: [
        {
            isInvalid: input => !input.value.length,
            element: document.getElementById('oldPasswordRequired'),
        }
    ],
    password: [
        {
            isInvalid: input => input.value.length < 6 | input.value.length > 20,
            element: document.getElementById('passwordSize'),
        },
        {
            isInvalid: input => !input.value.match(/[A-Z]/g),
            element: document.getElementById('passwordUppercase'),
        },
        {
            isInvalid: input => !input.value.match(/[a-z]/g),
            element: document.getElementById('passwordLowercase'),
        },
        {
            isInvalid: input => !input.value.match(/[0-9]/g),
            element: document.getElementById('passwordNumber'),
        },
        {
            isInvalid: input => input.value.includes(' '),
            element: document.getElementById('passwordNonWhitespace'),
        },
        {
            isInvalid: input => !input.value.match(/[!\@\#\$\%\^\&\*]/g),
            element: document.getElementById('passwordSpecialChar'),
        },
    ],
    repeatPassword: [
        {
            isInvalid: input => input.value !== document.getElementById('password').value,
            element: document.getElementById('repPasswordIsRepeat'),
        },
    ],
    email: [
        {
            isInvalid: input => !/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/.test(input.value),
            element: document.getElementById('emailIsEmail'),
        },
    ],
};