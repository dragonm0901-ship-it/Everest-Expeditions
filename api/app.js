import express from 'express';
import inquiryHandler from './inquiries.js';
import adminInquiriesHandler from './admin/inquiries.js';
import adminInquiryDetailHandler from './admin/inquiries/[id].js';
import adminSessionHandler from './admin/session.js';
import adminSearchHandler from './admin/search.js';
import adminStatsHandler from './admin/stats.js';
import adminDestinationsHandler from './admin/destinations.js';
import adminExperiencesHandler from './admin/experiences.js';
import adminUploadHandler from './admin/upload.js';
import publicDestinationsHandler from './destinations.js';
import { upload } from './_lib/upload.js';

export function createLocalApiApp() {
  const app = express();
  const port = Number(process.env.API_PORT || 8787);

  app.use(express.json({ limit: '1mb' }));
  app.use(express.urlencoded({ extended: true }));

  async function runHandler(handler, req, res, extraQuery = {}) {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const query = Object.fromEntries(url.searchParams.entries());

    const mergedQuery = {
      ...query,
      ...extraQuery
    };

    Object.defineProperty(req, 'query', {
      value: mergedQuery,
      enumerable: true,
      configurable: true,
      writable: true
    });

    try {
      await handler(req, res);
    } catch (error) {
      console.error('[API Error]', error);

      if (!res.headersSent) {
        res.status(500).end(JSON.stringify({ message: 'Internal server error.' }));
      }
    }
  }

  app.get('/api/health', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ ok: true, port }));
  });

  app.all('/api/inquiries', (req, res) => runHandler(inquiryHandler, req, res));

  app.all('/api/admin/session', (req, res) => runHandler(adminSessionHandler, req, res));
  
  app.all('/api/admin/search', (req, res) => runHandler(adminSearchHandler, req, res));
  
  app.all('/api/admin/stats', (req, res) => runHandler(adminStatsHandler, req, res));
  
  app.all('/api/admin/inquiries', (req, res) => runHandler(adminInquiriesHandler, req, res));
  
  app.get('/api/admin/inquiries/:id', (req, res) =>
    runHandler(adminInquiryDetailHandler, req, res, { id: req.params.id })
  );
  app.patch('/api/admin/inquiries/:id', (req, res) =>
    runHandler(adminInquiryDetailHandler, req, res, { id: req.params.id })
  );

  // New Content Management Routes
  app.all('/api/destinations', (req, res) => runHandler(publicDestinationsHandler, req, res));
  
  app.all('/api/admin/destinations', (req, res) => runHandler(adminDestinationsHandler, req, res));
  app.all('/api/admin/experiences', (req, res) => runHandler(adminExperiencesHandler, req, res));
  
  app.post('/api/admin/upload', upload.single('file'), (req, res) => 
    runHandler(adminUploadHandler, req, res)
  );

  return app;
}
