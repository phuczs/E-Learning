import { useState, useEffect } from 'react';
import { FiDownload, FiX } from 'react-icons/fi';

const InstallPrompt = () => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Check if user has dismissed before
            const dismissed = localStorage.getItem('pwa_install_dismissed');
            if (!dismissed) {
                setShowPrompt(true);
            }
        };

        window.addEventListener('beforeinstallprompt', handler);

        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setShowPrompt(false);
        }

        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        }

        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        localStorage.setItem('pwa_install_dismissed', 'true');
        setShowPrompt(false);
    };

    if (!showPrompt) return null;

    return (
        <div className="install-prompt">
            <div className="install-prompt-content">
                <div className="install-icon">
                    <FiDownload />
                </div>
                <div className="install-text">
                    <h4>Install AI Study Assistant</h4>
                    <p>Install our app for quick access and offline use</p>
                </div>
                <div className="install-actions">
                    <button onClick={handleInstall} className="btn btn-primary btn-sm">
                        Install
                    </button>
                    <button onClick={handleDismiss} className="btn btn-ghost btn-sm">
                        <FiX />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InstallPrompt;
