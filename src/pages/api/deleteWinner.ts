import { prisma } from "../../db";
import { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { kv } from "@vercel/kv";

const createRedisKey = (userId: string) => `user_${userId}`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);
  if (req.method === "DELETE") {
    console.log(`delete`);
    if (!userId) {
      res.status(400).json({ success: false, error: `userId missing` });
      return;
    }
    if(!req.query.winnerId || Array.isArray(req.query.winnerId)) {
      res.status(400).json({ success: false, error: `winnerId missing` });
      return;
    }
    await prisma.winners.update({
      where: { winnerId: req.query.winnerId },
      data: {
        isDeleted: true
      }
    });
    await kv.del(createRedisKey(userId));
    res.status(200).json({success: true, error: ""});
  } else {
    // 500
    res.status(500).json({ success: false, error: `Server Error` });
  }
}
