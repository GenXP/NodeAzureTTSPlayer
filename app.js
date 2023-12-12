"use strict";
import http from "http";
import { BasicClient } from "./Library/BasicClient.js";
import { Configuration } from "./Library/Configuration.js";

const config = new Configuration();
const client = new BasicClient();
client.connect(`ws://${config.Get("wsHost")}:${config.Get("wsPort")}/`, "echo-protocol");