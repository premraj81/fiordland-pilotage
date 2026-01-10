import { Ship, ExternalLink } from 'lucide-react';

export default function CruiseSchedule() {
    return (
        <a
            href="https://newzealandcruiseassociation.com/schedules/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between p-4 bg-sky-50 rounded-xl shadow-sm border border-sky-100 hover:bg-sky-100 transition-colors group"
        >
            <div className="flex items-center gap-3">
                <div className="bg-teal-50 p-2 rounded-lg text-brand-teal group-hover:bg-brand-teal group-hover:text-white transition-colors">
                    <Ship className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-bold text-fiordland-900 group-hover:text-brand-teal transition-colors">Cruise Ship Schedule</h3>
                    <p className="text-xs text-gray-500">View official NZCA schedule</p>
                </div>
            </div>
            <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-brand-teal" />
        </a>
    );
}
