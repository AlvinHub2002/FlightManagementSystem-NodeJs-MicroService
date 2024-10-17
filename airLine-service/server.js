const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");

const app = express();
const PORT = 3001;

app.use(express.json())

mongoose.connect('mongodb://mongodb:27017/airlinesdb')
.then(()=>{console.log("MongoDB connected ")})
.catch((err)=>{console.log(err)});

const Airlines = mongoose.model('Airlines',{
    airLineId : Number,
    airLineName : String,
});

app.get('/airlines', async(req,res)=>{
    try{
        const airlines = await Airlines.find();
        res.json(airlines);
    }catch (error) {
        res.status(500).json({ error: 'Error fetching Airlines' });
      }
});

app.get('/airlines/:airLineId',async(req,res)=>{
    const {airLineId}=req.params;
    try{
        const airline = await Airlines.findOne({airLineId : airLineId});
        if(airline){
            res.json(airline);
        }else{
            res.status(500).json({error:"Airline not found"})
        }
    }catch(error){
        res.status(500).json({error:"Error fetching Airline"});
    }
});

app.post('/airlines',async(req,res)=>{

    const {airLineId,airLineName}=req.body;
    const newAirline = new Airlines({
        airLineId,
        airLineName,
       
    });
    try{
    await newAirline.save();
    res.status(201).json(newAirline);
} catch (error) {
  res.status(500).json({ error: 'Error creating Airline' });
}
});

app.get('/airlines/:airLineId/flights', async(req,res)=>{
    const airLineId = req.params.airLineId;
    try{
        const airLine = await Airlines.findOne({airLineId :airLineId});
        const response = await axios.get(`http://flight-service:3002/flights/airline/${airLineId}`);
        const flights = response.data;
        res.json({airLine,flights});
    }
    catch(error){
        res.status(500).json({error:"Failed to fetch flights of this airline"});
    }
})


app.listen(PORT,()=>{
    console.log(`connected to port ${PORT}`);
});