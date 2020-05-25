const path = require('path');
const envPath = path.resolve(__dirname + '/../.env')

console.log(envPath)
require('dotenv').config({ path: envPath })

const fetch = require('node-fetch')
const cheerio = require('cheerio')
const { MongoClient } = require('mongodb');
const assert = require('assert');


const countryRegions = require('./scrapeData')
const states = ((Object.values(countryRegions.states2)))
const results = []
let currentState;
let alreadyFound = false;
let pendingLinks;
let resourceLinks;
let savedLinks;
let makeObject = false;
// const states = [{name: 'virginia'}]

console.log(process.env)

const getConvidInfo = async () => {
    const response = await fetch('https://www.livescience.com/coronavirus-resources-state-local-health-departments.html')
    return await response.text()
}

const getDatabases = async () => {
    const uri = "mongodb+srv://dbAdmin:lizard882@cluster0-1tqzq.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // open the connection to the database server
    await client.connect();
    console.log('Getting links');

    const db = client.db('finalproject');

    pendingLinks = await db.collection('pending').find().toArray()
    resourceLinks = await db.collection('resources-first').find().toArray()

    console.log("Saved Links Set")


}

const getLinks = async () => {
    const html = await getConvidInfo()
    await getDatabases()
    savedLinks = resourceLinks.concat(pendingLinks)
    const $ = cheerio.load(html)
    const links = $('a')
    //await console.log(savedLinks)
    //const results = []
    for (let i = 0; i < links.length; i++) {
        const link = links[i]
        if (link.attribs.href && link.attribs.href.includes('https')) {
            const text = $(link).text()
            const href = link.attribs.href
            const fullLink = (text + " " + href)

            /*   for (let j = 0; j < states.length; j++) {
                  if (fullLink.includes(states[j].name)) { */
            try {
                console.log("valid link")
                await verifyUrl(href)
                if (currentState && !alreadyFound && makeObject) {
                    console.log("Creating resource")
                    results.push(
                        {
                            'country': 'UNITED STATES',
                            'regionType': 'STATE',
                            'regions': (`${currentState}`).toUpperCase(),
                            'industry': '-',
                            'description': (`${text}`).toUpperCase(),
                            'documentation': `${href}`
                        }
                    )
                }
            } catch (err) {
                // ignored
            }


        }
    }

    //await checkingDuplicates();

    await batchExport();

    console.log("**Scrape Ended**")
    console.log(results)
    //return results

}

const verifyUrl = async (url) => {
    makeObject = false;
    alreadyFound = await false;
    const response = await fetch(url)
    let counter = 0;
    let text = await response.text()
    if ((results.find(link => link.documentation === url))) {
        console.log("Link was already found in this scrape.")
        alreadyFound = true;
    }
    else if ((savedLinks.find(link => link.documentation === url))) {
        console.log("*****************ALREADY FOUND IN DATABASES***************")
        alreadyFound = true;
    }


    else {
        for (let j = 0; j < states.length; j++) {
            if (text.includes(states[j].name)) {

                console.log(url, " is most likely for the state: ", states[j].name)
                currentState = states[j].name
                j = 500;
                counter++
                makeObject = true;


            }

        }
    }
}

getLinks()
    .then(console.log)
    .catch(console.error)




const batchExport = async () => {
    const uri = "mongodb+srv://dbAdmin:lizard882@cluster0-1tqzq.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // open the connection to the database server
    await client.connect();
    console.log('Adding to pending links');

    const db = client.db('finalproject');

    const r = await db.collection('pending').insertMany(results);
    assert.equal(results.length, r.insertedCount);

    // close the connection to the database server
    await client.close();
    console.log('Successfully added');


}

const checkingDuplicates = async () => {

    const uri = "mongodb+srv://dbAdmin:lizard882@cluster0-1tqzq.mongodb.net/test?retryWrites=true&w=majority";
    const client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    // open the connection to the database server
    await client.connect();
    console.log('Checking for duplicates');

    const db = client.db('finalproject');

    pendingLinks = await db.collection('pending').find().toArray()
    resourceLinks = await db.collection('resources-first').find().toArray()


    results.forEach((resource, index) => {
        if ((pendingLinks.find(link => link.documentation === resource.documentation)) || (resourceLinks.find(link => link.documentation === resource.documentation))) {
            console.log("Found duplicate")
            results.splice(index, 1)


        }
    })

    await client.close();
    console.log('Duplicates deleted');


}
