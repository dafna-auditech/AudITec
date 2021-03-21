const express = require('express')
const fileUpload = require('express-fileupload');
const cors = require('cors')
const app = express()
const fs = require('fs');
const AWS = require('aws-sdk');

// Enter copied or downloaded access ID and secret key here
const ID = 'AKIAWYFMJ327SD64AHT4';
const SECRET = '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';
// The name of the bucket that you have created
const BUCKET_NAME = 'demo-auditech';

const s3 = new AWS.S3({
    accessKeyId: ID,
    secretAccessKey: SECRET
});

const uploadFile = (fileLocation, fileName) => {
    console.log(fileName)

    // Read content from the file
    const fileContent = fs.readFileSync(fileLocation, "utf8");

    // Setting up S3 upload parameters
    const params = {
        Bucket: BUCKET_NAME,
        Key: fileName, // File name you want to save as in S3
        Body: fileContent
    };

    // Uploading files to the bucket
    s3.upload(params, function (err, data) {
        if (err) {
            throw err;
        }
        console.log(`File uploaded successfully. ${data.Location}`);
    });
};



// middle ware
app.use(express.static('public')); //to access the files in public folder
app.use(cors()); // it enables all cors requests
app.use(fileUpload());
// file upload api
app.post('/upload', (req, res) => {
    if (!req.files) {
        return res.status(500).send({ msg: "file is not found" })
    }
    // accessing the file
    const myFile = req.files.file;
    console.log(myFile.name)


    //  mv() method places the file inside public directory
    myFile.mv(`${__dirname}/public/${myFile.name}`, function (err) {
        if (err) {
            console.log(err)
            return res.status(500).send({ msg: "Error occured" });
        }
        // returing the response with file path and name
        return res.send({ name: myFile.name, path: `/${myFile.name}` });
    });

    uploadFile(`./public/${myFile.name}`, `${myFile.name}`)
})

app.get('/', function (req, res) {
    res.send("hello world")
})

const PORT = 4000;
app.listen(process.env.PORT || PORT, function () {
    console.log(`Running server on port ${PORT}`);
});
