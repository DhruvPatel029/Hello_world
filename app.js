const express = require('express');
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator');

const app = express();
const port = 5000;
// const port = process.env.port | 5000

// Set Templating Engine
const handlebars = require('express-handlebars');
app.engine('.hbs', handlebars.engine({
    extname: '.hbs',
    helpers: {
        calculation: function (num) {
            return num + 10;
        },
        strong: function (options) {
            return '<li style="color:red">' + options.fn(this) + '</li>';
        }
    }
}));
app.set('view engine', '.hbs');

// Middleware
const urlencodedParser = bodyParser.urlencoded({ extended: false });

// Navigation
app.get('', (req, res) => {
    res.render('index', {
        layout: false // do not use the default Layout (main.hbs) 
    });
});

app.get('/register', (req, res) => {
    res.render('register', {
        layout: false // do not use the default Layout (main.hbs) 
    });
});

// POST route for form submission
app.post('/register', urlencodedParser, [
    check('username', 'This username must be 3+ characters long')
        .exists()
        .isLength({ min: 3 }),
    check('email', 'Email is not valid')
        .isEmail()
        .normalizeEmail()

], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const alert = errors.array();
        res.render('register', {
            errs: alert,
            layout: false // do not use the default Layout (main.hbs) 
        });
    } else {
        // Render the 'output' view with form data
        res.render('output', {
            data: `Username: ${req.body.username}, 
             Email: ${req.body.email}`,
            // data: `nothing`,
            layout: false
        });
    }
});

app.listen(port, () => console.info(`App listening on port: ${port}`));
