// scripts/init-drive-db.ts
import { driveService } from '@/app/lib/google-drive';

async function initDatabase() {
  const initialData = {
    attendance: [],
  };

  for (const [collection, data] of Object.entries(initialData)) {
    await driveService.saveCollection(collection, data);
    console.log(`✓ Created ${collection}.json`);
  }

  console.log('✅ Database initialized successfully!');
}

initDatabase();