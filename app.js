const express = require('express');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');
const bodyParser = require('body-parser');
const config = require('./config/config');
const {mongoOptions, PORT} = require('./back/options/options');
const {errorLogger} = require('./back/Handlers/logger');

const app = express();

const hbs = exphbs.create({extname: 'hbs',});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './front/views');

app.use(compression());
app.use(express.static(__dirname + '/front/static'));
app.use(bodyParser.json());
app.use(helmet());

mongoose.connect(config.MONGODB_URI, mongoOptions);
autoIncrement.initialize(mongoose.connection);


const setUpControllers = require('./back/controllers/setUp');
setUpControllers(app);

app.get('/', (req, res) => {
    res.render('layouts/main.hbs')
});

app.use((req, res) => {
    res.status(404).render('404.hbs', {
        layout: 'themeSelectMain.hbs',
    })
});

app.use(errorLogger);
app.use((error, req, res, next) => {
    console.log(req.status);
    if (req.status === 401) return;

    res.status(500);
    res.send("Internal Server Error");
});

app.listen(PORT);

process.on("SIGINT", () => {
    mongoose.disconnect();
    process.exit();
});