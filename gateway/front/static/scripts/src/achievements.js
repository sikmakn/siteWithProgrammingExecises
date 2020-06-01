const fullAchievement = document.getElementById('fullAchievement');
const imgs = document.querySelectorAll('img');
for (let img of imgs) {
    if (!img.id) continue;
    img.onclick = async () => {
        const {name, description} = await fetch('/achievement/' + img.id)
            .then(r => r.json());
        fullAchievement.children[0].innerText = name;
        fullAchievement.children[1].src = img.src;
        fullAchievement.children[2].innerText = description;

    }
}