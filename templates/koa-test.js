const koa = require('koa')
const router = require('koa-router')

const app = new koa()

const route = new router()

route.post('/test', async (ctx, next) => {
    console.log(ctx.req.rawHeaders)
    ctx.status = 200;
    ctx.body = ctx.req.rawHeaders
})

app.use(route.routes()).use(route.allowedMethods())

app.listen(8000, '127.0.0.1', () => console.log(' listening in port 8000 '))