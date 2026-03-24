import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center mt-16 pb-12">
            <nav className="inline-flex -space-x-px rounded-xl border border-white/10 overflow-hidden shadow-2xl glass" aria-label="Pagination">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className={`px-6 py-4 text-sm font-bold border-r border-white/10 transition-colors ${currentPage === 1
                            ? 'text-gray-600 cursor-not-allowed opacity-50'
                            : 'text-brand-primary hover:bg-white/5'
                        }`}
                >
                    Previous
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`px-6 py-4 text-sm font-bold border-r border-white/10 transition-all ${currentPage === page
                                ? 'bg-brand-primary text-white'
                                : 'text-brand-primary hover:bg-white/5'
                            }`}
                    >
                        {page}
                    </button>
                ))}

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className={`px-6 py-4 text-sm font-bold transition-colors ${currentPage === totalPages
                            ? 'text-gray-600 cursor-not-allowed opacity-50'
                            : 'text-brand-primary hover:bg-white/5'
                        }`}
                >
                    Next
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
