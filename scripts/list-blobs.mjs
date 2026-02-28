import { list } from '@vercel/blob';

const { blobs } = await list();
for (const blob of blobs) {
  console.log(`${blob.pathname} -> ${blob.url}`);
}
