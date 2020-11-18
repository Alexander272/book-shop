const fs = require('fs')
const path = require('path')
const { Router } = require('express')
const { isAuth } = require('../middleware/auth.middleware')
const Book = require('../models/Book')

const router = Router()

router.post('/add', async (req, res) => {
    try {
        isAuth(req)

        await Book.updateOne(
            { name: req.body.bookName },
            { $set: { previewUrl: `/images/${req.file.filename}`, previewName: req.file.originalname } },
        )

        res.json('success')
    } catch (e) {
        console.log(e)
        res.status(500).json(e.message)
    }
})

router.post('/update', async (req, res) => {
    try {
        isAuth(req)

        const path = findFiles(req.file.originalname)
        deleteFiles(path)

        await Book.updateOne(
            { name: req.body.bookName },
            { $set: { previewUrl: `/images/${req.file.filename}`, previewName: req.file.originalname } },
        )

        res.json('success')
    } catch (e) {
        console.log(e)
        res.status(500).json(e.message)
    }
})

function findFiles(fileName) {
    const ls = fs.readdirSync(path.resolve('./images'))
    const index = ls.findIndex(name => name.includes(fileName))

    let result = null
    if (index !== -1) result = ls[index]

    return result
}

function deleteFiles(pathImg) {
    if (pathImg)
        fs.unlink('images/' + pathImg, err => {
            if (err) console.log(err)
        })
}

module.exports = router
