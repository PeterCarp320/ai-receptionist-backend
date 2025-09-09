import express from "express";

const app = express();
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running ✅");
});

// Webhook route
app.post("/webhook/vapi", (req, res) => {
  const { type, action, form, intent } = req.body;

  if (type === "kiosk.book") {
    const { name, email, date, time } = form || {};
    return res.json({
      message: `📅 Appointment booked for ${name} on ${date} at ${time}. Confirmation sent to ${email}.`
    });
  }

  if (type === "kiosk.checkin") {
    const { email } = form || {};
    return res.json({
      message: `✅ Check-in successful for ${email}. Welcome back!`
    });
  }

  if (type === "kiosk.action") {
    if (action === "book_appointment") {
      return res.json({ message: "📅 Appointment booked!" });
    }
    if (action === "check_in") {
      return res.json({ message: "✅ Checked in!" });
    }
  }

  // Fallback
  res.json({ message: "Unknown request type" });
});

// Port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
