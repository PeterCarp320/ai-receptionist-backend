import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health check (basic test route)
app.get("/", (_req, res) => {
  res.json({ ok: true, service: "ai-receptionist-backend" });
});

// ---- VAPI WEBHOOK (MVP) ----
// This is just a fake booking response for now
app.post("/webhook/vapi", async (req, res) => {
  const evt = req.body || {};
  console.log("VAPI EVENT:", JSON.stringify(evt));

  if (evt.type === "call.intent" && evt.intent === "book_appointment") {
    const fakeConfirmation = {
      when: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      where: "Main Office",
      with: "Dr. Smith",
      confirmationId: Math.random().toString(36).slice(2, 8),
    };
    return res.json({
      action: "reply",
      message: `Got it. I booked you for ${fakeConfirmation.when} with ${fakeConfirmation.with}. Confirmation ${fakeConfirmation.confirmationId}.`,
      data: fakeConfirmation,
    });
  }

  res.json({ action: "noop" });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API running on :${PORT}`);
});
