const express = require("express")
const server = express()
const nunjucks = require("nunjucks")

// Configura a pasta pública
server.use(express.static("public"))

// Configura o Nunjucks
nunjucks.configure("src/views", {
  express: server,
  noCache: true,
})

const proffys = [
  {
    name: "Diego Fernandes",
    avatar: "https://github.com/diego3g.png",
    whatsapp: "99999999999",
    bio: "Entusiasta das melhores tecnologias de química avançada. Apaixonado por explodir coisas em laboratório e por mudar a vida das pessoas através de experiências. Mais de 200.000 pessoas já passaram por uma das minhas explosões.",
    subject: "Química",
    cost: "20",
    weekday: [0],
    time_from: [720],
    time_to: [1120],
  },
  {
    name: "Mayk Brito",
    avatar: "https://github.com/maykbrito.png",
    whatsapp: "99999999999",
    bio: "Instrutor de Educação Física para iniciantes, minha missão de vida é levar saúde e contribuir para o crescimento de quem se interessar. <br/> Comecei a minha jornada profissional em 2001, quando meu pai me deu dois alteres de 32kg com a seguinte condição: Aprenda a fazer dinheiro com isso!",
    subject: "Educação Física",
    cost: "40",
    weekday: [1],
    time_from: [820],
    time_to: [2120],
  },
]

const subjects = [
  "Artes",
  "Biologia",
  "Ciências",
  "Educação física",
  "Física",
  "Geografia",
  "História",
  "Matemática",
  "Português",
  "Química",
]

const weekdays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

server.get("/", (req, res) => {
  return res.render("index.njk")
})

server.get("/study", (req, res) => {
  const filters = req.query

  return res.render("study.njk", {
    proffys,
    filters,
    subjects,
    weekdays,
  })
})

server.get("/give-classes", (req, res) => {
  const data = req.query

  const isEmpty = Object.keys(data).length <= 0

  if (!isEmpty) {
    proffys.push({
      ...data,
      subject: subjects[data.subject - 1],
    })
    return res.redirect("/study")
  }

  return res.render("give-classes.njk", {
    subjects,
    weekdays,
  })
})

server.listen(5500)
