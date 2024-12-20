"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { enrollAction, getVideoProgressAction, saveProgressAction } from "./actions";

export default function usePrograms() {

    const progress = (videoId: string) => {
        return useQuery({
            queryKey: ['progress'],
            queryFn: () => {
                getVideoProgressAction(videoId)
            }
        });
    }

    const saveProgress = useMutation({
        mutationKey: ['saveProgress'],
        mutationFn: async (variables: {
            videoId: string;
            progress: number;
            userId: string;
        }) => {
            console.log(`Saving progress for video ${variables.videoId} to ${variables.progress}`);
            return saveProgressAction(variables.videoId, variables.progress, variables.userId)
        }

    });



    const enroll = useMutation({
        mutationKey: ['enroll'],
        mutationFn: async (variables: {
            videoId: string;
            userId: string;
        }) => {
            return enrollAction(variables.videoId, variables.userId)
        }

    });

    return {
        progress,
        saveProgress,
        enroll
    }

}
