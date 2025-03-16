import { PrismaClient } from '@prisma/client';
import { now } from 'moment';
import { hasAccess } from '~/server/utils/permission';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
   hasAccess(event, ['admin']);
   try {
       console.log("📩 Received request to bulk ban users");

       const body = await readBody(event);
       console.log("📝 Parsed body:", body);

       const { ids } = body;

       if (!ids || !Array.isArray(ids) || ids.length === 0) {
           console.error("🚨 Invalid request. No valid IDs provided.");
           return { error: "Invalid request. No IDs provided." };
       }

       console.log("🔍 Fetching users from database...");
       const casts = await prisma.users.findMany({
           where: { id: { in: ids } }
       });

       if (!casts.length) {
           console.error("🚨 No matching users found in the database.");
           return { error: "No users found with the provided IDs." };
       }

       console.log("🗄️ Deleting records from the database...");
       await prisma.users.updateMany({
           where: { id: { in: ids } },
           data: {
            isActive: false,
            updated_at: new Date()
           }
       });

       console.log("✅ Successfully banned users!");
       return { message: "Users banned successfully" };
   } catch (error) {
       console.error("❌ Error in bulk ban API:", error);
       return { error: "Failed to ban users", details: (error as Error).message };
   }
});

