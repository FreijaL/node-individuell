const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');
const fs = require('fs');

const menuDB = new nedb({filename: 'menu.db', autoload: true});

const app = express();
const port = 6000;

app.use( express.json() );
app.use( cors({ origin: '*' }) );


app.get('/api/menu', async (req, res) => {
    const menu = await menuDB.find({});
    res.json(menu)
});


app.post('/api/addproduct', async (req, res) => {
    const product = req.body;
    const existingProduct = await menuDB.findOne({ name: req.body.name });

    if( existingProduct ){
        res
            .status(409)
            .send('Product already exist')
    } else {
        product.createdAt = new Date()
        product.modifiedAt = new Date()
        menuDB.insert(product);
        res
            .status(201)
            .send('Product added');
    }
});


app.put('/api/updateproduct', async (req, res) => {
    const { id, whatToUpdate, updateTo } = req.body;
    const product = req.body;

    try {
        if ( whatToUpdate == 'name' ){
            await menuDB.update({ _id: id }, { $set: { name: updateTo, modifiedAt: new Date() } });
        } else if ( whatToUpdate == 'price') {
            await menuDB.update({ _id: id }, { $set: { price: updateTo, modifiedAt: new Date() } });
        } else if ( whatToUpdate == 'description' ) {
            await menuDB.update({ _id: id }, { $set: { description: updateTo, modifiedAt: new Date() } });
        } else {
            res
                .status(406)
                .send('Property does not exist, please use name/price/description/id')
        }
        res.send('Product updated')
    } catch (error) {
        console.log(error);
        res
            .status(409)
            .send('Something went wrong, try again')
    }
});


app.delete('/api/delete', async (req, res) => {
    const productId = req.params.id;
    await menuDB.remove({ _id: productId }, function (error, removed) {
        if (error) {
            console.log(error, 'No product found, please try a different id');
        } else {
            console.log(removed);
        }
    });
    res.send('Product deleted')
});



// app.get('/api/admin/delete')
// app.get('/api/admin/create')
// app.get('/api/admin/update')





app.listen( port, () => {
    console.log( `Server is alive on port: ${port}` );
});