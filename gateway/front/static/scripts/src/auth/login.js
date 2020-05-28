const form = document.getElementById('authForm');
const submit = document.querySelector('input[type="submit"');
submit.addEventListener('click', (e) => {
    if (document.getElementById('fingerprint')) return;
    e.preventDefault();

    Fingerprint2.getPromise({excludes: {touchSupport: true}}).then(components => {
        const values = components.map((component) => component.value);
        const murmur = Fingerprint2.x64hash128(values.join(''), 31);
        const hiddenInput = document.createElement('input');
        hiddenInput.id = 'fingerprint';
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'fingerprint';
        hiddenInput.value = murmur;
        form.appendChild(hiddenInput);
    }).then(() => form.submit());
});
form.addEventListener('submit', validateAll);

function addFingerprintToForm() {
    Fingerprint2.getPromise({excludes: {touchSupport: true}}).then(components => {
        const values = components.map((component) => component.value);
        const murmur = Fingerprint2.x64hash128(values.join(''), 31);
        const hiddenInput = document.createElement('input');
        hiddenInput.id = 'fingerprint';
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'fingerprint';
        hiddenInput.value = murmur;
        form.appendChild(hiddenInput);
    })
}

if (window.requestIdleCallback) {
    requestIdleCallback(addFingerprintToForm);
} else {
    setTimeout(addFingerprintToForm, 500);
}