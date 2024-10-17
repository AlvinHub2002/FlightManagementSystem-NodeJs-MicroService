const express = require('express');
const mongoose = require("mongoose");
const axios = require('axios'); // Install axios for HTTP requests

const app = express();
const PORT = 3003;

app.use(express.json())

mongoose.connect('mongodb://mongodb:27017/passengerdb')
.then(()=>{console.log("MongoDB connected")})
.catch((err)=>{console.log(err)})

const Passengers = mongoose.model('Passengers',{
    passengerId : Number,
    passengerName : String,
    PassengerEmail : String,
    flightId : Number
});

app.get('/passengers' , async(req,res)=>{
    try{
        const passengers = await Passengers.find();
        res.json(passengers);
    }
    catch(error){
        res.status(500).json({error:"Error fetching passengers"});
    }
});

app.get('/passengers/:passengerId',async(req,res)=>{
    const {passengerId} =req.params.passengerId;
    try{
        const passenger = await Passengers.find({passengerId : passengerId});
        if(passenger){
            res.json(passenger);
        }
        else{
            res.json({error :"passenger not found"});
        }
    }
    catch(error){
        res.status(500).json({error:"Error fetching passenger"});
    }
})


app.post('/passengers',async(req,res)=>{
    const{passengerId,passengerName,PassengerEmail,flightId} = req.body;
    const newPassengers = new Passengers({
        passengerId,
        passengerName,
        PassengerEmail,
        flightId
    })
    try{
        await newPassengers.save();
        res.json(newPassengers);
    }
    catch(error){
        res.status(500).json({error:"Error creating new Passenger"});
    }
});

app.get("/passengers/:flightId", async(req,res)=>{
    const flightId = req.params.flightId;
    try{
        const passengers = await Passengers.find({flightId:flightId});
        res.json(passengers);
    }
    catch(error){
        res.json({error:"error fetching passengers with flightId"})
    }
})


app.listen(PORT,()=>{
    console.log(`connected to port ${PORT}`);
});