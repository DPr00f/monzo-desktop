import passport from 'passport';
import '../services/passport';

export default passport.authenticate('jwt', { session: false });
