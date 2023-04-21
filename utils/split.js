exports.splitCookiesarray = (array)=>{

    let splitedArray = [];
    array.map((m)=>{
        const temp = m.split("=");
        splitedArray[temp[0]] = temp[1];
    })
    return splitedArray;
}