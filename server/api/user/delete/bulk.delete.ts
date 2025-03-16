import { unlink } from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { hasAccess } from '~/server/utils/permission';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
   hasAccess(event, ['admin']);
   try {
       console.log("📩 Received request to bulk delete users");

       const body = await readBody(event);
       console.log("📝 Parsed body:", body);

       const { ids } = body;

       if (!ids || !Array.isArray(ids) || ids.length === 0) {
           console.error("🚨 Invalid request. No valid IDs provided.");
           return { error: "Invalid request. No IDs provided." };
       }

       console.log("🔍 Fetching users from database...");
       const users = await prisma.users.findMany({
           where: { id: { in: ids } }
       });

       if (!users.length) {
           console.error("🚨 No matching users found in the database.");
           return { error: "No users found with the provided IDs." };
       }

       console.log("🗑️ Deleting user images...");
       const uploadDir = process.env.ENV_MODE === 'development' ? 'public' : '../../../var/www/moreview/';
 
       for (const user of users) {
           if (user.photo) {
           const pictPath = path.join(process.cwd(), uploadDir, user.photo);
           try {
               await unlink(pictPath);
               console.log(`✅ Deleted file: ${pictPath}`);
           } catch (err) {
               console.warn(`⚠️ Failed to delete file: ${pictPath}`, err);
           }
           } else {
           console.log("File not found or already deleted:", user.photo);
           }
       }

       console.log("🗄️ Deleting records from the database...");
       await prisma.users.deleteMany({
           where: { id: { in: ids } }
       });

       console.log("✅ Successfully deleted casts!");
       return { message: "Casts deleted successfully" };
   } catch (error) {
       console.error("❌ Error in bulk delete API:", error);
       return { error: "Failed to delete casts", details: (error as Error).message };
   }
});

