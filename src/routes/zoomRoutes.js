const crypto = require("crypto");
const express = require("express");
const {
  createZoomMeeting,
  listZoomMeetings,
} = require("../services/zoomServices");

const router = express.Router();

// Route to create signature
router.post("/generateSignature", async (req, res) => {
  try {
    const { meetingNumber, role } = req.body;
    // Generate timestamp
    const timestamp = new Date().getTime() - 30000;
    // Create the signature
    const msg = Buffer.from(
      process.env.ZOOM_CLIENT_ID + meetingNumber + timestamp + role
    ).toString("base64");
    const hash = crypto
      .createHmac("sha256", process.env.ZOOM_CLIENT_SECRET)
      .update(msg)
      .digest("base64");
    const signature = Buffer.from(
      `${process.env.ZOOM_CLIENT_ID}.${meetingNumber}.${timestamp}.${role}.${hash}`
    ).toString("base64");
    // Send the signature back to the client
    res.json({ signature });
  } catch (error) {
    console.log(
      "Error generating signature:",
      error.response?.data || error.message
    );
  }
});

// Route to create a Zoom meeting
router.post("/meeting", async (req, res) => {
  try {
    const meetingDetails = req.body;
    const meeting = await createZoomMeeting(meetingDetails);
    res.json(meeting);
  } catch (error) {
    console.error(
      "Error creating Zoom meeting:",
      error.response?.data || error.message
    );
    res.status(500).send("Error creating Zoom meeting");
  }
});

// Route to list Zoom meetings
router.get("/meetings", async (req, res) => {
  try {
    const meetings = await listZoomMeetings();
    res.json(meetings);
  } catch (error) {
    console.error(
      "Error fetching Zoom meetings:",
      error.response?.data || error.message
    );
    res.status(500).send("Error fetching Zoom meetings");
  }
});

module.exports = router;
