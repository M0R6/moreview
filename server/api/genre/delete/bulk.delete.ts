import { PrismaClient } from '@prisma/client';
import { hasAccess } from '~/server/utils/permission';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
   hasAccess(event, ['admin']);
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
       const casts = await prisma.genre.findMany({
           where: { id: { in: ids } }
       });

       if (!casts.length) {
           console.error("🚨 No matching casts found in the database.");
           return { error: "No casts found with the provided IDs." };
       }

       console.log("🗄️ Deleting records from the database...");
       await prisma.genre.deleteMany({
           where: { id: { in: ids } }
       });

       console.log("✅ Successfully deleted casts!");
       return { message: "Casts deleted successfully" };
   } catch (error) {
       console.error("❌ Error in bulk delete API:", error);
       return { error: "Failed to delete casts", details: (error as Error).message };
   }
});

