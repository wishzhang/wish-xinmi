module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      ctx.status = 500;
      ctx.body = e;
      console.log(e);
    }
  }
}