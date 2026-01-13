import { AppHeader } from "@/components/app/app-header";
import {
  User,
  Mail,
  Globe,
  Key,
  Bell,
  Shield,
  CreditCard,
  Trash2,
  Users,
  UserPlus,
  Crown,
  MoreHorizontal,
  Settings,
  Palette,
  Code,
} from "lucide-react";

// Glowing Icon Component
function GlowingIcon({ icon: Icon, color }: { icon: any; color: string }) {
  return (
    <div className="relative h-10 w-10 flex items-center justify-center">
      <div className={`absolute h-8 w-8 rounded-full ${color} opacity-40 blur-lg`} />
      <div className={`relative h-10 w-10 rounded-xl ${color} bg-opacity-20 flex items-center justify-center backdrop-blur-sm border border-white/10`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  );
}

export default function SettingsPage() {
  const inputClass = "w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500/50";

  return (
    <div className="min-h-screen bg-[#0f0a1f]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <AppHeader title="Settings" />

        <div className="p-4 lg:p-6 space-y-6 max-w-4xl">
          {/* Profile */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <GlowingIcon icon={User} color="bg-violet-500" />
              <div>
                <h3 className="font-semibold text-white">Profile</h3>
                <p className="text-sm text-gray-400">Manage your personal information</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-xl font-semibold">JD</div>
                <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors">Change Avatar</button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                  <input defaultValue="John" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                  <input defaultValue="Doe" className={inputClass} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input type="email" defaultValue="john@example.com" className={inputClass} />
              </div>
              <button className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all">Save Changes</button>
            </div>
          </div>

          {/* Custom Domain */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Globe} color="bg-emerald-500" />
                <div>
                  <h3 className="font-semibold text-white">Custom Domain</h3>
                  <p className="text-sm text-gray-400">Use your own domain for branded short links</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-violet-500/20 text-violet-400">Pro Feature</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input placeholder="links.yourdomain.com" className={`flex-1 ${inputClass}`} />
                <button className="px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all">Add Domain</button>
              </div>
              <div className="p-4 rounded-xl bg-violet-500/10 border border-violet-500/20 text-sm">
                <p className="font-medium text-white mb-1">How to set up your custom domain</p>
                <p className="text-gray-400">Add a CNAME record pointing to <code className="bg-white/10 px-2 py-0.5 rounded text-violet-400">cname.linkforge.com</code></p>
              </div>
            </div>
          </div>

          {/* API Keys */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center gap-3 mb-6">
              <GlowingIcon icon={Key} color="bg-cyan-500" />
              <div>
                <h3 className="font-semibold text-white">API Keys</h3>
                <p className="text-sm text-gray-400">Manage your API keys for integrations</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                <div>
                  <p className="font-medium text-white">Production Key</p>
                  <p className="text-sm text-gray-400">lf_live_••••••••••••1234</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors">Copy</button>
                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors">Regenerate</button>
                </div>
              </div>
              <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-gray-300 text-sm transition-colors">Create New Key</button>
            </div>
          </div>

          {/* Team Members */}
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <GlowingIcon icon={Users} color="bg-amber-500" />
                <div>
                  <h3 className="font-semibold text-white">Team Members</h3>
                  <p className="text-sm text-gray-400">Invite team members to collaborate</p>
                </div>
              </div>
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 text-gray-300">3/10 members</span>
            </div>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input placeholder="colleague@company.com" type="email" className={`flex-1 ${inputClass}`} />
                <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-medium rounded-xl transition-all">
                  <UserPlus className="h-4 w-4" />
                  Invite
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { name: "John Doe", email: "john@example.com", role: "Owner", avatar: "JD" },
                  { name: "Jane Smith", email: "jane@example.com", role: "Admin", avatar: "JS" },
                  { name: "Bob Wilson", email: "bob@example.com", role: "Member", avatar: "BW" },
                ].map((member, i) => (
                  <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white text-sm font-semibold">{member.avatar}</div>
                      <div>
                        <p className="font-medium text-white">{member.name}</p>
                        <p className="text-sm text-gray-400">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${member.role === "Owner" ? "bg-amber-500/20 text-amber-400" : "bg-white/10 text-gray-400"}`}>{member.role}</span>
                      {member.role !== "Owner" && (
                        <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400"><MoreHorizontal className="h-4 w-4" /></button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-500/5 backdrop-blur-xl rounded-2xl border border-red-500/20 p-6">
            <div className="flex items-center gap-3 mb-6">
              <GlowingIcon icon={Trash2} color="bg-red-500" />
              <div>
                <h3 className="font-semibold text-white">Danger Zone</h3>
                <p className="text-sm text-gray-400">Irreversible and destructive actions</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-red-500/5 border border-red-500/10">
              <div>
                <p className="font-medium text-white">Delete Account</p>
                <p className="text-sm text-gray-400">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium transition-colors">Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
