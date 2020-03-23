const express = require('express');
const exphbs = require('express-handlebars');
const jsRouter = require('./back/controllers/jsController');

const app = express();

const hbs = exphbs.create({
    // defaultLayout: 'main',
    extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './front/views');

app.use(express.static(__dirname + '/front/static'));

app.use("/js", jsRouter);
app.get('/', (req, res) => {
    res.render('layouts/main.hbs')
});


app.get('/net', (req, res) => {
    res.render('empty.hbs', {layout: 'themeSelectMain.hbs', isNet: true})
});

app.get('/python', (req, res) => {
    res.render('empty.hbs', {layout: 'themeSelectMain.hbs', isPython: true})
});

app.get('/:lang/:id/:difficult', (req, res) => {
    res.render('exercises.hbs', {
        layout: 'themeSelectMain.hbs', isJs: true, theme: {
            number: 1,
            title: "bla bla bla bla",
            lang: 'js',
            id: 1,
        }
    })
});

app.listen(3001);