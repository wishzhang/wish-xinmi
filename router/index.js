const userRouter = require('./user-router');
const loginRouter = require('./login-router');
const contactRouter = require('./contact-router');
const messageRouter = require('./message-router');
const circleRouter = require('./circle-router');

const router = {
  ...userRouter,
  ...loginRouter,
  ...contactRouter,
  ...messageRouter,
  ...circleRouter,
}

module.exports = () => {
  return (async (ctx, next) => {
    if (router.hasOwnProperty(ctx.path)) {
      await router[ctx.path](ctx);
    } else {
      await next();
    }
  });
}