const axios = require('axios');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config()

async function fetchData() {
    try {
        const response = await axios.get(process.env.GET_CHARACTERS_API);
        const jsonData = response.data;
        const dataArray = jsonData.fetalCharacters;
        dataArray.slice(0, 20).forEach(async (data, index) => {
            const filename = `${index}`;
            await writeDataToFile(data, filename);
            const imagename = `${index}`;
            await downloadImage(data.upscaledImageUrls[0], imagename);
        });
    } catch (error) {
        console.error('Error fetching data:', error.message);
    }
}

// fetchData();

async function writeDataToFile(data, filename) {
    const filePath = `metadata/${filename}.json`;

    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log(`Data written to file: ${filePath}`);
}

async function downloadImage(url, filename) {
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const imageData = response.data;
        const imagePath = `images/${filename}.png`;
        fs.writeFileSync(imagePath, Buffer.from(imageData, 'binary'));
        console.log(`Image downloaded: ${filename}`);
    } catch (error) {
        console.error('Error downloading image:', error.message);
    }
}

function combineMetadata() {
    const files = fs.readdirSync('metadata')
    function concatenateJSONFiles(files, outputFilePath) {
        const concatenatedData = [];

        files.forEach((file) => {
            const jsonData = JSON.parse(fs.readFileSync(`metadata/${file}`));
            concatenatedData.push(jsonData);
        });

        const concatenatedJSON = JSON.stringify(concatenatedData, null, 2);
        fs.writeFileSync(outputFilePath, concatenatedJSON);

        console.log(`JSON files concatenated to: ${outputFilePath}`);
    }

    // Specify the output file path
    const outputFilePath = '_metadata.json';

    concatenateJSONFiles(files, outputFilePath);
}

combineMetadata();