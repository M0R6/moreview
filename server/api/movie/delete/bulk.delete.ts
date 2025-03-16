import { unlink } from 'fs/promises';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import { hasAccess } from '~/server/utils/permission';

const prisma = new PrismaClient();

export default defineEventHandler(async (event) => {
   hasAccess(event, ['admin', 'author']);
   try {
       console.log("📩 Received request to bulk delete movies");

       const body = await readBody(event);
       console.log("📝 Parsed body:", body);

       const { ids } = body;

       if (!ids || !Array.isArray(ids) || ids.length === 0) {
           console.error("🚨 Invalid request. No valid IDs provided.");
           return { error: "Invalid request. No IDs provided." };
       }

       console.log("🔍 Fetching movies from database...");
       const films = await prisma.film.findMany({
           where: { id: { in: ids } }
       });

       if (!films.length) {
           console.error("🚨 No matching movies found in the database.");
           return { error: "No movies found with the provided IDs." };
       }

       console.log("🗑️ Deleting videos & images...");
       const uploadDir = process.env.ENV_MODE === 'development' ? 'public' : '../../../var/www/moreview/';
 
       for (const film of films) {
           if (film.poster) {
           const filmPath = path.join(process.cwd(), uploadDir, film.poster);
           try {
               await unlink(filmPath);
               console.log(`✅ Deleted file: ${filmPath}`);
           } catch (err) {
               console.warn(`⚠️ Failed to delete file: ${filmPath}`, err);
           }
           } else {
           console.log("File not found or already deleted:", film.poster);
           }

           if (film.trailer) {
           const filmPath = path.join(process.cwd(), uploadDir, film.trailer);
           try {
               await unlink(filmPath);
               console.log(`✅ Deleted file: ${filmPath}`);
           } catch (err) {
               console.warn(`⚠️ Failed to delete file: ${filmPath}`, err);
           }
           } else {
           console.log("File not found or already deleted:", film.trailer);
           }
       }

       console.log("🗄️ Deleting records from the database...");
       await prisma.film.deleteMany({
           where: { id: { in: ids } }
       });

       console.log("✅ Successfully deleted movies!");
       return { message: "Movies deleted successfully" };
   } catch (error) {
       console.error("❌ Error in bulk delete API:", error);
       return { error: "Failed to delete movies", details: (error as Error).message };
   }
});

