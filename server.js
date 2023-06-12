const express = require('express');
const nedb = require('nedb-promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { authenticateToken, checkAdmin } = require('./middleware/accessControl.js')


const menuDB = new nedb({filename: 'menu.db', autoload: true});
const usersDB = new nedb({filename: 'users.db', autoload: true});
const campaignDB = new nedb({filename: 'campaign.db', autoload: true});

const app = express();
const port = 6000;

const key = 'BigBangTheory';

app.use( express.json() );
app.use( cors({ origin: '*' }) );

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`, res.body);
    next();
});


app.get('/api/menu', async (req, res) => {
    const menu = await menuDB.find({});
    res.json(menu)
});


app.post("/api/signup", async (req, res) => {
    const { username, password, role } = req.body;
  
    try {
        const existingUser = await usersDB.findOne({ username });
  
        if (existingUser) {
            return res.status(400).send( "User already exists" );
        } else {
            let hashedPassword = await bcrypt.hash(password, 10);
            let newUser = await usersDB.insert({ username, password: hashedPassword, role });
           
        res.json(newUser);
        }
  
    } catch (error) {
      console.error(error);
      res.status(500).json( 'Internal error');
    }
  });


// Jag har försökt i en evighet att hitta felet i denna koden, servern bara står och laddar... Alize säger att koden ser bra ut?
// ta bort "authenticateToken och checkAdmin" från endpointsen i (add, update, delete, campaign) så ser du att det funkar i alla fall.
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Login request received')

    usersDB.findOne({ username }, (err, user) => {
        if(!user) {
            res
                .status(401)
                .send('username is wrong or does not exist.')
        } else {
            bcrypt.compare(password, user.password, (error, result) => {
                if( result ){
                    const payload = {
                        user: {
                            username: user.username,
                            role: user.role,
                        }
                    };
                    const token = jwt.sign(payload, key, { expiresIn: '1h'});
                    res.send({ token })
                } else {
                    res
                        .status(401)
                        .send( 'Wrong password')
                }
            });
        }
    }) 
});

// authenticateToken, checkAdmin, - - - Ska vara med när koden ovanför funkar
app.post('/api/addproduct', async (req, res) => {
    const { id, name, description, price } = req.body;
    const newProduct = { id, name, description, price};
    const existingProduct = await menuDB.findOne({ name: newProduct.name });
    

    if (!name || !description || !price) {
        res
            .status(400)
            .send('Something is missing, make sure you have included [name, description and price]');
    } else if( existingProduct ){
        res
            .status(409)
            .send('Product already exist') 
    } else {
        newProduct.createdAt = new Date()
        newProduct.modifiedAt = new Date()
        menuDB.insert(newProduct);
        res
            .status(201)
            .send('Product added');
    }
});

// authenticateToken, checkAdmin, - - - Ska vara med när koden ovanför funkar
app.put('/api/updateproduct', async (req, res) => {
    const { id, whatToUpdate, updateTo } = req.body;
    let updateSuccessful = false;

    try {
        if ( whatToUpdate === 'name' ){
            await menuDB.update({ _id: id }, { $set: { name: updateTo, modifiedAt: new Date() } });
            updateSuccessful = true;
        } else if ( whatToUpdate === 'price') {
            await menuDB.update({ _id: id }, { $set: { price: updateTo, modifiedAt: new Date() } });
            updateSuccessful = true;
        } else if ( whatToUpdate === 'description' ) {
            await menuDB.update({ _id: id }, { $set: { description: updateTo, modifiedAt: new Date() } });
            updateSuccessful = true;
        } else {
            res
                .status(406)
                .send('Property does not exist, please use name/price/description/id')
        }
        
        if ( updateSuccessful) {
            res.send('Product updated')
        }
    } catch (error) {
        console.log(error);
        res
            .status(409)
            .send('Something went wrong, try again')
    }
});


// authenticateToken, checkAdmin, - - - Ska vara med när koden ovanför funkar
// Efter man tagit bort en produkt kan man inte ladda om menyn av en anledning? Står bara och laddar.
// Men startar man om servern så ser man på menyn sen att produkten är borttagen
app.delete('/api/delete', async (req, res) => {
    const productId = req.body.id;
    await menuDB.remove({ _id: productId}, {}, function (error, removed) {
        if( error ){
            console.log(error, 'No product found, please try a different id');
            res.status(500)
        } else if( removed === 0 ){
            res
                .status(409)
                .send('No product found, please try a different id')
        } else {
            res
                .status(201)
                .send('Product deleted')
        }
    })
});


app.post('/api/campaign', async (req, res) => {
    const { products, campaignPrice } = req.body;

    const invalidProduct = await products.filter((product) => {
        return !menuDB.findOne({ name: product})
    });

    if (invalidProduct.length > 0){
        return res
            .status(400)
            .send('Product does not exist')
    }

    if (!Number.isFinite(campaignPrice) || campaignPrice <= 0){
        return res
            .status(400)
            .send('Something went wrong')
    }

    const newCampaign = {
        products,
        campaignPrice
    };

    campaignDB.insert(newCampaign, (error, campaign) => {
        if(error){
            res
                .status(500)
                .send('Error')
        } else {
            res
                .status(201)
                .send(campaign)
        }
    })
});



app.listen( port, () => {
    console.log( `Server is alive on port: ${port}` );
});