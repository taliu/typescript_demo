import * as  Koa from 'koa';
const app = new Koa();

app.use(ctx => {
  ctx.body = 'Hello World';
});

app.listen(3001,()=>{
    console.log('website listen at port 3001');
});