import { unlink } from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { hasAccess } from '~/server/utils/permission';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
   hasAccess(event, ['admin', 'author']);
   try {
       console.log("📩 Received request to bulk delete casts");

       const body = await readBody(event);
       console.log("📝 Parsed body:", body);

       const { ids } = body;

       if (!ids || !Array.isArray(ids) || ids.length === 0) {
           console.error("🚨 Invalid request. No valid IDs provided.");
           return { error: "Invalid request. No IDs provided." };
       }

       console.log("🔍 Fetching casts from database...");
       const casts = await prisma.cast.findMany({
           where: { id: { in: ids } }
       });

       if (!casts.length) {
           console.error("🚨 No matching casts found in the database.");
           return { error: "No casts found with the provided IDs." };
       }

       console.log("🗑️ Deleting cast images...");
       const uploadDir = process.env.ENV_MODE === 'development' ? 'public' : '../../../var/www/moreview/';
 
       for (const cast of casts) {
           if (cast.photo) {
           const castPath = path.join(process.cwd(), uploadDir, cast.photo);
           try {
               await unlink(castPath);
               console.log(`✅ Deleted file: ${castPath}`);
           } catch (err) {
               console.warn(`⚠️ Failed to delete file: ${castPath}`, err);
           }
           } else {
           console.log("File not found or already deleted:", cast.photo);
           }
       }

       console.log("🗄️ Deleting records from the database...");
       await prisma.cast.deleteMany({
           where: { id: { in: ids } }
       });

       console.log("✅ Successfully deleted casts!");
       return { message: "Casts deleted successfully" };
   } catch (error) {
       console.error("❌ Error in bulk delete API:", error);
       return { error: "Failed to delete casts", details: (error as Error).message };
   }
});

