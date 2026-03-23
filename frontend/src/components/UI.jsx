// Button Component
export const Button = ({ children, onClick, disabled = false, variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-300 text-gray-800 hover:bg-gray-400',
        danger: 'bg-red-600 text-white hover:bg-red-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`px-4 py-2 rounded-lg font-medium transition ${variants[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

// Card Component
export const Card = ({ children, className = '' }) => {
    return <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>{children}</div>;
};

// Input Component
export const Input = ({ label, error, ...props }) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
            <input {...props} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-500 ${error ? 'border-red-500' : 'border-gray-300'}`} />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

// Select Component
export const Select = ({ label, options, error, ...props }) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
            <select {...props} className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 ${error ? 'border-red-500' : 'border-gray-300'}`}>
                <option value="">Select {label}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

// Loading Spinner
export const Spinner = ({ size = 'md' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
    };

    return (
        <div className="flex justify-center items-center">
            <div className={`${sizes[size]} border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin`}></div>
        </div>
    );
};

// Alert Component
export const Alert = ({ type = 'info', message, onClose }) => {
    const types = {
        success: 'bg-green-100 text-green-800 border-green-300',
        error: 'bg-red-100 text-red-800 border-red-300',
        warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
        info: 'bg-blue-100 text-blue-800 border-blue-300',
    };

    return (
        <div className={`border rounded-lg p-4 mb-4 flex justify-between items-center ${types[type]}`}>
            <p>{message}</p>
            {onClose && (
                <button onClick={onClose} className="font-bold cursor-pointer">
                    ×
                </button>
            )}
        </div>
    );
};

// Badge Component
export const Badge = ({ children, variant = 'primary' }) => {
    const variants = {
        primary: 'bg-blue-100 text-blue-800',
        success: 'bg-green-100 text-green-800',
        danger: 'bg-red-100 text-red-800',
        warning: 'bg-yellow-100 text-yellow-800',
    };

    return <span className={`px-3 py-1 rounded-full text-sm font-medium ${variants[variant]}`}>{children}</span>;
};

// Modal Component
export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg overflow-hidden w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        ×
                    </button>
                </div>
                <div className="p-6">{children}</div>
            </div>
        </div>
    );
};

// Pagination Component
export const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="flex justify-center gap-2 mt-6">
            <Button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} variant="secondary">
                Previous
            </Button>
            <span className="px-4 py-2">
                Page {currentPage} of {totalPages}
            </span>
            <Button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="secondary">
                Next
            </Button>
        </div>
    );
};

// Star Rating Display Component
export const StarRating = ({ rating, size = 'md', showCount = false, count = 0 }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };

    return (
        <div className="flex items-center gap-1">
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className={`${sizes[size]} ${star <= Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                    </span>
                ))}
            </div>
            {showCount && <span className="text-sm text-gray-600">({count})</span>}
        </div>
    );
};

// Player Card with Rating Component
export const PlayerCard = ({ player, showRating = true, size = 'md' }) => {
    const sizes = {
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
    };

    return (
        <div className={`bg-white rounded-lg border border-gray-200 ${sizes[size]} flex items-start gap-4`}>
            <div className="flex-1">
                <h4 className="font-medium text-gray-800">
                    {player.firstName} {player.lastName}
                </h4>
                {showRating && player.rating !== undefined && (
                    <div className="flex items-center gap-2 mt-2">
                        <StarRating rating={player.rating} size="sm" />
                        <span className="text-xs text-gray-600">{player.rating}/5</span>
                        {player.totalReviews && <span className="text-xs text-gray-500">({player.totalReviews})</span>}
                    </div>
                )}
            </div>
        </div>
    );
};
