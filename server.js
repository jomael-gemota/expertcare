const express = require('express');
const path = require('path');

const userRouter = require('./api/user/user.router');
const invRouter = require('./api/inv/inv.router');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/inv', invRouter);

app.use(express.static('client/build'));
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));    
})

app.listen(port, () => {
    console.log(`Server Port: ${port}`);
});