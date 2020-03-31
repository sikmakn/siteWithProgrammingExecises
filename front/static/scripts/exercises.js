const editors = new Map();
const answers = {
    successId: 3,
    wrongId: 4,
};
const messageColors = {
    success: "green",
    wrong: "red",
    error: "yellow",
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
    for (let resultKey in results) {
        const outDiv = document.createElement('div');
        const result = results[resultKey];
        switch (result.id) {
            case answers.successId:
                outDiv.style.color = messageColors.success;
                break;
            case answers.wrongId:
                outDiv.style.color = messageColors.wrong;
                break;
            default:
                outDiv.style.color = messageColors.error;
        }
        outDiv.innerHTML = `${resultKey} : ${results[resultKey].description}`;
        outputDiv.append(outDiv);
    }
}

//  gruvbox katzelmitch kurior sqlserver tomorrow tomorrow_night_eighties twilight
