const express    = require("express");
const bodyParser = require("body-parser");
const bcrypt     = require("bcrypt-nodejs");
const cors       = require("cors"); 
const knex       = require("knex");

const db = knex ({
    client: 'pg',
    connection: {
        host: '0.0.0.0',
        user: 'ubuntu',
        password: '',
        database: 'smart-brain'
    }
});




db.select('*').from('users').then(data => {
    // console.log(data);
});




const app = express();
app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@email.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@email.com',
            password: 'apples',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@email.com'
        }
    ]
}




app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err) {
            console.log(err);
        }
        console.log(hash);
    });
    database.users.push({
            id: '125',
            name: name,
            email: email,
            password: password,
            entries: 0,
            joined: new Date()
        });
    res.json(database.users[database.users.length-1]);
    // res.json(database.users);
})



app.get('/', (req, res) => {
    res.send(database.users);
})



app.post('/signin', (req, res) => {
    bcrypt.compare('apples', '$2a$10$us717J.MYJjIhvDP5TtjMOxhuRxDEGKtH.R4Nz9/xFb0R2jaK.lWO', function(err, res){
        if (err) {
            console.log(err);
        }
        console.log('first guess', res)
    });
    bcrypt.compare('veggies', '$2a$10$us717J.MYJjIhvDP5TtjMOxhuRxDEGKtH.R4Nz9/xFb0R2jaK.lWO', function(err, res){
        if (err) {
            console.log(err);
        }
        console.log('second guess', res)
    });
    
    if (req.body.email === database.users[0].email && req.body.password === database.users[0].password) {
        res.json(database.users[0]);
    } else {
        res.status(400).json('error logging in');
    }
});








app.get('/profile/:id' , (req, res) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        } 
    })
    if(found === false) {
       res.status(400).json('no such user'); 
    }
})







app.put('/image', (req, res) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries ++;
            return res.json(user.entries);
        } 
    })
    if(found === false) {
       res.status(400).json('no such user'); 
    }
})












app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
})