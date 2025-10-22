import crypto from "crypto";

const checkPalindrome = (input_string)=>{
   const cleaned = input_string.toLowerCase().replace(/[^a-z0-9]/g, '');
   return cleaned === cleaned.split("").reverse().join("")
};



const uniqueCharacters = (input_string)=>{
   const str_set = new Set(input_string);
   return str_set.size;
};


const wordCount = (input_string)=>{
   const trimmed = input_string.trim();
   if (trimmed === '') return 0;
   const word_list = trimmed.split(/\s+/);
   return word_list.length;
};


const sha256Hash = (input_string)=>{
   return crypto.createHash("sha256").update(input_string).digest("hex");
};


const charFreqCount = (input_string)=>{
   const frequencyMap = {};
   for (let char of input_string){
      frequencyMap[char] = frequencyMap[char]? frequencyMap[char]+1: 1
   };
   return frequencyMap;
};


const parseNaturalLanguageQuery = (query) => {
   const lowerQuery = query.toLowerCase();
   const parsedFilters = {};
   
   // Parse word count filters (using if statements to allow multiple word count patterns)
   if (lowerQuery.includes('single word') || lowerQuery.includes('one word')) {
      parsedFilters.word_count = 1;
   }
   if (lowerQuery.includes('two word') || lowerQuery.includes('2 word')) {
      parsedFilters.word_count = 2;
   }
   if (lowerQuery.includes('three word') || lowerQuery.includes('3 word')) {
      parsedFilters.word_count = 3;
   }
   
   // Parse palindrome filters
   if (lowerQuery.includes('palindromic') || lowerQuery.includes('palindrome')) {
      parsedFilters.is_palindrome = true;
   }
   
   // Parse length filters
   const lengthMatch = lowerQuery.match(/(?:longer than|more than|greater than)\s+(\d+)\s+characters?/);
   if (lengthMatch) {
      parsedFilters.min_length = parseInt(lengthMatch[1]) + 1;
   }
   
   const shorterMatch = lowerQuery.match(/(?:shorter than|less than|fewer than)\s+(\d+)\s+characters?/);
   if (shorterMatch) {
      parsedFilters.max_length = parseInt(shorterMatch[1]) - 1;
   }
   
   const exactLengthMatch = lowerQuery.match(/(?:exactly|precisely)\s+(\d+)\s+characters?/);
   if (exactLengthMatch) {
      parsedFilters.exact_length = parseInt(exactLengthMatch[1]);
   }
   
   // Parse character containment filters - improved regex
   const containsMatch = lowerQuery.match(/contains?\s+(?:the\s+)?letter\s+([a-z])/);
   if (containsMatch) {
      parsedFilters.contains_character = containsMatch[1];
   }
   
   // Parse vowel filters
   if (lowerQuery.includes('first vowel') || lowerQuery.includes('contains the first vowel')) {
      parsedFilters.contains_character = 'a'; // Assuming 'a' as first vowel
   }
   
   // Parse unique character filters
   const uniqueMatch = lowerQuery.match(/(\d+)\s+unique\s+characters?/);
   if (uniqueMatch) {
      parsedFilters.unique_characters = parseInt(uniqueMatch[1]);
   }
   
   // Handle specific character mentions (like "letter z")
   const letterMatch = lowerQuery.match(/letter\s+([a-z])/);
   if (letterMatch) {
      parsedFilters.contains_character = letterMatch[1];
   }
   
   // Handle "strings containing" patterns
   const containingMatch = lowerQuery.match(/containing\s+(?:the\s+)?letter\s+([a-z])/);
   if (containingMatch) {
      parsedFilters.contains_character = containingMatch[1];
   }
   
   return {
      original: query,
      parsed_filters: parsedFilters
   };
};

export { checkPalindrome, uniqueCharacters, wordCount, sha256Hash, charFreqCount, parseNaturalLanguageQuery };
