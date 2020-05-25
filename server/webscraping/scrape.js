const request = require('request')
const rp = require('request-promise')
const cheerio = require('cheerio')
const countryRegions = require('./scrapeData')
const fs = require('file-system');
const { MongoClient } = require('mongodb');
const assert = require('assert');
const util = require('util');
var async = require("async");

let mongoConnect = process.env.MONGOURI


const getUrl = util.promisify(request);

states = ((Object.values(countryRegions.states2)))

let objectArray = [];
let currentState;

let toVerify = false;

function wait(ms) {
    var d = new Date();
    var d2 = null;
    do { d2 = new Date(); }
    while (d2 - d < ms);
}

let isValid = false;

const createNewObject = (linkUrl, linkName, currentState) => {

    console.log("creating new Link")

    newDatabaseObject = {
        'country': 'UNITED STATES',
        'regionType': 'STATE',
        'regions': (`${currentState}`).toUpperCase(),
        'industry': 'RESTAURANT',
        'description': (`${linkName}`).toUpperCase(),
        'documentation': `${linkUrl}`

    }


}

const addToPending = (objectArray) => {
    console.log(objectArray.length)

    if (objectArray.length > 1) {
        batchExport();

    } else {
        console.log("no matches")
    }
}

//var currentState;

const addNewObjects = async () => {

    let newDatabaseObject;



    const client = new MongoClient(mongoConnect, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

    await client.connect();

    const db = client.db('finalproject');

    pendingLinks = await db.collection('pending').find().toArray()
    resourceLinks = await db.collection('resources-first').find().toArray()


    let regionType;

    //console.log("links from database", pendingLinks)
    if (country = "united states") {
        regionType = "State"
    }


    getUrl('https://www.restaurantbusinessonline.com/operations/state-state-guide-covid-19-resources-food-beverage-industries',
        (error, response, html) => {
            if (!error && response.statusCode == 200) {
                // console.log(html)
                const $ = cheerio.load(html)

                /*   const list = $('ul')
                  let industry; */

                links = $('a'); // get all hyperlinks
                $(links).each(function (i, link) {
                    let currentLink = ($(link).text() + " " + $(link).attr('href'));
                    let linkName = ($(link).text());
                    let linkUrl = ($(link).attr('href'))

                    //console.log("here is the current State", currentState)


                    states.forEach(async state => {
                        if (((currentLink.includes(state.name)) || (currentLink.includes(state.abbreviation))) && (linkUrl.includes("https")) && ((currentLink.includes('assistance')) || (currentLink.includes('coronavirus')) || (currentLink.includes('covid')))) {


                            console.log(currentLink)








                            if ((pendingLinks.find(link => link.documentation === linkUrl)) /* || (resourceLinks.find(link => link.documentation === linkUrl)) */) {
                                wait(500)
                                console.log("Already found")

                            }
                            else {

                                console.log("not found")

                                verifyUrl(linkUrl)

                                wait(5000)

                                console.log(currenState)

                                if (currentState != undefined) {

                                    console.log("creating new Link")

                                    newDatabaseObject = {
                                        'country': 'UNITED STATES',
                                        'regionType': 'STATE',
                                        'regions': (`${currentState}`).toUpperCase(),
                                        'industry': 'RESTAURANT',
                                        'description': (`${linkName}`).toUpperCase(),
                                        'documentation': `${linkUrl}`

                                    }


                                    objectArray.push(newDatabaseObject)
                                }
                            }
                        }
                    }
                    )
                })



            }

            addToPending(objectArray)



        }


    )

}








//}
//console.log(newDatabaseObject);











/*   console.log(objectArray)
  const r = db.collection('pending').insertMany(objectArray);
  assert.equal(objectArray.length, r.insertedCount);
 
  // close the connection to the database server
  client.close();
  console.log('disconnected!'); */


















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

function verifyUrl(linkUrl) {




    console.log("inside verifyUrl")
    console.log(linkUrl)

    getUrl(linkUrl).then(data => {

        let content = JSON.parse(data.body);

        console.log('Joke: ', content.value);

    }).catch(err => console.log('error: ', err))


    /*  getUrl('https://dev.to/aurelkurtula')
         .then((response) => {
             console.log(response)
         }) */
    /*   console.log("inside verifyUrl request")



      if (!error && response.statusCode == 200) {
          //console.log(html)
          //const siteData = cheerio.load(html)
          //console.log(siteData)
          console.log("type of html", typeof html)





          if (html.includes("covid-19")) {

              console.log("contains covid keyword")

              states.forEach(state => {
                  console.log("here is the state", state)
                  if (html.includes(state.name)) {
                      currentState = state.name;
                      console.log(currentState)
                      //siteData = true;

                  }


              })

          }

      }



  }) */
    //let siteData;



}





addNewObjects()

