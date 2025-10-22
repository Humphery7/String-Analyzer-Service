import StringAnalyzerModel from '../model/model.js'
import { checkPalindrome, uniqueCharacters, wordCount, sha256Hash, charFreqCount, parseNaturalLanguageQuery } from '../utils/functions.js';

const getSpecificString = async (req,res,next)=>{
    const {string_value} = req.params
    try{
        const searchResults = await StringAnalyzerModel.findOne({value: string_value});

        
        if (!searchResults){
            return res.status(404).json({message:" String does not exist in the system"});
        }

        // const valueString = searchResults.value;
        // const hash = sha256Hash(valueString);
        // const properties = {
        //     length: valueString.length,
        //     is_palindrome : checkPalindrome(valueString),
        //     unique_characters: uniqueCharacters(valueString),
        //     word_count: wordCount(valueString),
        //     sha256_hash: hash,
        //     character_frequency_map: charFreqCount(valueString),
        // }

        res.status(200).json({
            id: searchResults.id,
            value: searchResults.value,
            properties:searchResults.properties,
            created_at: searchResults.created_at.toISOString()
        })

        }catch(error){
            next(error);
        }
}




const createString = async (req,res,next) =>{
    const {value} = req.body;

    if (!value){
        return res.status(400).json({message: `Invalid request body or missing "value" field`});
    }

    if (typeof value!=="string"){
        return res.status(422).json({message:`Invalid data type for "value" (must be string)`});
    }

    try{
        const existing = await StringAnalyzerModel.findOne({value:value});
        
        if (existing){
            return res.status(409).json({message: `String already exists in the system`});
        }
        
        const hash = sha256Hash(value);
        const properties = {
            length: value.length,
            is_palindrome: checkPalindrome(value),
            unique_characters: uniqueCharacters(value),
            word_count: wordCount(value),
            sha256_hash: hash,
            character_frequency_map: charFreqCount(value),
          };

        const newString = await StringAnalyzerModel.create({
            id: hash,
            value: value,
            properties: properties,
            created_at: new Date()
        });

        res.status(201).json({
            id: newString.id,
            value: newString.value,
            properties: properties,
            created_at : newString.created_at.toISOString()
        })
    }catch(error){
        next(error);
    }
}


const getStringsFilter = async (req, res, next) => {
    try {

        const {
            is_palindrome,
            min_length,
            max_length,
            word_count,
            contains_character
        } = req.query;

        const filtersApplied = {};

  
        const query = {};

        if (is_palindrome !== undefined) {
            if (is_palindrome !== 'true' && is_palindrome !== 'false') {
                return res.status(400).json({ message: 'Invalid value for is_palindrome (must be true/false)' });
            }
            query['properties.is_palindrome'] = is_palindrome === 'true';
            filtersApplied.is_palindrome = is_palindrome === 'true';
        }

        // if (min_length !== undefined) {
        //     const minLen = parseInt(min_length, 10);
        //     if (isNaN(minLen) || minLen < 0) {
        //         return res.status(400).json({ message: 'Invalid value for min_length (must be a positive integer)' });
        //     }
        //     query['properties.length'] = { ...query['properties.length'], $gte: minLen };
        //     filtersApplied.min_length = minLen;
        // }
        if (min_length !== undefined) {
            const minLen = Number(min_length);
            if (!Number.isInteger(minLen) || minLen < 0) {
                return res.status(400).json({ message: 'Invalid value for min_length (must be a positive integer)' });
            }
            query['properties.length'] = { ...query['properties.length'], $gte: minLen };
            filtersApplied.min_length = minLen;
        }

        // if (max_length !== undefined) {
        //     const maxLen = parseInt(max_length, 10);
        //     if (isNaN(maxLen) || maxLen < 0) {
        //         return res.status(400).json({ message: 'Invalid value for max_length (must be a positive integer)' });
        //     }
        //     query['properties.length'] = { ...query['properties.length'], $lte: maxLen };
        //     filtersApplied.max_length = maxLen;
        // }

        if (max_length !== undefined) {
            const maxLen = Number(max_length);
            if (!Number.isInteger(maxLen) || maxLen < 0) {
                return res.status(400).json({ message: 'Invalid value for max_length (must be a positive integer)' });
            }
            query['properties.length'] = { ...query['properties.length'], $lte: maxLen };
            filtersApplied.max_length = maxLen;
        }

        // if (word_count !== undefined) {
        //     const wc = parseInt(word_count, 10);
        //     if (isNaN(wc) || wc < 0) {
        //         return res.status(400).json({ message: 'Invalid value for word_count (must be a positive integer)' });
        //     }
        //     query['properties.word_count'] = wc;
        //     filtersApplied.word_count = wc;
        // }

        if (word_count !== undefined) {
            const wc = Number(word_count);
            if (!Number.isInteger(wc) || wc < 0) {
                return res.status(400).json({ message: 'Invalid value for word_count (must be a positive integer)' });
            }
            query['properties.word_count'] = wc;
            filtersApplied.word_count = wc;
        }

        if (contains_character !== undefined) {
            if (typeof contains_character !== 'string' || contains_character.length !== 1) {
                return res.status(400).json({ message: 'Invalid value for contains_character (must be a single character)' });
            }
            query['value'] = { $regex: contains_character }; 
            filtersApplied.contains_character = contains_character;
        }


        const data = await StringAnalyzerModel.find(query);

        res.status(200).json({
            data: data.map(doc => ({
                id: doc.id,
                value: doc.value,
                properties: doc.properties,
                created_at: doc.created_at.toISOString()
            })),
            count: data.length,
            filters_applied: filtersApplied
        });
    } catch (error) {
        next(error);
    }
};



const deleteString = async (req,res,next)=>{
    const {string_value} = req.params;

    try{
        const deleteResults = await StringAnalyzerModel.findOneAndDelete({value:string_value});

        if (!deleteResults){
            return res.status(404).json({message:"String does not exist in the system"});
        }

        res.status(204).send();
    }catch(error){
        next(error);
    }

}


const getNaturalLanguage = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                error: 'Query parameter is required'
            });
        }
        
        // Parse the natural language query
        const interpretedQuery = parseNaturalLanguageQuery(query);
        const filters = interpretedQuery.parsed_filters;
        
        // Check if query was parsed successfully
        if (Object.keys(filters).length === 0) {
            return res.status(400).json({
                error: 'Unable to parse natural language query'
            });
        }
        
        // Check for conflicting filters
        if (filters.min_length && filters.max_length && filters.min_length > filters.max_length) {
            return res.status(422).json({
                error: 'Query parsed but resulted in conflicting filters: min_length cannot be greater than max_length'
            });
        }
        
        // Build MongoDB query based on parsed filters
        const mongoQuery = {};
        
        // Apply word count filter
        if (filters.word_count !== undefined) {
            mongoQuery['properties.word_count'] = filters.word_count;
        }
        
        // Apply palindrome filter
        if (filters.is_palindrome !== undefined) {
            mongoQuery['properties.is_palindrome'] = filters.is_palindrome;
        }
        
        // Apply length filters
        if (filters.min_length !== undefined) {
            mongoQuery['properties.length'] = { $gte: filters.min_length };
        }
        
        if (filters.max_length !== undefined) {
            if (mongoQuery['properties.length']) {
                mongoQuery['properties.length'].$lte = filters.max_length;
            } else {
                mongoQuery['properties.length'] = { $lte: filters.max_length };
            }
        }
        
        if (filters.exact_length !== undefined) {
            mongoQuery['properties.length'] = filters.exact_length;
        }
        
        // Apply unique characters filter
        if (filters.unique_characters !== undefined) {
            mongoQuery['properties.unique_characters'] = filters.unique_characters;
        }
        
        // Apply character containment filter
        if (filters.contains_character !== undefined) {
            mongoQuery.value = { $regex: filters.contains_character, $options: 'i' };
        }
        
        // Execute the query
        const matchingStrings = await StringAnalyzerModel.find(mongoQuery);
        
        // Format response
        const response = {
            data: matchingStrings.map(doc => ({
                id: doc.id,
                value: doc.value,
                properties: doc.properties,
                created_at: doc.created_at.toISOString()
            })),
            count: matchingStrings.length,
            interpreted_query: interpretedQuery
        };
        
        res.status(200).json(response);
        
    } catch (error) {
        console.error('Error in natural language filtering:', error);
        
        // Handle specific parsing errors
        if (error.message && error.message.includes('parse')) {
            return res.status(400).json({
                error: 'Unable to parse natural language query'
            });
        }
        
        res.status(500).json({
            error: 'Internal server error'
        });
    }
}

export { getSpecificString, createString, getStringsFilter, getNaturalLanguage, deleteString }