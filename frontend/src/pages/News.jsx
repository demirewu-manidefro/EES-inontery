import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Newspaper, Clock, User, ChevronRight } from 'lucide-react';

const NewsPage = () => {
    const newsItems = [
        {
            id: 1,
            title: "Debre Berhan Branch Completes Annual Inventory Sync",
            date: "Feb 10, 2026",
            author: "Admin Section",
            excerpt: "The Debre Berhan regional office has successfully synchronized its material database with the national headquarters system...",
            image: "https://images.unsplash.com/photo-1586769852044-692d6e69a49e?auto=format&fit=crop&w=800&q=80"
        },
        {
            id: 2,
            title: "New Employee Welfare portal Launched",
            date: "Feb 05, 2026",
            author: "HR Department",
            excerpt: "As part of our digital transformation initiative, we are proud to launch the new welfare tracking system for all staff members...",
            image: "https://images.unsplash.com/photo-1454165833767-1390e501ddff?auto=format&fit=crop&w=800&q=80"
        }
    ];

    return (
        <div className="min-h-screen bg-[#f3f6f9]">
            <header className="bg-[#1d4e89] text-white py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-6 transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl font-black flex items-center gap-4">
                        <Newspaper size={36} className="text-[#b38a5d]" />
                        Latest News & Updates
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="grid md:grid-cols-2 gap-8">
                    {newsItems.map(item => (
                        <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all group">
                            <div className="h-64 overflow-hidden relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-[#1d4e89] text-white px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider">
                                    Official News
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="flex items-center gap-4 text-xs text-gray-400 font-bold uppercase tracking-widest mb-4">
                                    <span className="flex items-center gap-1"><Clock size={14} /> {item.date}</span>
                                    <span className="flex items-center gap-1"><User size={14} /> {item.author}</span>
                                </div>
                                <h2 className="text-2xl font-black text-[#1d4e89] mb-4 leading-tight group-hover:text-[#b38a5d] transition-colors">{item.title}</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed">{item.excerpt}</p>
                                <button className="flex items-center font-black text-[#1d4e89] group-hover:gap-3 transition-all uppercase text-sm tracking-widest">
                                    Read Full Story <ChevronRight size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default NewsPage;
