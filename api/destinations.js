import { listDestinationRecords, listExperienceRecords } from './_lib/database.js';
import { setJsonHeaders } from './_lib/adminAuth.js';
import { applyCors, handleCorsPreflight } from './_lib/cors.js';

export default async function handler(req, res) {
  setJsonHeaders(res);

  if (!applyCors(req, res)) {
    res.status(403).end(JSON.stringify({ message: 'Origin not allowed.' }));
    return;
  }

  if (handleCorsPreflight(req, res, 'GET, OPTIONS')) {
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).end(JSON.stringify({ message: 'Method not allowed.' }));
    return;
  }

  try {
    const destinations = listDestinationRecords();
    const experiences = listExperienceRecords();
    
    res.status(200).end(
      JSON.stringify({
        destinations,
        experiences
      })
    );
  } catch (error) {
    console.error('[Destinations API Error]', error);
    res.status(500).end(
      JSON.stringify({
        message: 'Unable to fetch destinations at this time.'
      })
    );
  }
}
