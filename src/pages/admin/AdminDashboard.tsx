import React from 'react';
import { Ship, ClipboardList, FileText, Database } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
    return (
        <div className="space-y-6">
            <header>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Manage content, configurations, and fleet data.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <DashboardCard
                    title="Ships Database"
                    icon={Ship}
                    count="Active"
                    desc="Manage fleet details"
                    to="/admin/ships"
                    color="bg-blue-500"
                />
                <DashboardCard
                    title="Checklist Templates"
                    icon={ClipboardList}
                    count="Editable"
                    desc="Edit sections and items"
                    to="/admin/checklists"
                    color="bg-teal-500"
                />
                <DashboardCard
                    title="Documents"
                    icon={FileText}
                    count="Files"
                    desc="Upload resources"
                    to="/admin/documents"
                    color="bg-purple-500"
                />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
                <div className="flex items-center gap-3 mb-4 text-fiordland-800">
                    <Database className="w-5 h-5" />
                    <h2 className="text-lg font-semibold">System Status</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatusItem label="Database" value="Connected (SQLite)" status="good" />
                    <StatusItem label="Assets" value="Served Locally" status="good" />
                    <StatusItem label="Environment" value={process.env.NODE_ENV === 'production' ? 'Production' : 'Development'} status="neutral" />
                </div>
            </div>
        </div>
    );
}

function DashboardCard({ title, icon: Icon, count, desc, to, color }: any) {
    return (
        <Link to={to} className="group bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all hover:border-brand-teal/30">
            <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-white mb-4 shadow-sm group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">{count}</span>
                <span className="text-brand-teal text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Manage &rarr;</span>
            </div>
        </Link>
    );
}

function StatusItem({ label, value, status }: any) {
    const colors = {
        good: 'bg-green-100 text-green-700',
        neutral: 'bg-blue-100 text-blue-700',
        warning: 'bg-yellow-100 text-yellow-700'
    };
    return (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 flex justify-between items-center">
            <span className="text-gray-600 font-medium text-sm">{label}</span>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${colors[status as keyof typeof colors]}`}>{value}</span>
        </div>
    );
}
