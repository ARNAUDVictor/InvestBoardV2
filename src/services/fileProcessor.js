/**
 * @param {File} file
 */
export async function processCSVFile(file){
    let fileContent = await extractData(file);

    let formattedData = formattingData(fileContent);
    console.log(formattedData);
}

/**
 * @param {File} file
 */
function extractData(file){
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = function(event){
            const csvContent = event.target.result

            resolve(csvContent);
        };

        reader.onerror = function(){
            reject(new Error("Failed to read the file"));
        }
        
        reader.readAsText(file);
    });
}

/**
 * @param {string} data extracted from csv file
 */
function formattingData(data){
    let csvParsed = [];

    let tempData = data.split("\r");
    for(let row of tempData){
        csvParsed.push(row.split(";"));
    }
    return csvParsed;
}