import express from "express";
import { getSpecificString, createString, getStringsFilter, getNaturalLanguage, deleteString } from '../controller/controller.js';

const router = express.Router()

router.get('/', getStringsFilter);
router.post('/', createString);
router.get('/filter-by-natural-language', getNaturalLanguage);
router.get('/:string_value', getSpecificString);
router.delete('/:string_value', deleteString);


export default router;