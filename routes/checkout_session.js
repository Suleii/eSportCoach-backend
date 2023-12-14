var express = require('express');
var router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SK_API);
const CoachProfile = require("../models/coachesProfile");



// Route pour créer une session de paiement
router.post('/create-checkout-session', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: 'Nom du produit/service',
                        },
                        unit_amount: 2000, // Le prix en centimes
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3001`,
            cancel_url: `http://localhost:3001`,
        });

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// route pour traiter le paiement

router.post('/process_payment', async (req, res) => {
    try {
        const { paymentMethodId, amount } = req.body;
    
        // Traitez le paiement
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount, // Montant à facturer
            currency: 'EUR',
            payment_method: paymentMethodId,
            description: "test de stripe",
            confirm: true, // Confirme le paiement immédiatement
            return_url: 'http://localhost:3001'
        });
        console.log('Payment', paymentIntent)
        res.json({
            message: "Payment successful",
            success: true
        })

    } catch (error) {
        console.log("Error", error)
        res.json({
            message: "Payment failed",
            success: false
        })
    }
});

module.exports = router;

