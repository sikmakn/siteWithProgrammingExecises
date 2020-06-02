const achievementMap = new Map();
const fullAchievement = document.getElementById('fullAchievement');
const imgs = document.querySelectorAll('img');

for (let img of imgs) {
    if (!img.id) continue;
    img.onclick = async () => {
        const achievement = achievementMap.get(img.id);
        if(achievement){
            outAchievement(achievement);
        }else{
            await outNewAchievement(img.id, img.src);
        }
    }
}

function outAchievement(achievement){
    const {name, description, fileSrc} = achievement;
    fullAchievement.children[0].innerText = name;
    fullAchievement.children[2].innerText = description;
    fullAchievement.children[1].src = fileSrc;
}

async function outNewAchievement(id, previewSrc) {
    fullAchievement.children[1].src = previewSrc;
    const {name, description, fileId} = await fetch('/achievement/' + id)
        .then(r => r.json());
    fullAchievement.children[0].innerText = name;
    fullAchievement.children[2].innerText = description;
    await fetch(`/achievement/file/${fileId}`).then(r => r.blob())
        .then(blob => {
            const fileSrc = URL.createObjectURL(blob);
            achievementMap.set(fileId, {name, description, fileSrc});
            fullAchievement.children[1].src = fileSrc;
        });
}