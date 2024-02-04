const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const axios = require("axios");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.signup(email, password);

    const token = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const addItemToList = async (req, res) => {
  const { itemId } = req.body;

  try {
    if (!req.user || !req.user._id) {
      throw new Error("User not authenticated");
    }

    const userId = req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    user.myList.push(itemId);
    await user.save();

    res.status(200).json(user.myList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const removeItemFromList = async (req, res) => {
  const { itemId } = req.body;
  console.log(itemId);
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) throw Error("User not found");

    user.myList = user.myList.filter((item) => item !== itemId.toString());
    await user.save();

    res.status(200).json(user.myList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUserList = async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) throw Error("User not found");

    res.status(200).json(user.myList);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const subscribeUser = async (req, res) => {
  const { subscriptionId } = req.body;
  const userId = req.user._id;
  console.log(subscriptionId);
  console.log(userId);
  try {
    const user = await User.findById(userId);
    if (!user) throw Error("User not found");

    user.subscriptionId = subscriptionId;
    user.subscriptionStatus = "active";
    await user.save();

    res
      .status(200)
      .json({
        message: "Subscription successful",
        subscriptionId: user.subscriptionId,
      });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const cancelSubscriptionWithPayPal = async (
  subscriptionId,
  clientId,
  secret
) => {
  const encodedCredentials = Buffer.from(`${clientId}:${secret}`).toString(
    "base64"
  );
  const response = await axios.post(
    `https://api.sandbox.paypal.com/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {},
    {
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const cancelSubscription = async (req, res) => {
  const { subscriptionId } = req.body;
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;

  try {
    await cancelSubscriptionWithPayPal(subscriptionId, clientId, secret);

    await User.findByIdAndUpdate(req.user._id, {
      subscriptionId: "",
      subscriptionStatus: "cancelled",
    });

    res.send({ message: "Subscription cancelled successfully." });
  } catch (error) {
    res
      .status(500)
      .send({
        message: "Failed to cancel subscription.",
        details: error.message,
      });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    console.log(user.getSubscriptionStatus);

    res.status(200).json({
      subscriptionStatus: user.subscriptionStatus,
      subscriptionId: user.subscriptionId,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  addItemToList,
  removeItemFromList,
  getUserList,
  subscribeUser,
  cancelSubscription,
  getSubscriptionStatus,
};
