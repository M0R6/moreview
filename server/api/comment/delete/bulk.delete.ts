import { PrismaClient } from '@prisma/client';
import { hasAccess } from '~/server/utils/permission';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
   hasAccess(event, ['admin']);
   try {
       console.log("📩 Received request to bulk delete comments");

       const body = await readBody(event);
       console.log("📝 Parsed body:", body);

       const { ids } = body;

       if (!ids || !Array.isArray(ids) || ids.length === 0) {
           console.error("🚨 Invalid request. No valid IDs provided.");
           return { error: "Invalid request. No IDs provided." };
       }

       console.log("🔍 Fetching comments from database...");
       const comments = await prisma.comment.findMany({
           where: { id: { in: ids } }
       });

       if (!comments.length) {
           console.error("🚨 No matching comments found in the database.");
           return { error: "No comments found with the provided IDs." };
       }

       console.log("🗄️ Deleting records from the database...");
       await prisma.comment.deleteMany({
           where: { id: { in: ids } }
       });

       console.log("✅ Successfully deleted comments!");
       return { message: "comments deleted successfully" };
   } catch (error) {
       console.error("❌ Error in bulk delete API:", error);
       return { error: "Failed to delete comments", details: (error as Error).message };
   }
});

