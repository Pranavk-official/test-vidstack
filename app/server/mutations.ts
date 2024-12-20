import db from "@/db";

export const saveProgress = async (videoId: string, progress: number, userId: string) => {
    const existingProgress = await db.videoProgress.findFirst({
        where: { videoId, userId },
    })

    console.log(`Saving progress of user ${userId} for video ${videoId} to ${progress}`);

    if (existingProgress) {
        return await db.videoProgress.update({
            where: { id: existingProgress.id },
            data: { progress },
        })
    } else {
        return await db.videoProgress.create({
            data: { videoId, progress, userId },
        })
    }
}


export const saveEnrollment = async (videoId: string, userId: string) => {
    const existingEnrollment = await db.enrollment.findFirst({
        where: { videoId, userId },
    })

    if (!existingEnrollment) {
        return await db.enrollment.create({
            data: { videoId, userId },
        })
    }

}