import HttpError from 'http-errors';
import JWT from 'jsonwebtoken';
import { Op } from 'sequelize';
import moment from 'moment';
import { Users } from '../models';

const { JWT_SECRET } = process.env;

class UsersController {
  static async login(req, res, next) {
    try {
      const {
        email,
        password,
      } = req.body;
      const user = await Users.findOne({
        where: {
          email,
          password: Users.passwordHas(password),
        },
      });
      if (!user) {
        throw HttpError(404, 'Invalid email or password');
      }
      const token = JWT.sign({ userId: user.id }, JWT_SECRET);
      const refreshToken = JWT.sign({ refreshUserId: user.id }, JWT_SECRET);
      res.json({
        status: 'ok',
        expireDate: moment()
          .add(15, 'm')
          .toDate(),
        user,
        token,
        refreshToken,
      });
    } catch (e) {
      next(e);
    }
  }

  static async register(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;

      const exists = await Users.findOne({
        where: { email },
      });
      if (exists) {
        throw HttpError(422, {
          errors: {
            email: 'Already registered',
          },
        });
      }

      const user = await Users.create({
        firstName,
        lastName,
        email,
        password,
      });

      res.json({
        status: 'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  }

  static async list(req, res, next) {
    try {
      const {
        s,
        limit = 20,
        page = 1,
      } = req.query;
      const where = {};
      if (s) {
        where[Op.or] = [
          { firstName: { [Op.substring]: s } },
          { lastName: { [Op.substring]: s } },
          { email: { [Op.substring]: s } },
        ];
      }
      const users = await Users.findAll({
        where,
        limit,
        offset: (page - 1) * limit,
      });

      const total = await Users.count({
        where,
      });

      res.json({
        status: 'ok',
        users,
        total,
        totalPages: Math.ceil(total / limit),
      });
    } catch (e) {
      next(e);
    }
  }

  static async profile(req, res, next) {
    try {
      const userId = req.params.userId || req.userId;

      const user = await Users.findOne({
        where: {
          id: userId,
        },
      });

      res.json({
        status: 'ok',
        user,
      });
    } catch (e) {
      next(e);
    }
  }
}

export default UsersController;
