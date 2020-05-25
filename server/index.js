'use strict';

require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const request = require('request')

const { getCountries, getRegions, getCities, getDocumentation, getPendingLinks, approveLinks, userSubmission } = require('./MongoDB/mongoHandlers')
const { addNewObjects } = require('./webscraping/scrapeFront')

let GOOGKEY = process.env.GOOGKEY

console.log(process.env)

const getApi = (req, res) => {
  request("https://thevirustracker.com/free-api?global=stats",
    (error, response, html) => {
      let results = response.body;
      //console.log(results)
      res.send(results)
    }
  )
}

const getFoodbanks = (req, res) => {
  request(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=foodbanks+in+${req.params.query}&key=${GOOGKEY}`,
    (error, response, html) => {
      if (error) {
        console.log(error)
      }
      let foodbankResults = response.body;
      console.log(req.params)
      //console.log(foodbankResults)
      res.send(foodbankResults)
    }
  )
}




const PORT = 4000;

express()
  .use(function (req, res, next) {
    res.header(
      'Access-Control-Allow-Methods',
      'OPTIONS, HEAD, GET, PUT, POST, DELETE'
    );
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
  })
  .use(morgan('tiny'))
  .use(express.static('./server/assets'))
  .use(bodyParser.json())
  .use(express.urlencoded({ extended: false }))
  .use('/', express.static(__dirname + '/'))

  // REST endpoints?
  .get('/filter/country', getCountries)
  .get('/country/:territories', getRegions)
  .get('/region/:region', getCities)
  .get('/city/:city', getDocumentation)
  .get('/pending', getPendingLinks)
  .post('/approve', approveLinks)
  .post('/submission', userSubmission)
  .get('/covidapi', getApi)
  .get('/returnfoodbank/:query', getFoodbanks)
  .post('/scrape', addNewObjects)

  .listen(PORT, () => console.info(`Listening on port ${PORT}`));
