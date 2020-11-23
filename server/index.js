const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const helmet = require('helmet')
const compression = require('compression')
const session = require('express-session')
const MongoStore = require('connect-mongodb-session')
const { ApolloServer } = require('apollo-server-express')
const cors = require('cors')

const typeDefs = require('./graphql/type-defs')
const resolvers = require('./graphql/resolvers')

const keys = require('./keys')
const fileMiddleware = require('./middleware/file.middleware')

const uploadRoutes = require('./routes/upload.routes')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const nextApp = next({ dev })

const app = express()
const handle = nextApp.getRequestHandler()

const Store = MongoStore(session)
const store = new Store({
    collection: 'sessions',
    uri: keys.MONGODB_URL,
})

const corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: true,
    credentials: true,
}

const PORT = process.env.PORT || 80

async function start() {
    try {
        await nextApp.prepare()

        app.use(express.urlencoded({ extended: true }))
        app.use(express.json())
        app.use(
            session({
                name: 'token',
                secret: keys.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                cookie: {
                    maxAge: 1000 * 60 * 60 * 6, // 6 hours
                },
                store,
            }),
        )

        app.use(fileMiddleware.single('image'))
        app.use('/images', express.static(path.join(__dirname, '../', 'images')))
        app.use(helmet())
        app.use(compression())

        app.use(cors({ ...corsOptions, optionsSuccessStatus: 200 }))
        app.options('*', cors({ ...corsOptions, optionsSuccessStatus: 204 }))

        app.use('/api/upload', uploadRoutes)

        const server = new ApolloServer({
            typeDefs,
            resolvers,
            context: ({ req, res }) => {
                return { req, res }
            },
            debug: true,
        })
        server.applyMiddleware({ app, path: '/api/graphql' })
        console.log(server.graphqlPath)

        app.get('*', (req, res) => {
            return handle(req, res)
        })

        await mongoose.connect(keys.MONGODB_URL, {
            useNewUrlParser: true,
            useFindAndModify: false,
            useCreateIndex: true,
            useUnifiedTopology: true,
        })
        console.log('mongo connected')

        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log(e)
    }
}
start()
