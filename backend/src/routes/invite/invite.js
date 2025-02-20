const express = require('express');
const sendInviteEmail = require('../../emails/inviteEmail');

const router = express.Router();

// Route to send invite email
router.post('/invite', async (req, res) => {
    try {
        const { email } = req.body; // Get email from request payload

        if (!email) {
            return res.status(400).json({ success: false, message: "Email is required." });
        }
        await sendInviteEmail(email);
        res.json({ message: `Email sent successfully to this email : ${email}` });

    } catch (error) {
        logger.error(`Failed to send invite email: ${error.message}`);
        return res.status(500).json({
            success: false,
            message: 'Failed to send invite email. Please try again later.',
        });
    }
});

module.exports = router;
