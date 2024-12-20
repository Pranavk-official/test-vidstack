import db from "@/db";


export const getVideoProgress = async (videoId: string) => {
    return await db.videoProgress.findFirst({
        where: { videoId },
    })
}