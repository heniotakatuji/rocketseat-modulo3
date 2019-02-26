const User = require('../models/User')

class SessionController {
  async store (req, res) {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(400).json({ erro: 'User not found' })
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ erro: 'Passoword Incorret' })
    }

    return res.json({ user, token: User.generateToken(user) })
  }
}

module.exports = new SessionController()
