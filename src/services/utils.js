export function convertStringToDate(dateStr){
    let splitDate = dateStr.split("/");
    // mouth -1 because mouth are 0 based (december) = 11)
    return new Date(splitDate[2], splitDate[1] - 1, splitDate[0]);
}

export function replaceCommaByDot(text){
    return text.replace(",",'.');
}