import { getOrderStatus } from '../lib/api';
import groundTruth from './ground-truth.json';

interface GroundTruthItem {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

interface ProcessedResponse {
  answer: string;
  citation?: string;
  confidence: number;
}


export function extractOrderId(text: string): string | null {
  const match = text.match(/[A-Z0-9]{10,}/);
  return match ? match[0] : null;
}


function calculateSimilarity(query: string, keywords: string[]): number {
  
 const normalize = (word: string) => word.toLowerCase().replace(/s$/, '');

const queryWords = query
  .toLowerCase()
  .replace(/[^\w\s]/g, '')
  .split(/\s+/)
  .map(normalize);

const keywordSet = new Set(keywords.map(normalize));

  let matches = 0;
  queryWords.forEach(word => {
    if (keywordSet.has(word)) matches++;
  });

  return matches / keywords.length; 
}


function findBestMatch(query: string): { item: GroundTruthItem; score: number } | null {
  let best: { item: GroundTruthItem; score: number } | null = null;

  groundTruth.forEach(item => {
    const score = calculateSimilarity(query, item.keywords);
    if (score > 0.15 && (!best || score > best.score)) {
      best = { item, score };
    }
  });

  return best;
}


function formatOrderStatus(orderId: string, status: any): string {
  const shortId = `...${orderId.slice(-4)}`;
  if (status.status === 'NotFound') return `No order found with ID ${shortId}.`;
  
  let msg = `Order ${shortId} is "${status.status}".`;
  if (status.carrier) msg += ` Shipped via ${status.carrier}.`;
  if (status.eta) msg += ` Estimated delivery: ${status.eta}.`;

  return msg;
}


export async function processUserQuery(query: string): Promise<ProcessedResponse> {
 
  const orderId = extractOrderId(query);
  if (orderId) {
    try {
      const status = await getOrderStatus(orderId);
      return { answer: formatOrderStatus(orderId, status), confidence: 0.9 };
    } catch {
      return { answer: "Couldn't access order info. Try later.", confidence: 0.1 };
    }
  }
 
  const best = findBestMatch(query);
  if (best && best.score > 0.2) {
    return { answer: best.item.answer, citation: `[${best.item.id}]`, confidence: best.score };
  }

  return { answer: "I can't answer that. Contact support.", confidence: best?.score || 0 };
}
