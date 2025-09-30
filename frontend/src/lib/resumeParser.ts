    import * as pdfjsLib from 'pdfjs-dist';
    import mammoth from 'mammoth';
    import type { CandidateInfo } from '../types';

    pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/5.4.149/pdf.worker.min.mjs";

    // Extracts raw text from a File object
    const extractTextFromFile = async (file: File): Promise<string> => {
    if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        // Ensure item.str is a string before joining
        text += content.items.map((item: any) => item.str || '').join(' ');
        }
        return text;
    } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    }
    throw new Error('Unsupported file type. Please upload a PDF or DOCX.');
    };

    export const parseResume = async (file: File): Promise<Partial<CandidateInfo>> => {
    const text = await extractTextFromFile(file);

    // Use regular expressions to find details
    const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
    const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/;

    const email = text.match(emailRegex)?.[0] || null;
    const phone = text.match(phoneRegex)?.[0] || null;

    return { email, phone, name: null };
    };