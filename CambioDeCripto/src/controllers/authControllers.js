const userServices = require('../services/userServices');

class AuthControllers {
  async register(req, res) {
    try {
      const user = await userServices.register(req.body);
      return res.status(200).json({ message: 'User registered', user });
    } catch (error) {
      return res.status(500).json({ error: 'Error registering user' });
    }
  }
}

module.exports = new AuthControllers();
