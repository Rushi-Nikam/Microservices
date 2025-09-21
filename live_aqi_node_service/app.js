
    const express = require('express');
    const cors = require('cors');

    const { createClient } = require('redis');
    const app = express();
    const port = 3000;
    app.use(cors());

    const redisClient=createClient({
        url:'redis://localhost:6379'
    })

    redisClient.on('error',(err)=>console.log('Redis Client Error',err));

    (async()=>{
        await redisClient.connect();
    })();

    app.use(express.json());
    // Root route
    app.get('/', (req, res) => {
      res.send('Hello World!');
    });

    app.get('/hiamey',(req,res)=>{
        res.send("Hello Amey Kulkarni");
    })

    app.get('/redis-data',(req,res)=>{
        redisClient.set('name',"Amey Kulkarni");
        redisClient.get('name').then((value)=>{
            res.send("Data from Redis: "+value);
            console.log("data",value);
        }).catch((err)=>{
            console.log(err);
            res.send("Error fetching data from Redis");
        })
    })

    app.post('/postdata',(req,res)=>{
        const {busid,lat,long,aqi,pm25,pm10}=req.body;

        try{
            const timestamp=Date.now();
            const key=busid;
            const values=JSON.stringify({lat,long,aqi,pm25,pm10});
            redisClient.zAdd(`bus_${key}`,{score:timestamp,value:values});
            res.status(200).send("Data added successfully");
        }catch(err){
            console.log(err);
            res.status(500).send({error:"Error adding data"
            })
        }
    })
    app.put('/update-data',(req,res)=>{
        const {busid,lat,long,aqi,pm25,pm10}=req.body;

        try{
            const timestamp=Date.now();
            const key=busid;
            const values=JSON.stringify({lat,long,aqi,pm25,pm10});
            redisClient.zAdd(`bus_${key}`,{score:timestamp,value:values});
            res.status(200).send("Data updated successfully");
        }catch(err){
            console.log(err);
            res.status(500).send({error:"Error updating data"
            })
        }
    } )

    app.get('/bus/:busid/all', async (req, res) => {
      const { busid } = req.params;

      try {
        const allReadings = await redisClient.zRange(`bus_${busid}`, 0, -1);

        const data = allReadings.map(item => JSON.parse(item));
        res.json(data);
        console.log("daata",data);
        
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Redis error" });
      }
    });

    app.get('/all-buses', async (req, res) => {
      try {
        const busKeys = await redisClient.keys('bus_*');
        const allBusData = {};

        for (const key of busKeys) {
          const readings = await redisClient.zRange(key, 0, -1); // get all readings
          allBusData[key] = readings.map(item => JSON.parse(item));
        }

        res.json(allBusData);
        console.log("all bus data",allBusData);
        
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Redis error" });
      }
    });
    // Start server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}/`);
    });
    