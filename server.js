const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');
//import { nanoid } from require('nanoid');
//const { accessControl } = require('./middleware/accessControl');
//const fs = require('fs');

// Skriva ny fil - ej relevant nu - behövs för att lägga till saker i menyn
const menuDB = new nedb({filename: 'menu.db', autoload: true});

const app = express();
const port = 6000;

//const id = nanoid();



app.use( express.json() );
app.use( cors({ origin: '*' }) );
// app.use( (req, res, next) => {
//     console.log(req.method, req.url, res.body);
//     next();
// });

menuDB.insert({ item: 'Pizza', price: 12 }, (err, newItem) => {
    if (err) console.log('Error adding test data:', err);
  });

app.get('/api/menu', async (req, res) => {
    try {
        const menu = await menuDB.find({}).exec();
        res.json(menu)
    } catch (error) {
        res
            .status(500)
            .json( {error: "Items not found, check your connection."})
    }
});

 // let menu = require('./data/menu.db')
        // res
        //     .json( menu )
        //     .status(200);
//app.get('/api/admin', accessControl );

// app.get('/api/admin/delete')
// app.get('/api/admin/create')
// app.get('/api/admin/update')





app.listen( port, () => {
    console.log( `Server is alive on port: ${port}` );
});