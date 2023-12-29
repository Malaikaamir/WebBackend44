const express = require("express");
let router = express.Router();
const validateCustomer = require("../../middlewares/validatecustomer"); // Assuming you have a file named validateCustomer.js
const { Customer } = require("../../models/customer"); // Assuming you have a file named customer.js for the model

// Get Customers
router.get("/", async (req, res) => {
  let page = Number(req.query.page ? req.query.page : 1);
  let perPage = Number(req.query.perPage ? req.query.perPage : 10);
  let skipRecords = perPage * (page - 1);
  let customers = await Customer.find().skip(skipRecords).limit(perPage);
  return res.send(customers);
});


// Get a single Customer
router.get("/:id", async (req, res) => {
  try {
    let customer = await Customer.findById(req.params.id);
    if (!customer)
      return res.status(400).send("Customer with given ID is not present"); // When id is not present in the database
    return res.send(customer); // Everything is okay
  } catch (err) {
    return res.status(400).send("Invalid ID"); // Format of ID is not correct
  }
});

// Update a record
router.put("/:id", validateCustomer, async (req, res) => {
  let customer = await Customer.findById(req.params.id);
  customer.name = req.body.name;
  customer.marks = req.body.marks;
  await customer.save();
  return res.send(customer);
});

// Delete a record
router.delete("/:id", async (req, res) => {
  let customer = await Customer.findByIdAndDelete(req.params.id);
  return res.send(customer);
});

// Insert a record
router.post("/", validateCustomer, async (req, res) => {
  let newCustomer = new Customer();
  newCustomer.id = req.body.id;
  newCustomer.name = req.body.name;
  newCustomer.marks = req.body.marks;
  await newCustomer.save();
  return res.send(newCustomer);
});

module.exports = router;
