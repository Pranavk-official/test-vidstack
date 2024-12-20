"use server";

import { saveEnrollment, saveProgress } from "../server/mutations";
import { getVideoProgress } from "../server/query";


export const getVideoProgressAction = async (videoId: string) => {
    return await getVideoProgress(videoId);
}

export const saveProgressAction = async (videoId: string, progress: number, userId: string) => {
    return await saveProgress(videoId, progress, userId);
}

export const enrollAction = async (videoId: string, userId: string) => {
    console.log('Enrolling user', userId, 'to video', videoId);
    return await saveEnrollment(videoId, userId);
}