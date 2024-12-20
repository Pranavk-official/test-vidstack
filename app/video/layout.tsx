import { ReactNode } from 'react';

interface LayoutProps {
    children: ReactNode;
}

export default function VideoLayout({ children }: LayoutProps) {
    return (
        <div className="flex min-h-screen bg-gray-900">
            {/* Main content area */}
            <main className="flex-1 p-6">
                {children}
            </main>

            {/* Sidebar */}
            <aside className="w-80 bg-gray-800 p-4 border-l border-gray-700">
                <div className="sticky top-4">
                    <h2 className="text-xl font-semibold text-white mb-4">Progress</h2>
                    {/* Progress content will be added in the page component */}
                    <div className="space-y-4">
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="text-gray-300">Current Time</div>
                            <div className="text-white font-medium" id="currentTime">0:00</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="text-gray-300">Duration</div>
                            <div className="text-white font-medium" id="duration">0:00</div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4">
                            <div className="text-gray-300">Progress</div>
                            <div className="w-full bg-gray-600 rounded-full h-2 mt-2">
                                <div 
                                    className="bg-blue-500 h-2 rounded-full" 
                                    id="progressBar"
                                    style={{ width: '0%' }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </div>
    );
}