const editors = new Map();

function collapsibleClick(event, lang) {
    event.target.classList.toggle("active");
    const content = event.target.nextElementSibling;
    if (content.style.maxHeight) {
        content.style.maxHeight = null;
    } else {
        content.style.maxHeight = content.scrollHeight + "px";
        const editorName = content.children[0].id;
        createAceEditor(editorName, lang);
    }
}

function createAceEditor(editorName, lang) {
    const editor = ace.edit(editorName);
    editor.setTheme(aceOptions.theme);
    editor.session.setMode(aceOptions.mods[lang]);
    editors.set(editorName, editor);
}

function test(event) {
    const paths = window.location.toString().split('/');
    const themeId = paths[paths.length - 2];
    const exerciseId = event.target.parentNode.parentNode.parentNode.id;
    const editorName = event.target.parentNode.previousElementSibling.id;
    const sourceCode = editors.get(editorName).getValue();
    const outputDiv = event.target.previousElementSibling;
    outputDiv.innerHTML = null;
    fetch(`/exercises/${exerciseId}/test`,
        {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({sourceCode, themeId, difficulty: paths[paths.length - 1]}),
        })
        .then(res => res.json())
        .then(res => outResults(res, outputDiv));
}

function outResults(results, outputDiv) {
    let successCount = 0;
    let wrongCount = 0;
    let errorCount = 0;
    for (let result of results) {
        switch (result.resultName) {
            case aceOptions.answers.success:
                successCount++;
                break;
            case aceOptions.answers.wrong:
                wrongCount++;
                break;
            default:
                errorCount++;
                break;
        }
        outResultOfTest(result, outputDiv);
    }
    outResultStatistic(successCount, wrongCount, errorCount, outputDiv);
}

function outResultStatistic(successCount, wrongCount, errorCount, outputDiv) {
    const statisticResultDiv = document.createElement('div');
    statisticResultDiv.classList.add('testOut');
    statisticResultDiv.classList.add('headerTestResults');

    createStatisticIconDiv(successCount, wrongCount, errorCount, statisticResultDiv);

    const stdinDiv = creatTextTestDiv();
    stdinDiv.innerHTML = "INPUT";
    statisticResultDiv.append(stdinDiv);

    const stdoutDiv = creatTextTestDiv();
    stdoutDiv.innerHTML = "OUTPUT";
    statisticResultDiv.append(stdoutDiv);

    outputDiv.insertBefore(statisticResultDiv, outputDiv.firstChild);
}

function createStatisticIconDiv(successCount, wrongCount, errorCount, outDiv) {
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('testStatistic');
    iconDiv.innerHTML = `<span class="successTest">${successCount}</span>`;
    iconDiv.innerHTML += `<span class="wrongTest">${wrongCount}</span>`;
    iconDiv.innerHTML += `<span class="errorTest">${errorCount}</span>`;
    outDiv.append(iconDiv);
}

function creatTextTestDiv() {
    const stdinDiv = document.createElement('div');
    stdinDiv.classList.add('textTestResult');
    return stdinDiv;
}

function outResultOfTest(result, outputDiv) {
    const outDiv = document.createElement('div');
    outDiv.classList.add('testOut');

    addIconResult(result, outDiv);
    const inputDiv = addTextTestResultDiv(result.stdin || '-');
    inputDiv.classList.add('inputTestResult');
    outDiv.append(inputDiv);

    const outTestDiv = addTextTestResultDiv(result.stdout || '-');
    outDiv.append(outTestDiv);

    outputDiv.append(outDiv);
}

function addIconResult(result, outDiv) {
    const iconDiv = document.createElement('div');
    iconDiv.classList.add('iconTestResult');

    switch (result.result) {
        case aceOptions.answers.success:
            iconDiv.innerHTML = '<i class="fas fa-check successTest"></i>';
            break;
        case aceOptions.answers.wrong:
            iconDiv.innerHTML = '<i class="fas fa-times wrongTest"></i>';
            break;
        default:
            iconDiv.innerHTML = '<i class="fas fa-question errorTest"></i>';
            break;
    }
    outDiv.append(iconDiv);
}

function addTextTestResultDiv(result) {
    const inputDiv = creatTextTestDiv();
    inputDiv.innerHTML = result;
    return inputDiv;
}
