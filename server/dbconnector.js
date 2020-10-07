var MongoClient = require('mongodb').MongoClient;
var dotenv = require('dotenv');

dotenv.config();

const dbCreds = {
    urlStart: process.env.URL_FIRST,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PW,
    urlEnd: process.env.URL_END,
    dbName: process.env.DB_NAME
};

var url = dbCreds.urlStart + dbCreds.user + ":" + dbCreds.password + dbCreds.urlEnd;

// Example vor insert
MongoClient.connect(url, function(err, db) {
    if (err) {
        throw err
    } else {
        var dbo = db.db(dbCreds.dbName);

        var insert = {
            username: "doenisf",
            password: "test123"
        };

        dbo.collection("user").insertOne(insert, function(err, res) {
            if(err) {
                throw err;
            } else {
//                console.log(insert + " inserted into \"user\"");
                db.close();
            }
        })
    }
});