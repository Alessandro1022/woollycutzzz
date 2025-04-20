import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    if (process.env.NODE_ENV === 'development') {
      // Mock authentication for development
      req.user = { _id: '1', name: 'Test User', email: 'test@example.com' };
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // const user = await User.findOne({ _id: decoded.id, 'tokens.token': token });
    const user = await User.findById({ _id: decoded.id });

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ message: 'Please authenticate' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'error',
        message: 'Access denied'
      });
    }
    next();
  };
};

export { authorize }; 