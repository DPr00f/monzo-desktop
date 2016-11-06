export default {
  MONZO: {
    CLIENT_ID: process.env.MONZO_DESKTOP_CLIENT_ID || 'Your monzo client id here',
    CLIENT_SECRET: process.env.MONZO_DESKTOP_CLIENT_SECRET || 'Your monzo client secret here',
    REDIRECT_URL: process.env.MONZO_DESKTOP_REDIRECT_URL || 'http://127.0.0.1:8080/monzoReturn'
  },
  JWT_SECRET: process.env.MONZO_DESKTOP_JWT_SECRET || 'N3DoQVGuIPpRAzthDtypFeaAfPUqiRPfmMbpt8tLwENMJPYZmU',
  SESSION_SECRET: process.env.MONZO_DESKTOP_SESSION_SECRET || 'N3DoQVGuIPpRAzthDtypFeaAfPUqiRPfmMbpt8tLwENMJPYZmU',
  API_URL: process.env.MONZO_DESKTOP_API_URL || 'http://127.0.0.1:8080'
};
