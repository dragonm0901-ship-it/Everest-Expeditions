import { listDestinationRecords, saveDestinationRecord } from '../_lib/database.js';
import { requireAdmin, setJsonHeaders } from '../_lib/adminAuth.js';
import { applyCors, handleCorsPreflight } from '../_lib/cors.js';

export default async function handler(req, res) {
  setJsonHeaders(res);

  if (!applyCors(req, res)) {
    res.status(403).end(JSON.stringify({ message: 'Origin not allowed.' }));
    return;
  }

  if (handleCorsPreflight(req, res, 'GET, POST, OPTIONS')) {
    return;
  }

  if (!requireAdmin(req, res)) return;

  if (req.method === 'GET') {
    try {
      const records = listDestinationRecords();
      res.status(200).end(JSON.stringify({ destinations: records }));
    } catch (err) {
      res.status(500).end(JSON.stringify({ message: err.message }));
    }
    return;
  }

  if (req.method === 'POST') {
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const record = saveDestinationRecord(body);
      res.status(200).end(JSON.stringify({ destination: record }));
    } catch (err) {
      res.status(500).end(JSON.stringify({ message: err.message }));
    }
    return;
  }

  res.status(405).end(JSON.stringify({ message: 'Method not allowed.' }));
}
