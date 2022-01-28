const expresss = require('express');
const key = require('ckey');

const userRouter = require('./api/user/user.router');
const invRouter = require('./api/inv/inv.router');

const app = expresss();
const port = key.SERVER_PORT;

app.use(expresss.json());

app.use('/api/user', userRouter);
app.use('/api/inv', invRouter);

app.listen(port, () => {
    console.log(`Server Port: ${port}`);
});