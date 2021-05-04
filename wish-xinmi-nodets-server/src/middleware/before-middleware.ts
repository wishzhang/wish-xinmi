export = () => {
    return (async (ctx:any, next:any) => {

        await next();
    });
}