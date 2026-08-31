const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'; 
const encode = (num) => {
    if (num === 0) return BASE62[0];
    let result = '';
    while ( num > 0) { 
        let rem  = num % 62;
        result = BASE62[rem] + result;
        num = Math.floor(num / 62);
    }
    return result;
}  
module.exports = { encode } ;  
