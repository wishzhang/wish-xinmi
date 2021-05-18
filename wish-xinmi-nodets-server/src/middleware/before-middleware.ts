export default () => {
    return (async (ctx:any, next:any) => {

        await next();
    });
}