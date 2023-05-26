const { OEMSpecs } = require("../model/oemspace.model");
const { Owner } = require("../model/user.model");
const asyncHandler = require("express-async-handler");
// Create a new car and associate it with the authenticated user
exports.createCar = async (req, res) => {
  try {
    const {
      image,
      model,
      year,
      listPrice,
      colors,
      mileage,
      power,
      maxSpeed,
      odometer,
      majorScratches,
      originalPaint,
      accidentsReported,
      previousBuyers,
      registrationPlace,
    } = req.body;
    console.log(req.body);

    const { userId } = req.user;
    console.log(userId);

    const user = await Owner.findById(userId);
    console.log("user", user);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const car = new OEMSpecs({
      image,
      model,
      year,
      listPrice,
      colors,
      mileage,
      power,
      maxSpeed,
      odometer,
      majorScratches,
      originalPaint,
      accidentsReported,
      previousBuyers,
      registrationPlace,
      Owner: user,
    });

    // Save the car to the database
    const savedCar = await car.save();

    // Return the saved car as a response
    res.status(201).json(savedCar);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to create car" });
  }
};

exports.get_model_year_controller = asyncHandler(async (req, res) => {
  try {
    const { model, year } = req.params;
    const oemSpecs = await OEMSpecs.find({ model, year });
    res.json(oemSpecs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get OEM Specs" });
  }
});

exports.getallcontroller = asyncHandler(async (req, res) => {
  try {
    const oemSpecs = await OEMSpecs.find();
    res.json(oemSpecs);
  } catch (error) {
    res.status(500).json({ error: "Failed to get OEM Specs" });
  }
});


exports.editcarController = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { listPrice } = req.body;

  try {
    const updatedCar = await OEMSpecs.findByIdAndUpdate(
      id,
      { listPrice },
      { new: true }
    );

    if (!updatedCar) {
      return res.status(404).json({ message: 'Car not found' });
    }

    res.json(updatedCar);
  } catch (error) {
    res.status(500).json({ message: 'Error updating car', error });
  }
});









exports.deletecarController = asyncHandler(async (req, res) => {
  const { id } = req.params;

  OEMSpecs.findByIdAndRemove(id)
    .then(() => res.sendStatus(204))
    .catch((err) => res.status(500).json(err));
});

exports.getcarprice = asyncHandler(async (req, res) => {
  const { minPrice, maxPrice } = req.params;
  console.log(req.params);
  try {
    const cars = await OEMSpecs.find({
      listPrice: { $gte: minPrice, $lte: maxPrice },
    });
    res.json(cars);
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching cars." });
  }
});

exports.getcarColor = asyncHandler(async (req, res) => {
  console.log(req.params);
  try {
    const { colors } = req.params;
    console.log(colors);
    const oemSpecs = await OEMSpecs.find({ colors });
    res.json(oemSpecs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to color" });
  }
});

exports.getcarmileage = asyncHandler(async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.params;
    const cars = await OEMSpecs.find({
      mileage: { $gte: minPrice, $lte: maxPrice },
    });
    res.json(cars);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "An error occurred while fetching cars." });
  }
});

exports.getCarsByColor = async (req, res) => {
  const { colors } = req.params;
  console.log(colors);
  try {
    const cars = await OEMSpecs.find({ colors: colors });
    res.json(cars);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching cars by color." });
  }
};

// carrouter.get('/api/users/:userId/cars', async (req, res) => {
exports.getcarbyuser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await Owner.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const cars = await OEMSpecs.find({ Owner: userId });
    res.json({ cars });
  } catch (error) {
    console.error("Error fetching cars:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
