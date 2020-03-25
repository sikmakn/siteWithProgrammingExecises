const addTheme = document.getElementById('addTheme');
addTheme.onsubmit = async (e) => {
    e.preventDefault();
    const select = addTheme.children[0];
    const lang = select.options[select.selectedIndex].value;
    let response = await fetch(`../${lang}`, {
        method: 'POST',
        body: new FormData(addTheme)
    });
    document.location.href = `../${lang}`;
    document.location.reload();
};
//document.location.href = "http://www.site.ru";