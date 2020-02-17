// const express = require('express');
import express from "express";

const app = express();
const port = 5000;

app.get('/', (req, res) => {
    res.send('hello');
});

app.listen(port, err => {
    if(err){
        return console.error(err);
    }
    return console.log(`server is listening on port ${port}`);
})
