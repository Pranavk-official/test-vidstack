import { useMediaStore } from '@vidstack/react';

// This component is a child of `<MediaPlayer>`
function PlayerChildComponent() {
  // No ref required.
  const { paused, currentTime } = useMediaStore();

  return (
    <>
    <div className="absolute top-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-50 text-white text-center">
      {paused ? 'Paused' : 'Playing'}
    </div>
    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 bg-opacity-50 text-white text-center">
      {currentTime}
    </div>
    </>
  )
}

export default PlayerChildComponent;