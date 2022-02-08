const expresss = require('express');

const userRouter = require('./api/user/user.router');
const invRouter = require('./api/inv/inv.router');

const app = expresss();
const port = process.env.PORT || 5000;

app.use(expresss.json());

app.use('/api/user', userRouter);
app.use('/api/inv', invRouter);

if (process.env.NODE_ENV === 'production') {    
    //set static folder    
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));    
    })
}

app.listen(port, () => {
    console.log(`Server Port: ${port}`);
});