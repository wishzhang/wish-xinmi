module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      ctx.status = 500;
      ctx.body = '服务器出错了';
    }
  }
}