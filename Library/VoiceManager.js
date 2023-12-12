"use strict";
import { ResultReason, SpeechSynthesizer, SpeechConfig, AudioConfig } from "microsoft-cognitiveservices-speech-sdk";
import { Configuration } from "./Configuration.js";
import { fork } from "child_process";

const config = new Configuration();

export class VoiceManager {
  children = new Set();

  constructor() {
  }

  async Speak(message) {

    var speechKey = message.key || config.Get("key");
    var speechRegion = message.region || config.Get("region");
    var voicetype = message.voice || config.Get("voice");
    var messageUID = "tmp-audio";
    var audioFile = messageUID + ".wav";
    const speechConfig = SpeechConfig.fromSubscription(speechKey, speechRegion);
    speechConfig.speechSynthesisVoiceName = voicetype;

    const ssmlWrapper = `<speak version='1.0' xml:lang='en-US' xmlns='http://www.w3.org/2001/10/synthesis' xmlns:mstts='http://www.w3.org/2001/mstts'> \r\n \
      <voice name='${speechConfig.speechSynthesisVoiceName}'> \r\n \
          <mstts:viseme type='redlips_front'/> \r\n \
          ${message.text} \r\n \
      </voice> \r\n \
    </speak>`;
    //var ssmlContent message.ssml || ssmlWrapper;

    const audioConfig = AudioConfig.fromAudioFileOutput(audioFile);
    let synthesizer = new SpeechSynthesizer(speechConfig, audioConfig);
    let weakSelf = this;

    // for (const child of Object.values(weakSelf.children)) {
    //   child.kill()
    //   child.send("go-away");
    //   console.log("getting here");
    // }

    weakSelf.children.forEach(child => {
      child.kill()
      console.log("getting here");
    });
    weakSelf.children.clear();

    return new Promise(function (resolve, reject) {
      let visemes = [];
      synthesizer.visemeReceived = (s, e) => {
        if (config.Log > 1) {
          console.log("(Viseme), Audio offset: " + e.audioOffset / 10000 + "ms. Viseme ID: " + e.visemeId);
          visemes.push({ offset: e.audioOffset, id: e.visemeId });
        }
      };
      synthesizer.speakSsmlAsync(ssmlWrapper,
        async function (result) {
          if (result.reason === ResultReason.SynthesizingAudioCompleted) {
            // let player = new Speaker({ channels: config.Get("channels"), sampleRate: config.Get("sampleRate"), bitDepth: config.Get("bitDepth") });
            // weakSelf.speakers.add(player)
            // const bufferStream = new PassThrough();
            // bufferStream.end(Buffer.from(result.audioData));
            // bufferStream.pipe(player);
            console.log("hi");
            console.log(weakSelf.children.size);


            var child = fork("SpeakerWorker.js", [audioFile], { cwd: process.cwd() });

            child.send("started");
            child.on("message", function (message) {
              console.log(`Message from child.js: ${message}`);
            });

            child.on('exit', function (code, signal) {
              console.log('child process exited with ' +
                `code ${code} and signal ${signal}`);
            });
            weakSelf.children.add(child);

            resolve(visemes);
          } else {
            if (config.Log > 1) {
              console.error(`Speech synthesis canceled\n\tREASON: ${result.errorDetails}\nDid you set the speech resource key and region values?`);
            }
            reject(new Error(result.reason));
          }
          synthesizer.close();
          synthesizer = null;
        },
        function (err) {
          console.trace("err - " + err);
          synthesizer.close();
          synthesizer = null;
          reject(err);
        });
    });
  }
}
