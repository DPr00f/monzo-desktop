import passport from 'passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import config from '../../../config';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.JWT_SECRET
};

const jwtLogin = new Strategy(jwtOptions, (payload, done) => {
  if (payload.accessToken && payload.refreshToken) {
    const { accessToken, refreshToken } = payload;
    done(null, { accessToken, refreshToken });
  } else {
    done(null, false);
  }
});

passport.use(jwtLogin);
