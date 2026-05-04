import { searchInquiries } from '../_lib/database.js';
import { requireAdmin, setJsonHeaders } from '../_lib/adminAuth.js';
import { applyCors, handleCorsPreflight } from '../_lib/cors.js';

export default function handler(req, res) {
  setJsonHeaders(res);

  if (!applyCors(req, res, { allowCredentials: true })) {
    res.status(403).end(JSON.stringify({ message: 'Origin not allowed.' }));
    return;
  }

  if (handleCorsPreflight(req, res, 'GET, OPTIONS', { allowCredentials: true })) {
    return;
  }

  if (!requireAdmin(req, res)) {
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).end(JSON.stringify({ message: 'Method not allowed.' }));
    return;
  }

  const query = String(req.query?.q ?? '').trim();

  if (!query) {
    res.status(200).end(JSON.stringify({ results: [] }));
    return;
  }

  try {
    const results = searchInquiries(query);
    res.status(200).end(JSON.stringify({ results }));
  } catch (error) {
    console.error('[API Search Error]', error);
    res.status(500).end(JSON.stringify({ message: 'Internal server error.' }));
  }
}
