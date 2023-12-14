var express = require('express');
var router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SK_API);
const CoachProfile = require("../models/coachesProfile");



// Route pour créer une session de paiement
router.post('/create-checkout-session', async (req, res) => {
    const coachId = req.query.coachId; 
    const sessionType = req.query.sessionType;  

    const coach = await CoachProfile.findById(coachId).populate('user')
        if (!coach) {
            return res.status(404).json({ error: 'Coach not found' });
        }

        const productName = `${coach.user.username} - ${sessionType}`;
        const productPrice = coach.price[sessionType] * 100; // Le prix en centimes

        const session = await stripe.checkout.sessions.create({
            ui_mode: 'embedded',
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'eur',
                        product_data: {
                            name: productName
                        },
                        unit_amount: productPrice, // Le prix en centimes
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            return_url: `http://localhost:3001/paymentReturn?session_id={CHECKOUT_SESSION_ID}`
        });

        res.send({clientSecret: session.client_secret, productName, productPrice});
    });


    router.get('/session-status', async (req, res) => {
        const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
      
        res.json({
          status: session.status,
          customer_email: session.customer_details.email
        });
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

