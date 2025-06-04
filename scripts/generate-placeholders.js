const fs = require('fs');
const { createCanvas } = require('canvas');

const images = [
  { name: 'search', text: 'Search' },
  { name: 'ai-match', text: 'AI Match' },
  { name: 'local', text: 'Local' },
  { name: 'pickup', text: 'Pickup' },
  { name: 'match', text: 'Match' },
];

// Create directory if it doesn't exist
if (!fs.existsSync('public/how-it-works')) {
  fs.mkdirSync('public/how-it-works', { recursive: true });
}

// Generate placeholder images
images.forEach(({ name, text }) => {
  const canvas = createCanvas(800, 800);
  const ctx = canvas.getContext('2d');

  // Fill background
  ctx.fillStyle = '#f5f3ff'; // Light purple background
  ctx.fillRect(0, 0, 800, 800);

  // Add gradient
  const gradient = ctx.createLinearGradient(0, 0, 800, 800);
  gradient.addColorStop(0, 'rgba(129, 140, 248, 0.1)'); // Indigo
  gradient.addColorStop(1, 'rgba(167, 139, 250, 0.1)'); // Purple
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 800, 800);

  // Add text
  ctx.font = 'bold 48px -apple-system, system-ui, sans-serif';
  ctx.fillStyle = '#4f46e5'; // Indigo text
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 400, 400);

  // Save the image
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`public/how-it-works/${name}.png`, buffer);
});

console.log('Placeholder images generated successfully!');
