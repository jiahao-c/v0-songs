import { list } from '@vercel/blob';

const { blobs } = await list();
blobs.forEach(b => {
  console.log(`${b.pathname} -> ${b.url}`);
});
