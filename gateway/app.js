const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const compression = require('compression');
const {PORT} = require('./config');
const controllers = require('./controllers');

const app = express();

const hbs = exphbs.create({extname: 'hbs'});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './front/views');

app.use(compression());
app.use(express.static(__dirname + '/front/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());

controllers(app);

app.get('/', (req, res) => {
    res.render('layouts/main.hbs')
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        layout: 'themeSelectMain.hbs',
    })
});

app.use((req, res) => {
    res.status(404).render('404.hbs', {
        layout: 'themeSelectMain.hbs',
    })
});

app.use((error, req, res, next) => {
    console.log(req.status);
    if (req.status === 401) return;

    res.status(500);
    res.send('Internal Server Error');
});

app.listen(PORT);
