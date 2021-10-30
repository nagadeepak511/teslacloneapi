var express = require('express');
var app = express();

var mongoDB = require('mongodb');
var MongoClient = mongoDB.MongoClient;
var port = process.env.PORT||8080;
var mongoUrl = 'mongodb+srv://naga:test123@edumato.1t9ez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
let db;

var cors = require('cors');
const { query } = require('express');
app.use(cors());

// Home
app.get('/', (req, res)=>{
    res.send("Welcome to Edumato api by naga")
})

// page 1
// mealtypes
app.get('/mealtypes', (req, res)=>{
    db.collection('mealtypes').find().toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// locations
app.get('/locations', (req, res)=>{
    db.collection('locations').find().toArray((err, result)=>{
        if(err) throw err;
        if(!req.query.states) res.send(result);
        else{
            var filters = [];
            result.map((location)=>{
                var x = {id:location.state_id,state:location.state};
                if(filters.filter((i)=>{
                    return (i.id == x.id && i.state==x.state);
                }).length == 0) filters.push(x);
            })
            res.send(filters);
        }
    })
})

// restaurants
app.get('/restaurants', (req, res)=>{
    var query = {};
    if(!req.query.state && !req.query.mealtype){
        query = {};
    }
    else if(req.query.state){
        if(!req.query.mealtype) query.state_id = Number(req.query.state);
        else{
            query = {
                state_id: Number(req.query.state),
                "mealTypes.mealtype_id":Number(req.query.mealtype)
            }
        }
    }
    else query = {mealtype:-1};
    db.collection('restaurantdata').find(query).toArray((err, result)=>{
        if(err) throw err;
        res.send(result);
    })
})

// page2


// connect db
MongoClient.connect(mongoUrl, (err, client)=>{
    if(err) console.log('error while connecting');
    else{
        db = client.db('edumato1');
    }
})

app.listen(port, ()=>{
    console.log('running on ',port)
});
