const redisClient = require('../Config/redis');

exports.addBusData = async (req, res) => {
  const { busid, lat, long, aqi, pm25, pm10 } = req.body;

  try {
    const timestamp = Date.now();
    const values = JSON.stringify({ lat, long, aqi, pm25, pm10 });
    await redisClient.zAdd(`bus_${busid}`, { score: timestamp, value: values });
    res.status(200).send("Data added successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error adding data" });
  }
};

exports.updateBusData = async (req, res) => {
  const { busid, lat, long, aqi, pm25, pm10 } = req.body;

  try {
    const timestamp = Date.now();
    const values = JSON.stringify({ lat, long, aqi, pm25, pm10 });
    await redisClient.zAdd(`bus_${busid}`, { score: timestamp, value: values });
    res.status(200).send("Data updated successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send({ error: "Error updating data" });
  }
};

exports.getBusData = async (req, res) => {
  const { busid } = req.params;

  try {
    const allReadings = await redisClient.zRange(`bus_${busid}`, 0, -1);
    const data = allReadings.map(item => JSON.parse(item));
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Redis error" });
  }
};

exports.getAllBuses = async (req, res) => {
  try {
    const busKeys = await redisClient.keys('bus_*');
    const allBusData = {};

    for (const key of busKeys) {
      const readings = await redisClient.zRange(key, 0, -1);
      allBusData[key] = readings.map(item => JSON.parse(item));
    }

    res.json(allBusData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Redis error" });
  }
};
