const express = require("express");
const puppeteer = require("puppeteer");

const app = express();

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;

  if (!url) {
    return res.send("Please provide URL");
  }

  try {
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.goto(url, {
      waitUntil: "networkidle2"
    });

    // Optional: set viewport (important for design)
    await page.setViewport({
      width: 1200,
      height: 630
    });

    const screenshot = await page.screenshot({
      type: "png"
    });

    await browser.close();

    res.set("Content-Type", "image/png");
    res.send(screenshot);

  } catch (err) {
    res.status(500).send(err.toString());
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});