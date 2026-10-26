import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';

// Ensure deterministic fallback responses (no live Gemini calls during tests).
delete process.env.GEMINI_API_KEY;

// Import after clearing the key so the lazy Gemini client never initializes.
const { app } = await import('./server');

describe('Express server endpoints', () => {
  describe('GET /api/health', () => {
    it('returns 200 with the expected health payload', async () => {
      const res = await request(app).get('/api/health');

      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(res.body.app).toBe('Apex Market AI');
      expect(res.body.version).toBe('1.0.0');
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body.hasApiKey).toBe(false);
    });
  });

  describe('GET /api/market/symbols', () => {
    it('returns 200 with all 8 market symbols', async () => {
      const res = await request(app).get('/api/market/symbols');

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body).toHaveLength(8);

      const first = res.body[0];
      expect(first).toHaveProperty('symbol');
      expect(first).toHaveProperty('category');
      expect(first).toHaveProperty('price');
      expect(first).toHaveProperty('change');
      expect(first).toHaveProperty('changePercent');
      expect(first).toHaveProperty('high');
      expect(first).toHaveProperty('low');
      expect(first).toHaveProperty('volume');
      expect(first).toHaveProperty('spread');
    });
  });

  describe('GET /api/market/candles', () => {
    it('returns 200 with candles for the default symbol', async () => {
      const res = await request(app).get('/api/market/candles');

      expect(res.status).toBe(200);
      expect(res.body.symbol).toBe('EUR/USD');
      expect(res.body.timeframe).toBe('15m');
      expect(Array.isArray(res.body.candles)).toBe(true);
      expect(res.body.candles).toHaveLength(70);

      const candle = res.body.candles[0];
      expect(candle).toHaveProperty('timestamp');
      expect(candle).toHaveProperty('open');
      expect(candle).toHaveProperty('high');
      expect(candle).toHaveProperty('low');
      expect(candle).toHaveProperty('close');
      expect(candle).toHaveProperty('volume');
    });

    it('honours symbol and timeframe query params', async () => {
      const res = await request(app).get('/api/market/candles?symbol=XAU/USD&timeframe=1h');

      expect(res.status).toBe(200);
      expect(res.body.symbol).toBe('XAU/USD');
      expect(res.body.timeframe).toBe('1h');
      expect(res.body.candles).toHaveLength(70);
    });
  });

  describe('POST /api/ai/analysis', () => {
    it('returns 200 with fallback analysis when no API key is set', async () => {
      const res = await request(app)
        .post('/api/ai/analysis')
        .send({ symbol: 'EUR/USD', timeframe: '15m', currentPrice: '1.08907' });

      expect(res.status).toBe(200);
      expect(res.body.source).toBe('fallback');
      expect(res.body).toHaveProperty('analysis');
      expect(res.body).toHaveProperty('bias');
      expect(res.body).toHaveProperty('confidence');
      expect(res.body).toHaveProperty('supportLevel');
      expect(res.body).toHaveProperty('resistanceLevel');
      expect(Array.isArray(res.body.keyFactors)).toBe(true);
    });
  });

  describe('GET /api/ai/signals', () => {
    it('returns 200 with fallback trading signals when no API key is set', async () => {
      const res = await request(app).get('/api/ai/signals');

      expect(res.status).toBe(200);
      expect(res.body.source).toBe('fallback');
      expect(Array.isArray(res.body.signals)).toBe(true);
      expect(res.body.signals).toHaveLength(4);

      const signal = res.body.signals[0];
      expect(signal).toHaveProperty('id');
      expect(signal).toHaveProperty('symbol');
      expect(signal).toHaveProperty('type');
      expect(signal).toHaveProperty('entry');
      expect(signal).toHaveProperty('stopLoss');
      expect(signal).toHaveProperty('confidence');
    });
  });

  describe('POST /api/ai/chat', () => {
    it('returns 200 with a fallback reply when no API key is set', async () => {
      const res = await request(app)
        .post('/api/ai/chat')
        .send({ message: 'What is the outlook on EUR/USD?', context: { symbol: 'EUR/USD' } });

      expect(res.status).toBe(200);
      expect(res.body.source).toBe('fallback');
      expect(res.body).toHaveProperty('reply');
      expect(res.body.reply).toContain('EUR/USD');
    });
  });

  describe('unknown routes', () => {
    it('returns 404 for an undefined API route', async () => {
      const res = await request(app).get('/api/does-not-exist');
      expect(res.status).toBe(404);
    });
  });
});
