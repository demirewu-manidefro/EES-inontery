import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building2, MapPin, Phone, Mail, Clock, Info } from 'lucide-react';

const AboutBranch = () => {
    return (
        <div className="min-h-screen bg-[#f3f6f9] font-sans">
            {/* Header section with ESS blue */}
            <header className="bg-[#1d4e89] text-white py-16 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <Link to="/" className="inline-flex items-center text-blue-200 hover:text-white mb-8 transition-colors text-sm font-black uppercase tracking-widest">
                        <ArrowLeft size={18} className="mr-2" />
                        Back to Home
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/20">
                            <Building2 size={40} className="text-[#b38a5d]" />
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">Debre Berhan Branch</h1>
                            <p className="text-blue-100 font-bold text-lg opacity-80">Ethiopian Statistical Service (ESS) Regional Office</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-3 gap-12">
                    {/* Main Description Content */}
                    <div className="lg:col-span-2 space-y-10">
                        <section className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Info className="text-[#b38a5d]" size={24} />
                                <h2 className="text-2xl font-black text-[#1d4e89] uppercase tracking-tight">Overview</h2>
                            </div>
                            <div className="space-y-6 text-slate-600 leading-relaxed font-medium">
                                <p>
                                    The **Debre Berhan Branch Office** is one of the pivotal regional hubs of the Ethiopian Statistical Service (ESS),
                                    serving the North Shewa Zone of the Amhara Region. Since its establishment, the branch has been instrumental in
                                    bridge the gap between national statistical goals and local regional data realities.
                                </p>
                                <p>
                                    Our branch is dedicated to the systematic collection, high-standard processing, and professional analysis
                                    of socio-economic and demographic data. We play a critical role in supporting the National Strategy for the
                                    Development of Statistics (NSDS) by providing accurate, timely, and reliable evidence-based data for
                                    regional planning and development.
                                </p>
                                <div className="grid md:grid-cols-2 gap-6 mt-8">
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="text-[#1d4e89] font-black uppercase text-xs tracking-widest mb-3">Core Mission</h3>
                                        <p className="text-sm">To produce and disseminate high-quality regional statistics that empower decision-makers and researchers.</p>
                                    </div>
                                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                        <h3 className="text-[#1d4e89] font-black uppercase text-xs tracking-widest mb-3">Service Focus</h3>
                                        <p className="text-sm">Providing accessible data portals and statistical support for the North Shewa local administrative bodies.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <Building2 className="text-[#b38a5d]" size={24} />
                                <h2 className="text-2xl font-black text-[#1d4e89] uppercase tracking-tight">Key Activities</h2>
                            </div>
                            <ul className="grid md:grid-cols-2 gap-4">
                                {[
                                    "Conducting regional population and housing censuses",
                                    "Monthly monitoring of Consumer Price Indexes (CPI)",
                                    "Agricultural and industrial sample surveys",
                                    "Local labor force and employment statistics",
                                    "Statistical capacity building for local partners",
                                    "Data quality assurance and regional mapping"
                                ].map((activity, i) => (
                                    <li key={i} className="flex items-start gap-3 bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#b38a5d] mt-2 shrink-0"></div>
                                        <span className="text-sm font-bold text-slate-700">{activity}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </div>

                    {/* Sidebar Contact Info */}
                    <div className="space-y-8">
                        <div className="bg-[#1d4e89] text-white p-8 rounded-3xl shadow-xl shadow-blue-900/20">
                            <h3 className="text-xl font-black mb-6 border-b-2 border-[#b38a5d] pb-2 uppercase tracking-widest">Office Info</h3>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <MapPin size={20} className="text-[#b38a5d] shrink-0" />
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-60 mb-1">Location</p>
                                        <p className="text-sm font-bold">Debre Berhan Main Road,<br />North Shewa, Amhara Region</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Phone size={20} className="text-[#b38a5d] shrink-0" />
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-60 mb-1">Phone</p>
                                        <p className="text-sm font-bold">+251 11 123 4567</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Mail size={20} className="text-[#b38a5d] shrink-0" />
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-60 mb-1">Email</p>
                                        <p className="text-sm font-bold">debreberhan.branch@ess.gov.et</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <Clock size={20} className="text-[#b38a5d] shrink-0" />
                                    <div>
                                        <p className="text-xs font-black uppercase opacity-60 mb-1">Working Hours</p>
                                        <p className="text-sm font-bold">Mon - Fri / 8:30 AM - 5:30 PM</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                            <h4 className="text-[#1d4e89] font-black uppercase text-xs tracking-widest mb-4">Official Branch</h4>
                            <div className="w-24 h-24 bg-slate-50 rounded-full mx-auto mb-4 flex items-center justify-center border-2 border-slate-100">
                                <Building2 size={32} className="text-slate-300" />
                            </div>
                            <p className="text-xs text-slate-500 font-bold leading-relaxed px-4">
                                Certified regional office under the Ethiopian Statistical Service Headquarters.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="bg-white border-t border-slate-100 py-10 mt-20">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">
                    <p>© 2026 Ethiopian Statistical Service - Debre Berhan Regional Office</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <Link to="/" className="hover:text-[#1d4e89]">Home</Link>
                        <span>Privacy</span>
                        <span>Contact</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AboutBranch;
