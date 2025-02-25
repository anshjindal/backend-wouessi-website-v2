const express = require("express");
const router = express.Router();
const Contact = require("../models/contact"); // Import Contact model
const sendMail = require("../helpers/sendMail"); // Import the sendMail function

// POST route to handle contact form submission
router.post("/", async (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  // Input validation (you can add more as per your requirement)
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Save contact data to the database
    const newContact = new Contact({
      name,
      email,
      phone,
      subject,
      message,
    });

    const savedContact = await newContact.save(); // Save the document

    if (!savedContact) {
      return res
        .status(400)
        .json({ error: "An error occurred while saving contact" });
    }

    // Send confirmation email after saving the contact
    const isEmailSent = await sendMail(
      name,
      email,
      phone,
      subject,
      message,
      "contact"
    );

    if (isEmailSent?.status !== "success") {
      return res.status(400).json({ error: "Error in sending email" });
    }

    return res
      .status(200)
      .json({ message: "Thank you for sending us a message, someone from our team will reach out to you soon." });
  } catch (error) {
    return res
      .status(500)
      .json({ error: "An error occurred while handling contact submission" });
  }
});

module.exports = router;
