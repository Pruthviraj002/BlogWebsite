import { useState, useEffect } from 'react';
import { Shield, Globe, Database, Bell, Image as ImageIcon, CheckCircle2, Loader2, Save, Activity } from 'lucide-react';
import api from '../utils/api';

const Settings = () => {
    const [settings, setSettings] = useState({
        siteName: '',
        siteDescription: '',
        contactEmail: '',
        maintenanceMode: false,
        allowRegistration: true,
        cloudinaryFolderName: '',
        maxUploadSize: 5
    });
    const [diagnostics, setDiagnostics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [diagLoading, setDiagLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await api.get('/settings');
            setSettings(res.data.data);
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            await api.patch('/settings', settings);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Failed to save settings:", error);
            setMessage('Error saving settings.');
        } finally {
            setSaving(false);
        }
    };

    const runDiagnostics = async () => {
        setDiagLoading(true);
        try {
            const res = await api.get('/diagnostics');
            setDiagnostics(res.data.data);
        } catch (error) {
            console.error("Diagnostics failed:", error);
        } finally {
            setDiagLoading(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="animate-spin text-brand-primary" size={48} />
        </div>
    );

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h2 className="text-4xl font-black tracking-tight mb-2">System Config</h2>
                    <p className="text-zinc-500 font-medium">Manage core platform behavior and environment variables.</p>
                </div>
                {message && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 animate-bounce">
                        <CheckCircle2 size={16} /> {message}
                    </div>
                )}
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* General Config */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                            <Globe size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Public Presence</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">App Name</label>
                            <input 
                                value={settings.siteName}
                                onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Description</label>
                            <textarea 
                                value={settings.siteDescription}
                                onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                                rows="3"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:ring-2 ring-brand-primary/20 transition-all font-medium resize-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Status & Rules */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Access & Safety</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <p className="font-bold">Maintenance Mode</p>
                                <p className="text-xs text-zinc-500">Only admins can access the platform.</p>
                            </div>
                            <button 
                                onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.maintenanceMode ? 'bg-rose-500' : 'bg-zinc-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <p className="font-bold">Open Registration</p>
                                <p className="text-xs text-zinc-500">Allow new users to sign up.</p>
                            </div>
                            <button 
                                onClick={() => setSettings({...settings, allowRegistration: !settings.allowRegistration})}
                                className={`w-12 h-6 rounded-full transition-all relative ${settings.allowRegistration ? 'bg-indigo-500' : 'bg-zinc-700'}`}
                            >
                                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.allowRegistration ? 'left-7' : 'left-1'}`}></div>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Assets & Media */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-400">
                            <ImageIcon size={24} />
                        </div>
                        <h3 className="text-xl font-bold">Cloud Handling</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Folder Name</label>
                            <input 
                                value={settings.cloudinaryFolderName}
                                onChange={(e) => setSettings({...settings, cloudinaryFolderName: e.target.value})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Max Size (MB)</label>
                            <input 
                                type="number"
                                value={settings.maxUploadSize}
                                onChange={(e) => setSettings({...settings, maxUploadSize: parseInt(e.target.value)})}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm font-medium"
                            />
                        </div>
                    </div>
                </div>

                {/* Diagnostics Display */}
                <div className="bg-zinc-900/50 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                                <Activity size={24} />
                            </div>
                            <h3 className="text-xl font-bold">System Health</h3>
                        </div>

                        {diagnostics ? (
                            <div className="space-y-4 animate-in fade-in zoom-in duration-300">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Database</p>
                                        <p className={`font-bold ${diagnostics.database === 'Healthy' ? 'text-emerald-400' : 'text-rose-400'}`}>{diagnostics.database}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Cloudinary</p>
                                        <p className="font-bold text-white">{diagnostics.env.cloudinary ? 'Connected' : 'Missing Key'}</p>
                                    </div>
                                </div>
                                <div className="bg-indigo-500/5 p-4 rounded-2xl border border-indigo-500/10">
                                    <p className="text-[10px] text-indigo-400 uppercase font-bold tracking-widest">Uptime</p>
                                    <p className="text-sm font-mono text-zinc-300">{(diagnostics.uptime / 60).toFixed(2)} minutes</p>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl text-zinc-600 italic text-sm">
                                Run diagnostics to see system report.
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button 
                            disabled={diagLoading}
                            onClick={runDiagnostics}
                            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 px-6 py-4 rounded-2xl font-bold transition-all text-sm flex items-center justify-center gap-2"
                        >
                            {diagLoading ? <Loader2 className="animate-spin" size={18}/> : <Activity size={18}/>}
                            Perform Check
                        </button>
                        <button 
                            disabled={saving}
                            onClick={handleSave}
                            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 px-6 py-4 rounded-2xl font-black transition-all shadow-lg shadow-brand-primary/20 text-sm flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>}
                            Save All
                        </button>
                    </div>
                </div>
            </div>
            
            <p className="text-center text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] opacity-50">
                System Core Configuration v2.4.0 • Secure Session
            </p>
        </div>
    );
};

export default Settings;
