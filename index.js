import express from 'express'
import {create} from 'express-handlebars'
import mongoose from 'mongoose'
import flash from 'connect-flash'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv'

import varMiddleware from './middleware/var.js'
import userMiddleware from './middleware/user.js'
import hbsHelper from './utils/ifequal.js'

// Routes
import AuthRoutes from './routes/auth.js'
import ProjectRoutes from './routes/projects.js'
import { dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

dotenv.config()

const app = express()
app.use(express.static(__dirname));

const hbs = create({
  defaultLayout: 'main',
  extname: 'hbs',
  helpers: hbsHelper,
})

app.engine('hbs', hbs.engine)
app.set('view engine', 'hbs')
app.set('views', './views')

app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookieParser())
app.use(session({secret: 'Muhammadqodir', resave: false, saveUninitialized: false}))
app.use(flash())
app.use(varMiddleware)
app.use(userMiddleware)

app.use(AuthRoutes)
app.use(ProjectRoutes)

const startApp = () => {
  try {
    mongoose.set('strictQuery', false)
    mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true}, () => console.log("Mongo DB connected"))
    // {
    //   useNewUrlParser: true,
    //   useFindAndModify: false,
    //   useUnifiedTopology: true,
    // }

    const PORT = process.env.PORT || 4100
    app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))
  } catch(error) {
    console.log(error)
  }
}

startApp()