const request = require('request')
const cheerio = require('cheerio')
const countryRegions = require('./scrapeData')
const fs = require('file-system');
const { MongoClient } = require('mongodb');
const assert = require('assert');


states = ((Object.values(countryRegions.states)))

let objectArray = [];

let wasFound = false;

//let linkFound = false;

const addNewObjects = async (req, res) => {

    //let searchUrl = req.params.link;

    console.log(req.body.link)

    let searchUrl = req.body.link;


    let newDatabaseObject;

    function wait(ms) {
        var d = new Date();
        var d2 = null;
        do { d2 = new Date(); }
        while (d2 - d < ms);
    }



    const client = new MongoClient("mongodb+srv://dbAdmin:lizard882@cluster0-1tqzq.mongodb.net/test?retryWrites=true&w=majority", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();

    const db = client.db('finalproject');

    pendingLinks = await db.collection('pending').find().toArray()
    resourceLinks = await db.collection('resources-first').find().toArray()

    //await client.close();


    let regionType;

    //console.log("links from database", pendingLinks)
    if (country = "united states") {
        regionType = "State"
    }


    request(`${searchUrl}`,
        (error, response, html) => {
            if (!error && response.statusCode == 200) {
                // console.log(html)
                const $ = cheerio.load(html)

                objectArray = [];


                const list = $('ul')
                let industry;

                links = $('a'); //jquery get all hyperlinks
                $(links).each(function (i, link) {
                    let currentLink = ($(link).text() + " " + $(link).attr('href'));
                    let linkName = ($(link).text());
                    let linkUrl = ($(link).attr('href'))



                    states.forEach(state => {

                        if ((currentLink.includes(state))/*  && (currentLink.includes('coronavirus'))  *//*  && (currentLink.includes('restaurant')) */) {



                            console.log(currentLink)

                            if (pendingLinks.find(link => link.documentation === linkUrl)) {

                                //console.log(pendingLinks.find(link => link.documentation === linkUrl))
                                wait(250)

                                console.log("Found in pending Links")

                                wasFound = true;
                                console.log(wasFound)
                            }
                            else if (resourceLinks.find(link => link.documentation === linkUrl)) {

                                wait(250)
                                console.log("Found in resource Links")

                                wait(250)

                                wasFound = true;




                            }

                            if (wasFound === false) {

                                console.log("Creating new object")

                                newDatabaseObject = {
                                    'country': 'UNITED STATES',
                                    'regionType': 'STATE',
                                    'regions': (`${state}`).toUpperCase(),
                                    'industry': '-',
                                    'description': (`${linkName}`),
                                    'documentation': `${linkUrl}`

                                }
                                objectArray.push(newDatabaseObject)


                            }

                        }
                        
                        
                        //console.log(newDatabaseObject);

                    })




                    /*   console.log(objectArray)
                      const r = db.collection('pending').insertMany(objectArray);
                      assert.equal(objectArray.length, r.insertedCount);
     
                      // close the connection to the database server
                      client.close();
                      console.log('disconnected!'); */


                })

                console.log(objectArray.length)



                if (objectArray.length > 1) {
                    batchExport();
                    res.send("matches found!")

                } else {
                    console.log("no matches")
                    res.send("no matches found")
                }


            }

            client.close()
            console.log("disconnected")


        }




    )






}

const batchExport = async () => {
    const uri = "mongodb+srv://dbAdmin:lizard882@cluster0-1tqzq.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // open the connection to the database server
    await client.connect();
    console.log('connected!');

    const db = client.db('finalproject');

    const r = await db.collection('pending').insertMany(objectArray);
    assert.equal(objectArray.length, r.insertedCount);

    // close the connection to the database server
    await client.close();
    console.log('disconnected!');


}





module.exports = { addNewObjects }; 