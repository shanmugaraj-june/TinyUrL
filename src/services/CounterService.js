const Counter = require('../models/CounterModel'); 

const getNextSequenceValue = async() => {
     const counter = await Counter.findOneAndUpdate(
        {name : "url"},
        {$inc : {sequenceValue:1}}, 
        {new:true , upsert:true}  
     ) 
    return counter.sequenceValue;
} 

module.exports = { getNextSequenceValue } ; 