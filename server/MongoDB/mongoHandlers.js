
const { MongoClient } = require('mongodb');
const assert = require('assert');

let mongoConnect = process.env.MONGOURI

const getCountries = async (req, res) => {
    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });



    await client.connect();
    console.log("connected")




    const db = client.db('finalproject');


    await db.collection('resources-first').distinct(("country"), (err, result) => {
        result
            ? res.status(200).json({ status: 200, data: result })
            : res.status(404).json({ status: 404, data: 'Not Found' });
        client.close();
        console.log('disconnected!');
    });


    //res.status(200).json('bacon');
};

const getRegions = async (req, res) => {
    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    country = req.params.territories;
    await client.connect();
    console.log("connected")
    console.log("testing", country)

    const db = client.db('finalproject');

    const regionType = await db.collection('resources-first').distinct("regionType", { country: `${country}` })
    console.log("regionType", regionType)
    //res.status(200).json({ status: 200, data: regionType })


    const results = await db.collection('resources-first').distinct("regions", { country: `${country}` })
    console.log("results", results)
    res.status(200).json({ status: 200, data: regionType, results })

    client.close();
    console.log('disconnected!');

};

const getCities = async (req, res) => {
    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    region = req.params.region;
    await client.connect();
    console.log("connected")
    console.log("testing", region)

    const db = client.db('finalproject');

    const regionalDoc = await db.collection('resources-first').find({ "regions": `${region}`, "city": null }).toArray()
    console.log("heres regional doc", regionalDoc)

    const cities = await db.collection('resources-first').distinct("city", { regions: `${region}` })
    console.log("cities", cities)
    res.status(200).json({ status: 200, data: cities, regionalDoc })

    client.close();
    console.log('disconnected!');
};

const getDocumentation = async (req, res) => {
    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    city = req.params.city;
    await client.connect();
    console.log("connected")
    console.log("testing", city)

    const db = client.db('finalproject');

    const documentation = await db.collection('resources-first').find({ "city": `${city}` }).toArray()
    console.log("documentation", documentation)
    res.status(200).json({ status: 200, data: documentation })

    client.close();
    console.log('disconnected!');

};


const getPendingLinks = async (req, res) => {

    let page = req.query.page; //1
    let limit = req.query.limit; //9




    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();
    console.log("connected")

    const db = client.db('finalproject');

    const pendingLinks = await db.collection('pending').find().toArray()
    //console.log("Pending Links", pendingLinks)
    res.status(200).json({ status: 200, data: pendingLinks })


    client.close();
    console.log('disconnected!');

};

const approveLinks = async (req, res) => {
    //console.log("the request", req.body)
    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();
    console.log("connected")

    const db = client.db('finalproject');

    const r = await db.collection('resources-first').insertMany(req.body);
    assert.equal(req.body.length, r.insertedCount);

    await db.collection('pending').deleteMany({})

    res.status(200).json({ status: 200, message: "succesfully added to resource list" })

    client.close();
    console.log('disconnected!');

}

const userSubmission = async (req, res) => {
    //console.log("the request", req.body)
    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();
    console.log("connected")

    const db = client.db('finalproject');

    const r = await db.collection('pending').insertOne(req.body);
    //assert.equal(req.body.length, r.insertedCount);

    res.status(200).json({ status: 200, message: "succesfully added to resource list" })

    client.close();
    console.log('disconnected!');



}

module.exports = { getCountries, getRegions, getCities, getDocumentation, getPendingLinks, approveLinks, userSubmission };