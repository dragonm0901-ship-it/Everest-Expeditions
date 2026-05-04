import { requireAdmin, setJsonHeaders } from '../_lib/adminAuth.js';
import { applyCors, handleCorsPreflight } from '../_lib/cors.js';

export default async function handler(req, res) {
  setJsonHeaders(res);

  if (!applyCors(req, res)) {
    res.status(403).end(JSON.stringify({ message: 'Origin not allowed.' }));
    return;
  }

  if (handleCorsPreflight(req, res, 'POST, OPTIONS')) {
    return;
  }

  if (!requireAdmin(req, res)) return;

  if (req.method !== 'POST') {
    res.status(405).end(JSON.stringify({ message: 'Method not allowed.' }));
    return;
  }

  if (!req.file) {
    res.status(400).end(JSON.stringify({ message: 'No file uploaded.' }));
    return;
  }

  // The file is already saved to disk by the multer middleware in app.js
  // We just return the path relative to public
  const publicPath = `/uploads/${req.file.filename}`;
  
  res.status(200).end(JSON.stringify({ 
    message: 'Upload successful', 
    url: publicPath,
    filename: req.file.filename
  }));
}
