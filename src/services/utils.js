export function convertStringToDate(dateStr){
    if(typeof(dateStr) == "string"){
        let splitDate = dateStr.split("/");
        
        // mouth -1 because mouth are 0 based (december) = 11)
        return new Date(Number(splitDate[2]), Number(splitDate[1]) - 1, Number(splitDate[0]));
    }
    return dateStr;
}

export function replaceCommaByDot(text){
    if(typeof(text) == "string"){
        return text.replace(",",'.');
    }
    return text;    
}