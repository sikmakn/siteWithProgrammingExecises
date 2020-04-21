const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bodyParser = require('body-parser');
const config = require('./config/config');

const PORT = process.env.PORT || 3001;
const app = express();
mongoose.connect(config.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

autoIncrement.initialize(mongoose.connection);

const themeCommonController = require("./back/controllers/themesCommonController");
const exerciseController = require("./back/controllers/exerciseController");

const hbs = exphbs.create({extname: 'hbs',});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './front/views');

app.use(express.static(__dirname + '/front/static'));
app.use(bodyParser.json());

app.use("/js", themeCommonController('js'));
app.use("/js/exercises/", exerciseController('js'));
app.use("/net", themeCommonController('net'));
app.use("/net/exercises/", exerciseController('net'));
app.use("/python", themeCommonController('python'));
app.use("/python/exercises/", exerciseController('python'));


app.get('/', (req, res) => {
    res.render('layouts/main.hbs')
});

app.get('/addTheme', async (req, res) => {
    res.render('addTheme.hbs', {layout: 'themeSelectMain.hbs',})
});

const errorLogger = require('./back/Handlers/logger').errorLogger;
app.use(errorLogger);

app.use((error, req, res, next) => {
    if (req.status !== 401) {
        res.status(500);
        res.send("Internal Server Error");
    }
});

app.listen(PORT);

process.on("SIGINT", () => {
    mongoose.disconnect();
    process.exit();
});