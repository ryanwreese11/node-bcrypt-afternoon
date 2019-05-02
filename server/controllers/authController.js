
const bcrypt = require('bcryptjs')

module.exports = {
  register: async (req, res) => {
    const { username, password, isAdmin } = req.body
    const db = req.app.get('db')
    let result = await db.get_user(username)
    let existingUser = result[0]

    if (existingUser) {
      res.status(409).send('Username taken')
    }

    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(password, salt)

    let registeredUser = await db.register_user([isAdmin, username, hash])
    let user = registeredUser[0]

    req.session.user = {
      isAdmin: user.is_admin,
      username: user.username,
      id: user.id
    }

    return res.status(201).send(req.session.user)

  },

  login: async (req, res) => {
    const { username, password } = req.body
    
    let foundUser = await req.app.get('db').get_user(username)
    let user = foundUser[0]

    if (!user) {
      return res.status(409).send('Username not found, please register as a new user')
    }

    const isAuthenticated = bcrypt.compareSync(password, user.hash)
    if (!isAuthenticated) {
      return res.status(403).send('incorrect password')
    }

    req.session.user = {
      isAdmin: user.is_admin,
      username: user.username,
      id: user.id
    }
    return res.status(200).send(req.session.user)

  },

  logout: async (req, res) => {
    req.session.destroy()
    return res.sendStatus(200)
  }

}
