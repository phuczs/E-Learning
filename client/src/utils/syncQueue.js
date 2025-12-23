class SyncQueue {
    constructor() {
        this.queue = this.loadQueue();
        this.isOnline = navigator.onLine;
        this.setupListeners();
    }

    loadQueue() {
        const stored = localStorage.getItem('sync_queue');
        return stored ? JSON.parse(stored) : [];
    }

    saveQueue() {
        localStorage.setItem('sync_queue', JSON.stringify(this.queue));
    }

    addToQueue(request) {
        const queueItem = {
            id: Date.now() + Math.random(),
            ...request,
            timestamp: new Date().toISOString()
        };
        this.queue.push(queueItem);
        this.saveQueue();
        return queueItem;
    }

    async processQueue() {
        if (!this.isOnline || this.queue.length === 0) return;

        const failedRequests = [];
        const processedIds = [];

        for (const request of this.queue) {
            try {
                await this.executeRequest(request);
                processedIds.push(request.id);
            } catch (error) {
                console.error('Failed to sync request:', error);
                failedRequests.push(request);
            }
        }

        this.queue = failedRequests;
        this.saveQueue();

        return {
            processed: processedIds.length,
            failed: failedRequests.length
        };
    }

    async executeRequest(request) {
        const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body ? JSON.stringify(request.body) : undefined
        });

        if (!response.ok) {
            throw new Error(`Request failed: ${response.status}`);
        }
        return response.json();
    }

    setupListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            console.log('Back online - processing sync queue');
            this.processQueue();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            console.log('Gone offline - queueing requests');
        });
    }

    getQueueStatus() {
        return {
            pending: this.queue.length,
            isOnline: this.isOnline
        };
    }

    clearQueue() {
        this.queue = [];
        this.saveQueue();
    }
}

export const syncQueue = new SyncQueue();
