import express from 'express';
import { configDotenv } from 'dotenv';
import mongoose from 'mongoose';

configDotenv({ path: './config.env', debug: true, encoding: 'UTF-8'});

const DB = mongoose.connect(process.env.MONGODB_URI).then(console.log("connected to DB"));

const port = process.env.PORT || 3000;

const { default : app} = await import('./app.js');

app.listen(port, ()=> {
    console.log("listening on port"+port);
});