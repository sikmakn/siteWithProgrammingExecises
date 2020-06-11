const button = document.getElementById('cookieCloseInfo');
const cookieInfo = document.getElementById('cookieInfo');
if (sessionStorage.getItem('isCookie'))
    cookieInfo.remove();
else {
    cookieInfo.style.display = 'flex';
    button.onclick = () => {
        sessionStorage.setItem('isCookie', 'true');
        cookieInfo.remove();
    }
}