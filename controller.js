const { v4: uuidv4 } = require('uuid');
const { readDb, writeDb } = require('./dbOperations');
const { generateToken } = require('./jwt.service');

const createUser = (req, res) => {
    try {
        let uuid = uuidv4()
        req.body.id = uuid;
        req.body.createdAt = new Date();
        const { id, name, password, createdAt } = req.body
        const database = readDb()
        database.users.push({ id, name, password, createdAt })
        writeDb(database)
        return res.status(201).json({ message: "User added", data: null })
    } catch (error) {
        console.error("error:-", error)
        return res.status(500).json({ error: "internal server error" })
    }
}

const loginUser = async (req, res) => {
    try {
        const { password } = req.body
        const database = readDb()
        const data = database.users.filter(value => value.password === password)
        if (data.length !== 0) {
            // console.log(data[0].id)
            const id = data[0].id
            const name = data[0].name
            const token = await generateToken(data[0])
            return res.status(200).json({ message: "Login successfully", data: { id }, token: token })
        }
        return res.status(500).json({ message: "Invalid name or password" })
    } catch (error) {
        console.error("error:-", error)
        return res.status(500).json({ error: "internal server error" })
    }
}

const createTask = (req, res) => {
    try {
        let taskId = uuidv4()
        const uuid = req.headers.id
        console.log(uuid)
        req.body.userId = uuid;
        req.body.id = taskId;
        req.body.createdAt = new Date();
        const { id, userId, title, description, createdAt } = req.body;
        const database = readDb()
        database.task.push({ id, userId, title, description, createdAt })
        writeDb(database)
        return res.status(201).json({ message: "Task Created", data: { title, description } })
    } catch (error) {
        console.error("error:-", error)
        return res.status(500).json({ error: "internal server error" })
    }
}

const findUser = (req, res) => {
    try {
        const { skip = 0, limit = 150, search } = req.query
        const uuid = req.headers.id
        const skipInt = parseInt(skip)
        const limitInt = parseInt(limit)
        let result = readDb().users
        // console.log(result, "data")
        result = result.slice(skipInt, skipInt + limitInt)
        // result = result.map(obj => {
        //     const userData = readDb().task.find(value => value.id === obj.id)
        //     return { ...obj, notes: userData }
        // })
        if (search) {
            result = result.filter(item =>
                Object.values(item)
                    .filter(value => typeof value === "string")
                    .some(value => value.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (uuid) {
            result = result.filter(item => item.id == uuid)
        }
        result = result.map(({ id, password, ...data }) => {
            // console.log(data)
            return data
        })
        return res.status(200).json({ data: result, count: result.length })
    } catch (error) {
        console.error("error:-", error)
        return res.status(500).json({ error: "internal server error" })
    }
}
const findNotes = (req, res) => {
    try {
        const { skip = 0, limit = 150, search } = req.query
        const uuid = req.headers.id
        const skipInt = parseInt(skip)
        const limitInt = parseInt(limit)
        let result = readDb().task
        result = result.slice(skipInt, skipInt + limitInt)

        if (search) {
            result = result.filter(item =>
                Object.values(item)
                    .filter(value => typeof value === "string")
                    .some(value => value.toLowerCase().includes(search.toLowerCase()))
            );
        }

        if (uuid) {
            result = result.filter(item => item.userId == uuid)
        }
        result = result.map(({ userId, ...data }) => {
            // console.log(data)
            return data
        })
        if (result.length === 0) {
            return res.status(404).json({ message: "data not found" })
        }
        return res.status(200).json({ data: result, count: result.length })
    } catch (error) {
        console.error("error:-", error)
        return res.status(500).json({ error: "internal server error" })
    }
}
const updatesNotesController = (req, res) => {
    try {
        const id = req.headers.id
        const { title, description } = req.body
        const db = readDb()
        const noteIndex = db.task.findIndex((n) => n.id === id)
        console.log(noteIndex, "noteIndex")

        if (noteIndex === -1) {
            return res.status(404).json({ msg: "Note not found" });
        }

        db.task[noteIndex] = { ...db.task[noteIndex], title, description };
        writeDb(db);
        return res
            .status(200)
            .json({ msg: "Note updated successfully", note: db.task[noteIndex] });
    } catch (error) {
        console.log("error: ", error)
        return res.status(500).json({ error: "Internal server error" });
    }
}
const deleteNotesController = (req, res) => {
    try {
        const id = req.headers.id
        const db = readDb()
        const noteIndex = db.task.findIndex((n) => n.id === id)

        if (noteIndex === -1) {
            return res.status(404).json({ msg: "Note not found" });
        }

        db.task.splice(noteIndex, 1)
        writeDb(db);  
        return res.status(200).json({ msg: "Note deleted successfully" });
    } catch (error) {
        console.log("error: ", error)
        return res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    createUser,
    createTask,
    findUser, loginUser, findNotes,
    updatesNotesController,
    deleteNotesController
}