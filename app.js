"use strict";
import http from "http";
import { BasicClient } from "./Library/BasicClient.js";
import { Configuration } from "./Library/Configuration.js";

const config = new Configuration();
const client = new BasicClient();
client.connect(`ws://localhost:8889/`, "echo-protocol");
