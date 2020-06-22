const express = require('express')
const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

const app = express()
const htmlerror = __dirname + "/webpage/error.html"
const port = 80

app.get('/crabbo', function(req, res)  {
    var crabtext = req.query.text
    if (res.statusCode = 200) {
        if (!crabtext) {
            res.sendFile(htmlerror)
            return
        } else {
            generate(crabtext, res)
        }  
    } else {
        res.send("there was an error")
    }
})

app.listen(port, () => {
    console.log(`Server started at port ${port}`)
    return
})

function generate(crabtext, res) {
    try {
    var inputcrab = __dirname + "/data/crab.mp4"
    var kommapage = __dirname + "/webpage/komma.html"
    var crabbomp4 = __dirname + "/data/" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + ".mp4"
    var text = crabtext.split("[").join("(").split("]").join(")")
    var comma = text.includes(",")
    if (!comma == true) {
        res.sendFile(kommapage)
        return
    } else {
    var text = text.trim()
    var text = text.split(",")
    var proc = ffmpeg()
    var text1L = text[0].trim()
    var text1L = text1L.length
    var text2L = text[1].trim()
    var text2L = text2L.length

proc.setFfmpegPath("C:\\ffmpeg\\bin\\ffmpeg.exe")
    .input(inputcrab)
    .videoBitrate('700')
    .addOption('-preset', 'veryfast')
    .inputOption('-threads', '16')

    .on('end', function() {
        res.setHeader('Content-Type', 'video/mp4')
        res.download(crabbomp4, "crab.mp4", function(err) {
            if (err) { console.log(err)
            } else {
                console.log("successfully sended crabrave with title: " + '"' + crabtext + '"')
                res.end()
                fs.unlinkSync(crabbomp4)
                return
                }
            })
        })

    .on('error', function(err) {
        console.log('an error happened: ' + err.message)
        fs.unlinkSync(crabbomp4)
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
    }},{
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
    }})
    .save(crabbomp4)
    }} catch(err) {console.log(err)}
}