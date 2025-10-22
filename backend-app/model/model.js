import mongoose from "mongoose";

const {Schema, model} = mongoose;

const stringAnalyzerModel = new Schema({
    id: {type:String, required:true},
    value: {type:String, required:true},
    properties: {
      length: {type:Number, validate:Number.isInteger},
      is_palindrome: Boolean,
      unique_characters: {type:Number},
      word_count: {type:Number},
      sha256_hash: String,
      character_frequency_map: {type:Object}
    },
    created_at: {type:Date, default: Date.now}
  })

export default model('StringAnalyzerModel',stringAnalyzerModel);