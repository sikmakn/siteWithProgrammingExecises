const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const exphbs = require('express-handlebars');
const helmet = require('helmet');
const compression = require('compression');
const {PORT} = require('./config');
const controllers = require('./controllers');
const {authValidate} = require('./helpers/auth');

const {pubExchanges, serviceName} = require('./options');
const {publish, getChannel} = require('./amqpHandler');

const app = express();

const hbs = exphbs.create({extname: 'hbs'});
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './front/views');

app.use(compression());
app.use(express.static(__dirname + '/front/static'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(helmet());

controllers(app);

app.get('/', authValidate, (req, res) => {
    res.render('layouts/main.hbs', {
        isAuth: !!req.token,
    });
});

app.get('/about', authValidate, (req, res) => {
    res.render('about.hbs', {
        layout: 'themeSelectMain.hbs',
        isAuth: !!req.token,
    })
});

app.use(authValidate, (req, res) => {
    res.status(404).render('404.hbs', {
        layout: 'themeSelectMain.hbs',
        isAuth: !!req.token,
    })
});

const {serializeError} = require('serialize-error');
app.use(async (error, req, res, next) => {
    if (req.status === 401) return res.redirect('/user/login');
    await publish(await getChannel(), pubExchanges.error, {
        error: serializeError(error),
        date: Date.now(),
        serviceName,
    });

    res.status(500).render('500.hbs', {
        layout: 'themeSelectMain.hbs',
        isAuth: !!req.token,
    })
});

app.listen(PORT);
