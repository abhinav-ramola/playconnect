import React from 'react';
import { useNotification } from '../context/NotificationContext';
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react';

export const NotificationContainer = () => {
    const { notifications, removeNotification } = useNotification();

    const getTypeStyles = (type) => {
        switch (type) {
            case 'success':
                return 'bg-green-50 border border-green-200 text-green-800';
            case 'error':
                return 'bg-red-50 border border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
            case 'info':
            default:
                return 'bg-blue-50 border border-blue-200 text-blue-800';
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5" />;
            case 'error':
                return <AlertCircle className="w-5 h-5" />;
            case 'warning':
                return <AlertCircle className="w-5 h-5" />;
            case 'info':
            default:
                return <Info className="w-5 h-5" />;
        }
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-md">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`flex items-center gap-3 p-4 rounded-lg shadow-lg animate-in slide-in-from-right-full ${getTypeStyles(notification.type)}`}
                >
                    {getIcon(notification.type)}
                    <div className="flex-1">
                        <p className="text-sm font-medium">{notification.message}</p>
                    </div>
                    <button
                        onClick={() => removeNotification(notification.id)}
                        className="flex-shrink-0 hover:opacity-70"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            ))}
        </div>
    );
};
