const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const formidable = require('express-formidable');


const app = express();
mongoose.connect("mongodb://localhost:27017/test1db", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

autoIncrement.initialize(mongoose.connection);

const themeCommonController = require("./back/controllers/themesCommonController.js");

const hbs = exphbs.create({extname: 'hbs',});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './front/views');

app.use(express.static(__dirname + '/front/static'));
app.use(formidable());

app.use("/js", themeCommonController('js'));
app.use("/net", themeCommonController('net'));
app.use("/python", themeCommonController('python'));

app.get('/', (req, res) => {
    res.render('layouts/main.hbs')
});

app.get('/addTheme', async (req, res) => {
    res.render('addTheme.hbs', {layout: 'themeSelectMain.hbs',})
});

app.listen(3001);

process.on("SIGINT", () => {
    mongoose.disconnect();
    process.exit();
});