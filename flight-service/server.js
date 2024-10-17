const express = require("express");
const mongoose = require("mongoose");
const axios = require('axios');

const app =express();
const PORT =3002;
app.use(express.json())

mongoose.connect('mongodb://mongodb:27017/flightdb')
.then(()=>{console.log("mongo connected")})
.catch((err)=>{console.log(err)});

const Flights = mongoose.model('Flights',{
    flightId : Number,
    flightName : String,
    capacity : Number,
    airLineId: Number,
});

app.get('/flights',async(req,res)=>{
    try{
        const flights = await Flights.find();
        res.json(flights);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching Airlines' });
      }
})


app.get('/flights/:flightId',async(req,res)=>{
    const {flightId}=req.params;
    try{
        const flight = await Flights.findOne({flightId : flightId});
        if(flight){
            res.json(flight);
        }else{
            res.status(500).json({error:"Flight not found"})
        }
    }catch(error){
        res.status(500).json({error:"Error fetching Flight"});
    }
});

app.post('/flights',async(req,res)=>{

    const {flightId,flightName,capacity,airLineId}=req.body;
    const newFlight = new Flights({
        flightId,
        flightName,
        capacity,
        airLineId,
    });
    try{
    await newFlight.save();
    res.status(201).json(newFlight);
} catch (error) {
  res.status(500).json({ error: 'Error creating Flight' });
}
});

app.get('/flights/:flightId/passengers/',async(req,res)=>{
    try{
        const flight = await Flights.findOne({flightId : req.params.flightId});

    const response = await axios.get(`http://passenger-service:3003/passengers/${req.params.flightId}`);
    const passengers = response.data;
    res.status(201).json({flight,passengers});
    }

    catch(error){
        res.json({error:"error fetching passengers of this flight"})
    }


});

app.get('/flights/airline/:airLineId', async (req,res)=>{
    const airLineId = req.params.airLineId;
    try{
        const flights = await Flights.find({airLineId:airLineId});
        res.json(flights);
    }catch(error){
        res.status(500).json({error:"Error in fetching flights of this airline"})
    }
})


app.listen(PORT,()=>{
    console.log(`connected to port ${PORT}`);
});