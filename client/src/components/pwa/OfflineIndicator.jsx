import { useState, useEffect } from 'react';
import { FiWifiOff, FiWifi, FiRefreshCw } from 'react-icons/fi';
import { syncQueue } from '../../utils/syncQueue';

const OfflineIndicator = () => {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [queueStatus, setQueueStatus] = useState({ pending: 0, isOnline: true });
    const [syncing, setSyncing] = useState(false);

    useEffect(() => {
        const handleOnline = () => {
            setIsOnline(true);
            updateQueueStatus();
        };

        const handleOffline = () => {
            setIsOnline(false);
            updateQueueStatus();
        };

        const updateQueueStatus = () => {
            setQueueStatus(syncQueue.getQueueStatus());
        };

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        // Update queue status periodically
        const interval = setInterval(updateQueueStatus, 5000);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
            clearInterval(interval);
        };
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            await syncQueue.processQueue();
            setQueueStatus(syncQueue.getQueueStatus());
        } catch (error) {
            console.error('Sync failed:', error);
        } finally {
            setSyncing(false);
        }
    };

    if (isOnline && queueStatus.pending === 0) return null;

    return (
        <div className={`offline-banner ${isOnline ? 'online-pending' : 'offline'}`}>
            <div className="offline-content">
                {isOnline ? <FiWifi /> : <FiWifiOff />}
                <span>
                    {isOnline
                        ? `${queueStatus.pending} action${queueStatus.pending !== 1 ? 's' : ''} pending sync`
                        : "You're offline. Changes will sync when you're back online."}
                </span>
            </div>
            {isOnline && queueStatus.pending > 0 && (
                <button
                    onClick={handleSync}
                    disabled={syncing}
                    className="btn btn-sm btn-ghost"
                >
                    <FiRefreshCw className={syncing ? 'spinning' : ''} />
                    {syncing ? 'Syncing...' : 'Sync Now'}
                </button>
            )}
        </div>
    );
};

export default OfflineIndicator;
