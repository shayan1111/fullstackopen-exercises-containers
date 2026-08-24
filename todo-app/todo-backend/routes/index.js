const express = require('express');
const redis = require('../redis')
const router = express.Router();

const configs = require('../util/config')

/* GET index data. */
router.get('/statistics', async (req, res) => {
  let currentVisits = await redis.get("visits")
  
  let newVisits = Number(currentVisits) + 1
  
  await redis.set("visits", newVisits)

  res.send({
    visits: newVisits
  });
});

module.exports = router;
