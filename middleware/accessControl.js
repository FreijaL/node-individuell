//import { admins } from '../data/admin.db';
//const fs = require('fs');

//let admins = require('../data/admins.db');

// function getAdmins() {
//     const rawData = fs.readFileSync('../data/admins.db', 'utf-8');
//     const admins = JSON.parse(rawData);
//     return admins;
// }

// function accessControl(req, res, next){
//     console.log('Access control');

//     let key = req.query?.key
//     if( !key ) {
//         console.log('Access denied, no key!');
//         res.sendStatus(401)
//     }

//     let admins = getAdmins();
//     let found = admins.find(admin => admin.key === key)
//     if( found ) {
//         found.requestCount++
//         console.log(`Access granted. This i request ${found.requestCount}.`);
//         next();
//     } else {
//         console.log('Access denied, bad key!');
//         res.sendStatus(401);
//     }
// };


// module.exports = { accessControl };