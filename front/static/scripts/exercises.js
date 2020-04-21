const editors = new Map();
const answers = {
    successId: 3,
    wrongId: 4,
};

const coll = document.getElementsByClassName("collapsible");
for (let i = 0; i < coll.length; i++) {
    coll[i].addEventListener("click", function () {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
            content.style.maxHeight = null;
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            const editorName = content.children[0].id;
            const editor = ace.edit(editorName);
            editor.setTheme("ace/theme/gruvbox");
            editor.session.setMode("ace/mode/javascript");
            editors.set(editorName, editor);
        }
    });
}

async function test(event) {
    const exerciseId = event.target.parentNode.parentNode.parentNode.id;
    const editorName = event.target.parentNode.previousElementSibling.id;
    const sourceCode = editors.get(editorName).getValue();
    const outputDiv = event.target.previousElementSibling;
    outputDiv.innerHTML = null;
    const response = await fetch(`./${exerciseId}/test`,
        {
            method: 'post',
            headers: {'Content-Type': 'application/json;charset=utf-8'},
            body: JSON.stringify({sourceCode}),
        });

    let results = await response.json();
    outResults(results, outputDiv);
}

function outResults(results, outputDiv) {
    let successCount = 0;
    let wrongCount = 0;
    let errorCount = 0;
    for (let result of results) {
        switch (result.resultId) {
            case answers.successId:
                successCount++;
                break;
            case answers.wrongId:
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

    switch (result.resultId) {
        case answers.successId:
            iconDiv.innerHTML = '<i class="fas fa-check successTest"></i>';
            break;
        case answers.wrongId:
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
