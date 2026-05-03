import React, { useEffect, useState } from 'react';
import { collection, query, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CheckCircle, XCircle, User as UserIcon, Mail, Shield } from 'lucide-react';
import { Language } from '../types';
import { getTranslation } from '../utils/i18n';

interface AdminPanelProps {
  lang: Language;
  onClose: () => void;
}

interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  isApproved: boolean;
  role: string;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ lang, onClose }) => {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const t = getTranslation(lang);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'users'));
      const querySnapshot = await getDocs(q);
      const userList: UserProfile[] = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() } as UserProfile);
      });
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleApproval = async (userId: string, currentStatus: boolean) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { isApproved: !currentStatus });
      setUsers(users.map(u => u.id === userId ? { ...u, isApproved: !currentStatus } : u));
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="bg-arch-900 border border-arch-700 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-arch-800 flex items-center justify-between bg-arch-900/50">
          <h2 className="text-2xl font-bold text-white flex items-center gap-3">
            <Shield className="w-6 h-6 text-arch-gold" />
            {t.admin}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-arch-800 transition-colors"
          >
            {t.close}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-arch-accent border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {users.map((user) => (
                <div key={user.id} className="bg-arch-800/50 border border-arch-700/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-arch-700 flex items-center justify-center text-gray-400">
                      <UserIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">{user.displayName || 'Unnamed User'}</h4>
                      <p className="text-sm text-gray-400 flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${user.role === 'admin' ? 'bg-arch-gold/20 text-arch-gold' : 'bg-blue-500/20 text-blue-400'}`}>
                      {user.role}
                    </span>
                    
                    <button
                      onClick={() => toggleApproval(user.id, user.isApproved)}
                      className={`flex-1 sm:flex-none flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        user.isApproved 
                        ? 'bg-green-500/10 text-green-500 border border-green-500/20 hover:bg-green-500/20' 
                        : 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20'
                      }`}
                    >
                      {user.isApproved ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      {user.isApproved ? (lang === 'en' ? 'Approved' : 'تمت الموافقة') : (lang === 'en' ? 'Pending' : 'قيد الانتظار')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
