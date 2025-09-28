const redisClient = require('../Config/redis');

exports.sayHello = (req, res) => {
  res.send('Hello World!');
};

exports.sayHiAmey = (req, res) => {
  res.send('Hello Amey Kulkarni');
};

exports.getRedisData = async (req, res) => {
  try {
    await redisClient.set('name', 'Amey Kulkarni');
    const value = await redisClient.get('name');
    res.send("Data from Redis: " + value);
    console.log("data", value);
  } catch (err) {
    console.log(err);
    res.send("Error fetching data from Redis");
  }
};
