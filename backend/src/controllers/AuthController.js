const AuthService = require('../services/AuthService');

class AuthController {
  static async register(req, res, next) {
    try {
      const user = await AuthService.register(req.body);
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async login(req, res, next) {
    try {
      const { user, token } = await AuthService.authenticate(req.body);
      res.json({ user, token });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AuthController;
