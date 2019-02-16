const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
let app = express();

// Middleware registered with app.use
//__dirname stores the path to your project's directory
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next)=> {
    let now = new Date().toString();
    let log = `${now}: ${req.method} ${req.url}`
    
    console.log(now,log);
    fs.appendFile('server.log', log + '\n', (err) => {
        if (err) {
            console.log('Unable to append to server.log')
        }
    })
    next();
})

// hbs helpers
// functions to dymnamically display data in views
hbs.registerHelper('getCurrentYear', () => {
    return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
    return text.toUpperCase();
});


// maintenance page stops everything after it from being executed
// app.use((req, res, next) => {
//     res.render('maintenance.hbs');
// })

// static middleware moved below maintenance middlware
// to ensure it is also affected by maintenance middlware
app.use(express.static(__dirname + '/public'));


// handlers
app.get('/',(req, res) => {
    res.render('home.hbs', {
        pageTitle: 'Home Page',
        welcomeMessage: "Welcome to my awesome website!"
    })
});

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        pageTitle: 'About Page'
    });
})

app.get('/projects', (req, res) => {
    res.render('projects.hbs', {
        pageTitle: 'Projects Page',
        welcomeMessage: "Welcome to my portfolio page!"
    });
})

app.get('/bad', (req, res) => {
    res.send({
        errorMessage: "This is a bad page :("
    })
});

// express server listening
app.listen(port, () => {
    console.log(`Server is running on port: ${port}.`)
});