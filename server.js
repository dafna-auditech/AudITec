const express = require('express')
const app = express()

app.get('/', function (req, res) {
    res.send("hello world")
})

const PORT = 4000;
app.listen(process.env.PORT || PORT, function () {
    console.log(`Running server on port ${PORT}`);
});
