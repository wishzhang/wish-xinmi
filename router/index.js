const userRouter = require('./user-router');
const loginRouter = require('./login-router');
const contactRouter = require('./contact-router');
const messageRouter = require('./message-router');
const circleRouter = require('./circle-router');
const fileRouter = require('./file-router');
const commonRouter = require('./common-router');

const router = require('./router-factory')('/');
router.all('/', async (ctx) => {

})

module.exports = (app) => {
  app.use(userRouter.routes());
  app.use(loginRouter.routes());
  app.use(circleRouter.routes());
  app.use(contactRouter.routes());
  app.use(messageRouter.routes());
  app.use(fileRouter.routes());
  app.use(commonRouter.routes());
}