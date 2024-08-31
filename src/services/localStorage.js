export function getAllTransactions(){
    let data = localStorage.getItem("content");
    return JSON.parse(data);
}

export function clear(){
    localStorage.clear();
}