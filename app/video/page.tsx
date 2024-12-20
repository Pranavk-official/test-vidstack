'use client';
import '@vidstack/react/player/styles/default/layouts/video.css';
import '@vidstack/react/player/styles/default/theme.css';

import { useDebounceCallback } from '@react-hook/debounce';
import { MediaPlayer, MediaPlayerInstance, MediaProvider, useStore } from '@vidstack/react';
import { defaultLayoutIcons, DefaultVideoLayout } from '@vidstack/react/player/layouts/default';
import { useRef } from 'react';
import usePrograms from '../_/use-programs';
import PlayerChildComponent from './components/player-child';



const VideoPage = () => {

    const { enroll, saveProgress } = usePrograms();
    const player = useRef<MediaPlayerInstance>(null);
    const { title, currentTime } = useStore(MediaPlayerInstance, player);

    const saveVideoProgress = async (time: number) => {
        try {
            await saveProgress.mutateAsync({
                videoId: title,
                progress: time,
                userId: 'userId 51'
            });
            console.log('Progress saved');
        } catch (error) {
            console.error('Failed to save progress', error);
        }
    }

    // Debounce the progress save for 500 seconds (500000ms)
    const debouncedSaveProgress = useDebounceCallback(saveVideoProgress, 500000);

    const handleProgress = (event: any) => {
        debouncedSaveProgress(currentTime);
    }

    const handleStarted = async () => {
        console.log('Video started');
        await enroll.mutateAsync({ videoId: title, userId: 'userId 501' });
    }

    return (
        <div className="w-full h-screen flex items-center justify-center bg-gray-900">
            <div className="w-full max-w-3xl">
                <MediaPlayer ref={player} onStarted={handleStarted} onPause={() => saveVideoProgress(currentTime)} onEnded={() => saveVideoProgress(currentTime)} onProgress={handleProgress} title="Sprite Fight" src="https://files.vidstack.io/sprite-fight/hls/stream.m3u8">
                    <MediaProvider />
                    <PlayerChildComponent />
                    <DefaultVideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" icons={defaultLayoutIcons} />
                </MediaPlayer>
            </div>
        </div>
    );
}

export default VideoPage;