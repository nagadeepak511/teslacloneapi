var express = require('express')
var app = express()

var port = process.env.PORT||8080

var mongo = require('mongodb')
var MongoClient = mongo.MongoClient
var mongoUrl = 'mongodb+srv://naga:test123@edumato.1t9ez.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
var db;

var cors = require('cors')
app.use(cors())

// home
app.get('/', (req, res)=>{
    res.send('welcome to tesla-clone api')
})

// categories
app.get('/categories', (req, res)=>{
    db.collection('categories').find().toArray((err, result)=>{
        if(err) throw err
        res.send(result)
    })
})

// model wrt name
app.get('/:modelname', (req, res)=>{
    var modelname = req.params.modelname
    db.collection(modelname).find().toArray((err, result)=>{
        if(err) throw err
        res.send(result)
    })
})

// category wrt modelname and categoryname
app.get('/:modelname/:categoryname', (req, res)=>{
    var categoryname = req.params.categoryname
    var modelname = req.params.modelname
    db.collection(modelname).find({"category":categoryname}).toArray((err, result)=>{
        if(err) throw err
        res.send(result)
    })
})

// connect with mongo cloud db
MongoClient.connect(mongoUrl, (err, client)=>{
    if(err) console.log('error while connecting')
    db = client.db('tesla')
})

app.listen(port, ()=>{
    console.log('listening on port '+port)
})