import type { ExcelData } from '../types';

export function calculateMessageStats(message: string, characterLimit: number) {
  const characterCount = message.length;
  const messageCount = Math.ceil(characterCount / characterLimit);
  const remainingCharacters = characterLimit - (characterCount % characterLimit);
  
  return {
    characterCount,
    messageCount,
    remainingCharacters
  };
}

export function splitMessageIntoChunks(message: string, characterLimit: number) {
  const chunks: string[] = [];
  for (let i = 0; i < message.length; i += characterLimit) {
    chunks.push(message.slice(i, i + characterLimit));
  }
  return chunks;
}

export function replaceNamePlaceholder(message: string, name: string) {
  return message.replace(/{{name}}/g, name || 'valued customer');
}

export function previewPersonalizedMessage(message: string, excelData: ExcelData | null) {
  if (!excelData || !excelData.nameColumn || !excelData.data.length) {
    return replaceNamePlaceholder(message, '');
  }

  const firstRow = excelData.data[0];
  const name = firstRow[excelData.nameColumn];
  return replaceNamePlaceholder(message, name);
}