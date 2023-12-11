const Review = require('../models/review'); // Assurez-vous que le chemin d'accès est correct
const UserLogin = require('../models/usersLogin');
const CoachProfile = require('../models/coachesProfile');




// Coach rating update
router.get('/coachRating/:username', (req, res) => {

        // Find user by username
        const user =  UserLogin.findOne({ username: req.params.username });
        if (!user) {
            return res.json({ message: "User not found" });
        }

        // Match coach profil according to username
        const coach =  CoachProfile.findOne({ user: user._id });
        if (!coach) {
            return res.json({ message: "Coach not found" });
        }

        // Rating average
        const reviews =  Review.find({ username: user._id });
        if (reviews.length === 0) {
            return res.json({ rating: "No ratings yet" });
        }

        const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length;

        // Update rating on coachProfile
        coach.rating = averageRating;
         coach.save();

        res.json({ averageRating });

});
