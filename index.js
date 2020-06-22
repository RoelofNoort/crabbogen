const express = require('express'); // Express
const ffmpeg = require('fluent-ffmpeg'); // Fluent-ffmpeg
const fs = require('fs'); // Fs

// App
const app = express();

// Configuration
const config = {
    port: 80,
    ffmpegLocation: "C:\\ffmpeg\\bin\\ffmpeg.exe"
};

// Check if ffmpeg exists there
fs.access(config.ffmpegLocation, fs.F_OK, (err) => { if(err) return console.log("FFMPEG not installed properly"); });

// Pages
const commaPage = __dirname + "/webpage/komma.html",
      errorPage = __dirname + "/webpage/error.html";

// Router
app.get('/crabbo', function(req, res)  {
    if (res.statusCode = 200) {
        if (!req.query.text) {
            return res.sendFile(errorPage);
        } else generate(req.query.text, res);
    } else res.send("There was an error");
});


// Generate function
function generate(text, res) {
    var crabboFile  = __dirname + "/data/" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".mp4"; // Random file name
    text = text.split("[").join("(").split("]").join(")");
    if(!text.includes(",")) return res.sendFile(commaPage); // If the text doesn't include a comma, send the commapage back

    var text = text.trim(),
        text = text.split(",")
        text1L = text[0].trim(),
        text1L = text1L.length,
        text2L = text[1].trim(),
        text2L = text2L.length;

    try {
        var proc = ffmpeg();
        var input = __dirname + "/data/crab.mp4";
        proc.setFfmpegPath(config.ffmpegLocation)
            .input(input)
            .videoBitrate('700')
            .addOption('-preset', 'veryfast')
            .inputOption('-threads', '16')

            .on('end', function() {
                res.setHeader('Content-Type', 'video/mp4');
                res.download(crabboFile, "crab.mp4", function(err) {
                    if (err) return console.error(err);
                    console.log("Successfully sended crabrave with title: " + '"' + text + '"');
                    res.end();
                    fs.unlinkSync(crabboFile);
                })
            })
            .on('error', function(err) {
                console.log('An error occured: ' + err.message);
                fs.unlinkSync(crabboFile);
            })
            .videoFilters({
                filter: 'drawtext',
                options: {
                    fontfile: './data/hacked.ttf',
                    text: `${text[0]}`,
                    fontsize: '60',
                    x: (856/2-30*text1L/2),
                    y: 'H-240',
                    fontcolor: 'white',
                    shadowcolor: 'black',
                    shadowx: '2',
                    shadowy: '2'
                }
            }, {
                filter: 'drawtext',
                    options: {
                        fontfile: './data/hacked.ttf',
                        text: `${text[1]}`,
                        fontsize: '60',
                        x: (856/2-30*text2L/2),
                        y: 'H-170',
                        fontcolor: 'white',
                        shadowcolor: 'black',
                        shadowx: '2',
                        shadowy: '2'
                    }
                }
            ).save(crabboFile);
    } catch(e) { console.error(e); };
};

// Listen
app.listen(config.port, () => { console.log(`Server started at port: ${config.port}`); });
