// import React, { useState } from 'react';
// import { User, LogOut } from 'lucide-react';
// import { useAuth } from '../../contexts/AuthContext';

// export function UserMenu() {
//   const { user, logout } = useAuth();
//   const [isOpen, setIsOpen] = useState(false);

//   const handleLogout = async () => {
//     try {
//       await logout();
//       setIsOpen(false);
//     } catch (error) {
//       console.error('Logout failed:', error);
//     }
//   };

//   if (!user) return null;

//   return (
//     <div className="relative">
//       <button
//         onClick={() => setIsOpen(!isOpen)}
//         className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
//       >
//         <User className="w-5 h-5" />
//         <span>{user.id || '用户'}</span>
//       </button>

//       {isOpen && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
//           <button
//             onClick={handleLogout}
//             className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
//           >
//             <LogOut className="w-4 h-4" />
//             退出登录
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }