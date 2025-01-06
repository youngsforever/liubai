// reference: https://github.com/leegsen7/amr2mp3/blob/master/app.js

const ffmpeg = require('fluent-ffmpeg')
const express = require('express')
const fs = require('fs')
const path = require('path')
const fs2 = require('fs').promises

const app = express()
const port = 3000

app.use(express.static(__dirname + '/'))
app.use('/static', express.static(path.join(__dirname, 'static')))

function getPath(id, type = "amr") {
  if(type === "amr") {
    return `static/amr/${id}.amr`
  }
  return `static/mp3/${id}.mp3`
}

async function downloadAMR(url, id) {
  const filePath = path.join(__dirname, getPath(id))

  // 1. download
  let response
  try {
    response = await fetch(url)
  }
  catch(err) {
    console.warn("downloading amr failed!")
    console.log(err)
    return
  }

  // 2. write
  const writer = fs.createWriteStream(filePath)
  response.body.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on("finish", resolve)
    writer.on("error", reject)
  })
}

function transformIntoMP3(id) {
  return new Promise((resolve, reject) => {
    const amrPath = getPath(id)
    const mp3Path = getPath(id, "mp3")
    ffmpeg(amrPath).on("end", () => {
      resolve()
    }).on("error", err => {
      reject(err)
    }).save(mp3Path)
  })
}

app.get("new", async (req, res) => {
  // 1. check out params
  const amrUrl = req.query.url
  const amrId = req.query.id
  if(!amrUrl || !amrId) {
    res.send({ code: "E4000", errMsg: "url and id are required" })
    return
  }

  // 2. check out id
  const stamp2 = Number(id)
  const now2 = Date.now()
  if(!stamp2 || isNaN(stamp2)) {
    res.send({ code: "E4000", errMsg: "id is invalid" })
    return
  }
  const diffStamp = Math.abs(now2 - stamp2)
  if(diffStamp > 60000) {
    res.send({ code: "E4000", errMsg: "id is expired" })
    return
  }

  // 3. download amr
  try {
    await downloadAMR(amrUrl, amrId)
  }
  catch(err) {
    console.warn("downloading amr failed!!!")
    console.log(err)
    res.send({ code: "E5001", errMsg: "downloading amr failed" })
    return
  }

  // 4. transform
  try {
    await transformIntoMP3(amrId)
  }
  catch(err) {
    console.warn("transforming amr to mp3 failed!!!")
    console.log(err)
    res.send({ code: "E5001", errMsg: "transforming amr to mp3 failed" })
    return
  }

  // 5. send mp3
  const mp3Path = "/" + getPath(amrId, "mp3")
  res.send({ code: "0000", data: { mp3Path } })
})


async function checkDir() {
  // 1. create ./static/amr
  try {
    await fs2.mkdir("./static/amr", { recursive: true })
    console.log("creating static/amr succeed!")
  }
  catch(err) {
    console.warn("fail to create static/amr")
    console.log(err)
  }

  // 2. create ./static/mp3
  try {
    await fs2.mkdir("./static/mp3", { recursive: true })
    console.log("creating static/mp3 succeed!")
  }
  catch(err) {
    console.warn("fail to create static/mp3")
    console.log(err)
  }
}

checkDir()

app.listen(port, () => {
  console.log(`app is running on ${port}`)
})
