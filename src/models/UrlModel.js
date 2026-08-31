const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
    {
        originalUrl: {
            type: String,
            required: true
        },

        shortCode: {
            type: String,
            required: true,
            unique: true,
        },

        expiresAt: {
            type: Date,
            default: null ,
            expires: 0
        },
        clickCount: {
            type: Number,
            default: 0
        }
        
    },
    {
        timestamps: true
    }
); 
urlSchema.index({ createdAt: -1 });

const Url = mongoose.model("Url", urlSchema);

module.exports = Url;