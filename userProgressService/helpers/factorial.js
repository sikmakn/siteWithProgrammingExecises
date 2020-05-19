function prodTree(l, r) {
    if (l > r) return 1;

    if (l === r) return l;

    if (r - l === 1) return Math.floor(l * r);

    const m = Math.floor((l + r) / 2);
    return prodTree(l, m) * prodTree(m + 1, r);
}

function fact(n) {
    if (n < 0) return 0;

    if (n === 0) return 1;

    if (n === 1 || n === 2) return n;

    return prodTree(2, n);
}

module.exports = fact;