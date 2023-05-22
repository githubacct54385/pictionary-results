import { prisma } from "@/db";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";
import { Winners } from "@prisma/client";
import { revalidatePath } from "next/cache";

const createRedisKey = (userId: string) => `user_${userId}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (req.method === "GET") {
    if (!userId) {
      res.status(400).json({ winners: [], error: `userId missing` });
      return;
    }
    const redisKey = createRedisKey(userId);
    const redisResults = await kv.get<Winners[]>(redisKey);
    if (redisResults) {
      res.status(200).json({ winners: redisResults });
      return;
    }
    const winners = await prisma.winners.findMany({
      where: { userId, isDeleted: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    await kv.set<Winners[]>(redisKey, winners);
    res.status(200).json({ winners });
  } else {
    // 500
    res.status(500).json({ winners: [], error: `Server Error` });
  }
}
