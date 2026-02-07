// latency_test.js – measures average response time for key API endpoints
// Uses the built‑in fetch available in Node >=18, no external dependencies.

const BASE_URL = 'http://127.0.0.1:8000/api';
const ENDPOINTS = [
  '/inventory/stability',
  '/shipping/queue',
  '/orders/history'
];

async function measure(endpoint, iterations = 10) {
  let total = 0;
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    const res = await fetch(BASE_URL + endpoint);
    // Consume response body to ensure full round‑trip
    await res.text();
    const duration = Date.now() - start;
    total += duration;
    console.log(`Iteration ${i + 1} for ${endpoint}: ${duration} ms`);
  }
  const avg = total / iterations;
  console.log(`\nAverage latency for ${endpoint}: ${avg.toFixed(2)} ms over ${iterations} runs\n`);
}

(async () => {
  for (const ep of ENDPOINTS) {
    await measure(ep);
  }
})();
