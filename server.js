const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');

// Skriva ny fil - ej relevant nu
//const menuDB = new nedb({filename: 'menu.db', autoload: true});

const app = express();
const port = 8000;

app.use( express.json() );
app.use( cors({ origin: '*' }) );
// app.use( (req, res, next) => {
//     console.log(req.method, req.url, res.body);
//     next();
// });


app.get('/api/menu', async (req, res) => {
    try {
        let menu = require('./data/menu.json')
        res
            .json( menu )
            .status(200);
    } catch (error) {
        res
            .status(500)
            .json( {error: "Items not found, check your connection."})
    }
});





app.listen( port, () => {
    console.log( `Server is alive on port: ${port}` );
});