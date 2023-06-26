import express from 'express'

import { Order } from '../model/order';
import { tableizeOrders } from '../ui/order';

// // Require express
// const express = require("express");

// Initialize express
const app = express();
const PORT = 8080;

// parse JSON
app.use(express.json());

// parse URL encoded data
app.use(express.urlencoded({ extended: true }));

app.post('/order', (req: { body: Order }, res, next) => {
    console.log(`\n\n---------- order update ----------\n\n`)
    tableizeOrders([req.body])
    res.status(200).send(req.body)
})

app.post('/return', (req, res, next) => {
    console.log(`\n\n---------- return update ----------\n\n`)
    console.log(req.body)
    res.status(200).send(req.body)
})

app.post('/communication', (req, res, next) => {
    console.log(`\n\n---------- communication update ----------\n\n`)
    console.log(req.body)
    res.status(200).send(req.body)
})

// create a server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});