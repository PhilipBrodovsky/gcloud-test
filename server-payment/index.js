// This is a public sample test API key.
// Don’t submit any personally identifiable information in requests made with this key.
// Sign in to see your own test API key embedded in code samples.
const stripe = require("stripe")("");
const express = require("express");
const app = express();
app.use(express.static("public"));

const path = require("path");
const fs = require("fs");

fs.open("./file.txt", "w", () => {});

fs.writeFile("file.txt", "sdadasdsadsadas", () => {});
console.log(fs.readFileSync("./file.txt", { encoding: "utf8" }));

const YOUR_DOMAIN = "http://localhost:4242";

app.get("/create-checkout-session", async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    price: "price_1L7QKQCQHhfHAv8xZxrfHaC4",
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${YOUR_DOMAIN}/success.html`,
            cancel_url: `${YOUR_DOMAIN}/cancel.html`,
        });

        res.redirect(303, session.url);
    } catch (error) {
        console.log(error.message);
        res.json(error);
    }
});

app.listen(4242, () => console.log("Running on port 4242"));
