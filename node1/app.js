// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use strict";

// [START gae_node_request_example]
const express = require("express");

const axios = require("axios").default;

const { MongoClient, ServerApiVersion } = require("mongodb");

let client = null;
async function dbConnect() {
    if (client) return client;

    const uri =
        "mongodb+srv://philbro:philbro324@personalcluster.qrsle.mongodb.net/?retryWrites=true&w=majority";
    client = new MongoClient(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverApi: ServerApiVersion.v1,
    });

    await client.connect();
    return client;
}

// https://VERSION-dot-SERVICE-dot-PROJECT_ID.REGION_ID.r.appspot.com

const app = express();

app.set("trust proxy", true);

app.get("/", async (req, res) => {
    const client = await dbConnect();

    const res1 = await axios.get(
        "https://node2-dot-tutorial-351208.ew.r.appspot.com/"
    );
    console.log("data", res1.data);
    const users = await client
        .db("website")
        .collection("users")
        .find()
        .toArray();

    res.setHeader("rows-count", 10);

    res.json({ users });
});

// Start the server
const PORT = parseInt(process.env.PORT) || 8888;
app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log("Press Ctrl+C to quit.");
});
// [END gae_node_request_example]

module.exports = app;
