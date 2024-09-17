require("dotenv").config();
const axios = require("axios");

const ZOOM_API_BASE_URL = process.env.ZOOM_BASE_URL;

// Function to generate a Zoom Server-to-Server OAuth token
async function getZoomAccessToken() {
  const response = await axios.post("https://zoom.us/oauth/token", null, {
    params: {
      grant_type: "account_credentials",
      account_id: process.env.ZOOM_ACCOUNT_ID,
    },
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${process.env.ZOOM_CLIENT_ID}:${process.env.ZOOM_CLIENT_SECRET}`
      ).toString("base64")}`,
    },
  });

  return response.data.access_token;
}

// Function to create a Zoom meeting
async function createZoomMeeting(meetingDetails) {
  const accessToken = await getZoomAccessToken();
  const response = await axios.post(
    `${ZOOM_API_BASE_URL}/users/me/meetings`,
    { ...meetingDetails, timezone: "Asia/Kolkata" },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

// Function to list Zoom meetings
async function listZoomMeetings() {
  const token = await getZoomAccessToken();
  const response = await axios.get(`${ZOOM_API_BASE_URL}/users/me/meetings`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

module.exports = {
  createZoomMeeting,
  listZoomMeetings,
};
