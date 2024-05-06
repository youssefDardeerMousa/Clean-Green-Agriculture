import express from 'express'
import { appRouter } from './app.router.js'
import { connectDB } from './DB/connection.js'
const app= express()
appRouter(app,express)
//DB
connectDB()