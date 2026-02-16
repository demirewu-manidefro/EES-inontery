import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { ArrowLeft, FileText, Info, BarChart3, Bell } from 'lucide-react';

const GenericContent = () => {
    const location = useLocation();
    const path = location.pathname;

    // Mapping paths to titles and content
    const contentMap = {
        '/about/history': {
            title: 'Our History',
            subtitle: 'A journey of data excellence since 1956',
            icon: Info,
            text: 'The Ethiopian Statistical Service (ESS) was established in 1956. Over the decades, it has evolved from a small unit in the Ministry of Commerce and Industry to a fully-fledged autonomous government service. Our history is marked by a commitment to providing the nation with reliable, timely, and quality statistical information.'
        },
        '/about/structure': {
            title: 'Organization Structure',
            subtitle: 'How we are organized to serve Ethiopia',
            icon: FileText,
            text: 'ESS is governed by a Director General and operates through several specialized directorates, including Socio-Economic Statistics, Population and Vital Statistics, and Data Quality Assurance. Our structure ensures that every statistical domain is managed by experts dedicated to data integrity.'
        },
        '/about/strategies': {
            title: 'Our Strategies',
            subtitle: 'The National Strategy for the Development of Statistics (NSDS)',
            icon: FileText,
            text: 'Our strategic direction is guided by the NSDS, aiming to modernize our data collection methods, enhance statistical capacity, and ensure that our data meets international standards while remaining relevant to local development goals like the Homegrown Economic Reform.'
        },
        '/stats/population': {
            title: 'Population Statistics',
            subtitle: 'Understanding Ethiopia through numbers',
            icon: BarChart3,
            text: 'We provide comprehensive data on Ethiopia’s population, including demographic trends, urban-rural distribution, and vital statistics. This data is crucial for infrastructure planning, healthcare resource allocation, and social policy development.'
        },
        '/stats/agriculture': {
            title: 'Agricultural Statistics',
            subtitle: 'The backbone of our economy',
            icon: BarChart3,
            text: 'ESS conducts regular agricultural surveys to monitor crop production, livestock numbers, and land usage. This information supports food security monitoring and agricultural policy formulation for sustainable development.'
        },
        '/stats/economy': {
            title: 'Economic Statistics',
            subtitle: 'Gauging the nation’s wealth and progress',
            icon: BarChart3,
            text: 'Our economic data covers GDP, Consumer Price Index (CPI), trade statistics, and industrial production. These indicators provide a clear picture of Ethiopia’s economic health and growth trajectories.'
        },
        '/tenders': {
            title: 'Active Tenders',
            subtitle: 'Procurement opportunities at ESS',
            icon: Bell,
            text: 'ESS regularly issues tenders for equipment, software, and consultancy services. We maintain a transparent procurement process ensuring fair competition and value for the public funds entrusted to us.'
        },
        '/jobs': {
            title: 'Vacancies & Careers',
            subtitle: 'Join the team of statistical experts',
            icon: Bell,
            text: 'We are always looking for talented statisticians, data scientists, and administrative professionals. Visit our portal regularly to find new opportunities to contribute to the nation’s data landscape.'
        }
    };

    const currentContent = contentMap[path] || {
        title: 'Content Coming Soon',
        subtitle: 'We are updating our digital archives',
        icon: Info,
        text: 'This section is currently being updated with the latest information from the Ethiopian Statistical Service. Please check back later or contact our headquarters for immediate inquiries.'
    };

    const Icon = currentContent.icon;

    return (
        <div className="min-h-screen bg-[#f3f6f9] font-sans">
            <header className="bg-[#1d4e89] text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors text-sm font-black uppercase tracking-widest">
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                            <Icon size={32} className="text-[#b38a5d]" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-black tracking-tighter uppercase mb-2">{currentContent.title}</h1>
                            <p className="text-blue-100 font-bold opacity-80">{currentContent.subtitle}</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-6 py-20">
                <article className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
                    <div className="prose prose-slate max-w-none">
                        <p className="text-xl text-slate-600 leading-relaxed font-medium">
                            {currentContent.text}
                        </p>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between text-slate-400">
                        <div className="flex items-center gap-2">
                            <Clock size={16} />
                            <span className="text-xs font-bold uppercase">Last Updated: Feb 2026</span>
                        </div>
                        <button className="bg-[#1d4e89]/5 text-[#1d4e89] px-6 py-2 rounded-lg font-black text-xs uppercase hover:bg-[#1d4e89] hover:text-white transition-all">
                            Download Official Report
                        </button>
                    </div>
                </article>
            </main>
        </div>
    );
};

// Simple Clock mock for the UI
const Clock = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
);

export default GenericContent;
