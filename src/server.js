const express = require("express")
const server = express()
const nunjucks = require("nunjucks")
const { subjects, weekdays, convertHoursToMinutes } = require("./utils/format")
const Database = require("./database/db")
const createProffy = require("./database/createProffy")

server.use(express.static("public"))
server.use(express.urlencoded({ extended: true }))

nunjucks.configure("src/views", {
  express: server,
  noCache: true,
})

server.get("/", (req, res) => {
  return res.render("index.njk")
})

server.get("/study", async (req, res) => {
  const filters = req.query

  if (Object.keys(filters).length === 0) {
    try {
      const query = `
        SELECT proffys.*, classes.* FROM proffys
        JOIN classes ON (classes.proffy_id = proffys.id);
      `

      const db = await Database
      const proffys = await db.all(query)

      return res.render("study.njk", {
        proffys,
        filters,
        subjects,
        weekdays,
      })
    } catch (error) {
      console.log(error)
    }
  }

  const timeToMinutes = convertHoursToMinutes(filters.time)

  try {
    const query = `
      SELECT proffys.*, classes.* FROM proffys
      JOIN classes ON (classes.proffy_id = proffys.id)
      WHERE EXISTS (
        SELECT class_schedule.* FROM class_schedule
        WHERE class_schedule.class_id = classes.id
        AND class_schedule.weekday = ${filters.weekday}
        AND class_schedule.time_from <= ${timeToMinutes}
        AND class_schedule.time_to > ${timeToMinutes}
      )
      AND classes.subject = ${filters.subject};
    `

    const db = await Database
    const proffys = await db.all(query)

    return res.render("study.njk", {
      proffys,
      filters,
      subjects,
      weekdays,
    })
  } catch (error) {
    console.log(error)
  }
})

server.get("/give-classes", (req, res) => {
  return res.render("give-classes.njk", {
    subjects,
    weekdays,
  })
})

server.post("/give-classes", async (req, res) => {
  console.log(req.body)

  const proffyValue = {
    name: req.body.name,
    avatar: req.body.avatar,
    whatsapp: req.body.whatsapp,
    bio: req.body.bio,
  }

  const classValue = {
    subject: req.body.subject,
    cost: req.body.cost,
  }

  const classScheduleValues = req.body.weekday.map((weekday, index) => {
    return {
      weekday,
      time_from: convertHoursToMinutes(req.body.time_from[index]),
      time_to: convertHoursToMinutes(req.body.time_to[index]),
    }
  })

  try {
    const db = await Database

    await createProffy(db, {
      proffyValue,
      classValue,
      classScheduleValues,
    })

    const query = `subject=${req.body.subject}&weekday=${req.body.weekday[0]}&time=${req.body.time_from[0]}`

    return res.redirect(`/study?${query}`)
  } catch (error) {
    console.log(error)
  }
})

server.listen(5500)
