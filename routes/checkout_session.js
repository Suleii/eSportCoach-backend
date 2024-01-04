var express = require("express");
var router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SK_API);
const CoachProfile = require("../models/coachesProfile");
const UserLogin = require("../models/usersLogin");

// Route pour créer une session de paiement
router.post("/create-checkout-session", async (req, res) => {
  const { coachName } = req.body;

  const user = await UserLogin.findOne({ username: coachName });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }

  // Trouver le profil du coach associé à l'utilisateur
  const coach = await CoachProfile.findOne({ user: user._id }).populate("user");
  if (!coach) {
    return res.status(404).json({ error: "Coach not found" });
  }

  const productName = `${user.username} - 1 session`;
  const productPrice = coach.price * 100; // Le prix en centimes

  const session = await stripe.checkout.sessions.create({
    ui_mode: "embedded",
    payment_method_types: ["card", "paypal"],
    line_items: [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: productName,
          },
          unit_amount: productPrice, // Le prix en centimes
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    return_url: `https://experience-frontend.vercel.app/paymentReturn?session_id={CHECKOUT_SESSION_ID}`,
  });

  res.send({ clientSecret: session.client_secret, productName, productPrice });
});

router.get("/session-status", async (req, res) => {
  const session = await stripe.checkout.sessions.retrieve(req.query.session_id);

  res.json({
    status: session.status,
    customer_email: session.customer_details.email,
  });
});

// route pour traiter le paiement

router.post("/process_payment", async (req, res) => {
  try {
    const { paymentMethodId, amount } = req.body;

    // Traitez le paiement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Montant à facturer
      currency: "EUR",
      payment_method: paymentMethodId,
      description: "test de stripe",
      confirm: true, // Confirme le paiement immédiatement
      return_url: "https://experience-frontend.vercel.app/",
    });
    console.log("Payment", paymentIntent);
    res.json({
      message: "Payment successful",
      success: true,
    });
  } catch (error) {
    console.log("Error", error);
    res.json({
      message: "Payment failed",
      success: false,
    });
  }
});

module.exports = router;
