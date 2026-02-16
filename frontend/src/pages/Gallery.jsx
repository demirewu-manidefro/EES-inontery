import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Image as ImageIcon, Camera, PlayCircle } from 'lucide-react';

const GalleryPage = () => {
    const photos = [
        "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1573161559521-4838bb1af54c?auto=format&fit=crop&w=400&q=80",
        "https://images.unsplash.com/photo-1558403194-611308249627?auto=format&fit=crop&w=400&q=80"
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
                        <Camera size={36} className="text-[#b38a5d]" />
                        Official Media Gallery
                    </h1>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex border-b border-gray-200 mb-12">
                    <button className="px-8 py-4 font-black border-b-4 border-[#1d4e89] text-[#1d4e89] flex items-center gap-2 uppercase tracking-widest text-sm">
                        <ImageIcon size={18} /> Photos
                    </button>
                    <button className="px-8 py-4 font-black text-gray-400 hover:text-[#1d4e89] transition-colors flex items-center gap-2 uppercase tracking-widest text-sm">
                        <PlayCircle size={18} /> Videos
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {photos.map((src, i) => (
                        <div key={i} className="group relative aspect-square rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all cursor-zoom-in">
                            <img src={src} alt={`Gallery ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1d4e89]/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
                                <p className="text-white font-bold text-sm tracking-wide">Regional Branch Activity - #{i + 1}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

export default GalleryPage;
