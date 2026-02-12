import React from 'react';

/**
 * ResponsiveTableWrapper - Makes tables mobile-friendly
 * On mobile: Tables become horizontally scrollable with proper touch handling
 * On tablet+: Tables display normally
 */
const ResponsiveTableWrapper = ({ children, className = '' }) => {
    return (
        <div className={`w-full ${className}`}>
            {/* Mobile: Card scroll container */}
            <div className="overflow-x-auto -mx-4 sm:mx-0">
                <div className="inline-block min-w-full align-middle">
                    <div className="overflow-hidden shadow-sm sm:rounded-xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveTableWrapper;
