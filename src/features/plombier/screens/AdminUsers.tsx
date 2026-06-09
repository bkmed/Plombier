import React from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../store';
import { updateUser, deleteUser } from '../../../store/slices/usersSlice';
import { setActiveTab } from '../../../store/slices/uiSlice';

interface AdminUsersProps {
  showToast: any;
  t: any;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ showToast, t }) => {
  const tCommon = (key: string, defaultValue: string) =>
    t(key, { defaultValue });
  const dispatch = useDispatch();
  const usersList = useSelector((state: RootState) => state.users?.items ?? []);
  const sessionUser = useSelector(
    (state: RootState) => (state as any).webSession?.sessionUser,
  );
  const [editingUser, setEditingUser] = React.useState<any | null>(null);
  const [editUserName, setEditUserName] = React.useState('');
  const [editUserEmail, setEditUserEmail] = React.useState('');
  const [editUserPhone, setEditUserPhone] = React.useState('');
  const [editUserRole, setEditUserRole] = React.useState<'admin' | 'user'>(
    'user',
  );
  const [userToDelete, setUserToDelete] = React.useState<any | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleStartEditUser = (user: any) => {
    setEditingUser(user);
    setEditUserName(user.name);
    setEditUserEmail(user.email);
    setEditUserPhone(user.phone || '');
    setEditUserRole(user.role === 'admin' ? 'admin' : 'user');
  };

  const handleCancelEditUser = () => {
    setEditingUser(null);
  };

  const handleSaveUserEdit = (e: React.FormEvent) => {
    if (e?.preventDefault) e.preventDefault();
    if (!editingUser) return;

    const updatedUser = {
      ...editingUser,
      name: editUserName.trim(),
      email: editUserEmail.trim().toLowerCase(),
      phone: editUserPhone.trim() || undefined,
      role: editUserRole,
      updatedAt: new Date().toISOString(),
    };

    dispatch(updateUser(updatedUser));
    showToast(
      tCommon('adminUsers.userUpdated', 'Utilisateur mis à jour avec succès !'),
      'success',
    );
    setEditingUser(null);
  };

  const handleDeleteUserClick = (userId: string, role: string) => {
    if (role === 'admin') return;
    const user = usersList.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
      setShowDeleteConfirm(true);
    }
  };

  const confirmDeleteUser = () => {
    if (!userToDelete) return;
    if (editingUser?.id === userToDelete.id) {
      setEditingUser(null);
    }
    dispatch(deleteUser(userToDelete.id));
    showToast(
      tCommon('adminUsers.userDeleted', 'Utilisateur supprimé !'),
      'info',
    );
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const cancelDeleteUser = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  const handleToggleUserRole = (userId: string, currentVal: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    const updated = {
      ...target,
      role: currentVal === 'admin' ? 'user' : 'admin',
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUser(updated));
    showToast(
      tCommon('adminUsers.roleUpdated', "Rôle de l'utilisateur modifié !"),
      'success',
    );
  };

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const target = usersList.find(u => u.id === userId);
    if (!target) return;

    if (
      sessionUser &&
      target.email.toLowerCase() === sessionUser.email.toLowerCase()
    ) {
      showToast(
        tCommon(
          'adminUsers.cannotBlockSelf',
          'Impossible de bloquer votre propre compte admin !',
        ),
        'error',
      );
      return;
    }

    const newStatus = (currentStatus === 'active' ? 'rejected' : 'active') as
      | 'active'
      | 'rejected';
    const updated: any = {
      ...target,
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    dispatch(updateUser(updated));
    showToast(
      tCommon(
        currentStatus === 'active'
          ? 'adminUsers.userBlocked'
          : 'adminUsers.userReactivated',
        currentStatus === 'active'
          ? 'Utilisateur bloqué avec succès !'
          : 'Compte réactivé !',
      ),
      'info',
    );
  };

  return (
    <View className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 animate-fade-in text-left">
      <TouchableOpacity
        onPress={() => dispatch(setActiveTab('AdminManage'))}
        className="mb-6 bg-slate-200 dark:bg-slate-700 px-4 py-2 rounded-xl self-start"
        style={{ alignSelf: 'flex-start' }}
      >
        <Text className="text-xs font-black text-slate-600 dark:text-slate-200">
          {tCommon('adminUsers.backToManage', '← Retour à Manage')}
        </Text>
      </TouchableOpacity>

      <Text className="text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">
        {tCommon('adminUsers.title', 'Gestion des Comptes Membres')}
      </Text>
      <Text className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-1 font-semibold">
        {tCommon(
          'adminUsers.description',
          'Visualisez la liste des inscrits, modifiez les rôles ou désactivez temporairement des accès.',
        )}
      </Text>

      {editingUser && (
        <View className="mt-8 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm">
          <View className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-slate-100">
                {tCommon('adminUsers.editUserTitle', 'Modifier un utilisateur')}
              </Text>
              <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {tCommon(
                  'adminUsers.editUserDescription',
                  'Mettez à jour les informations utilisateur puis enregistrez.',
                )}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCancelEditUser}
              className="text-slate-655 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-2xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition"
            >
              {tCommon('adminUsers.cancel', 'Annuler')}
            </TouchableOpacity>
          </View>

          <View className="grid gap-4 mt-6 md:grid-cols-2">
            <TextInput
              value={editUserName}
              onChangeText={setEditUserName}
              placeholder={tCommon(
                'adminUsers.fullNamePlaceholder',
                'Nom complet',
              )}
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <TextInput
              keyboardType="email-address"
              value={editUserEmail}
              onChangeText={setEditUserEmail}
              placeholder="Email"
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <TextInput
              value={editUserPhone}
              onChangeText={setEditUserPhone}
              placeholder={tCommon('adminUsers.phonePlaceholder', 'Téléphone')}
              className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            />

            <View className="flex flex-row gap-2">
              {(['admin', 'user'] as const).map(role => (
                <TouchableOpacity
                  key={role}
                  onPress={() => setEditUserRole(role)}
                  className={`flex-1 py-3 px-4 rounded-3xl border text-center ${
                    editUserRole === role
                      ? 'bg-[#F97316] border-[#F97316]'
                      : 'bg-white dark:bg-slate-950 border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      editUserRole === role
                        ? 'text-white'
                        : 'text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    {role === 'user'
                      ? tCommon('adminUsers.roleUser', 'Utilisateur')
                      : tCommon('adminUsers.roleAdmin', 'Administrateur')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="md:col-span-2 flex justify-end gap-3">
              <TouchableOpacity
                onPress={() => handleSaveUserEdit({} as any)}
                className="bg-[#F97316] text-white px-6 py-3 rounded-3xl font-black hover:bg-[#e0630b] transition"
              >
                {tCommon('adminUsers.saveChanges', 'Enregistrer')}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Users list */}
      <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm overflow-hidden mt-8">
        {/* Header row */}
        <View className="flex-row bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <View style={{ flex: 1.5 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-widest text-slate-400">
              {tCommon('adminUsers.tableFullName', 'Nom complet')}
            </Text>
          </View>
          <View style={{ flex: 2 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-widest text-slate-400">
              {tCommon('adminUsers.tableEmail', 'Adresse Email')}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-widest text-slate-400">
              {tCommon('adminUsers.tablePhone', 'Téléphone')}
            </Text>
          </View>
          <View style={{ flex: 0.8 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-widest text-slate-400">
              {tCommon('adminUsers.tableRole', 'Rôle')}
            </Text>
          </View>
          <View style={{ flex: 0.8 }}>
            <Text className="text-[9.5px] font-black uppercase tracking-widest text-slate-400">
              {tCommon('adminUsers.tableStatus', 'Statut')}
            </Text>
          </View>
          <View style={{ flex: 2, alignItems: 'center' }}>
            <Text className="text-[9.5px] font-black uppercase tracking-widest text-slate-400">
              {tCommon('adminUsers.tableActions', 'Actions')}
            </Text>
          </View>
        </View>
        {/* Data rows */}
        {usersList.map(u => (
          <View
            key={u.id}
            className="flex-row items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700"
          >
            <View style={{ flex: 1.5 }}>
              <Text className="text-xs font-black text-slate-800 dark:text-slate-100">
                {u.name}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {u.email}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text className="text-xs text-slate-700 dark:text-slate-200">
                {u.phone || 'N/A'}
              </Text>
            </View>
            <View style={{ flex: 0.8 }}>
              <Text
                className={`px-2.5 py-1 rounded text-[9.5px] font-black uppercase ${
                  u.role === 'admin'
                    ? 'bg-amber-100 text-amber-700'
                    : 'bg-blue-100 text-blue-700'
                }`}
              >
                {u.role}
              </Text>
            </View>
            <View style={{ flex: 0.8 }}>
              <Text
                className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase ${
                  u.status === 'active'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {u.status}
              </Text>
            </View>
            <View style={{ flex: 2 }}>
              <View className="flex flex-wrap justify-center gap-1">
                <TouchableOpacity
                  onPress={() => handleStartEditUser(u)}
                  className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded transition"
                >
                  <Text className="text-slate-700 dark:text-white text-xs">
                    {tCommon('adminUsers.btnEdit', 'Modifier')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteUserClick(u.id, u.role)}
                  disabled={u.role === 'admin'}
                  className={`px-2.5 py-1 rounded font-black transition ${
                    u.role === 'admin'
                      ? 'bg-slate-200 dark:bg-slate-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  <Text
                    className={`text-xs font-black ${
                      u.role === 'admin' ? 'text-slate-400' : 'text-white'
                    }`}
                  >
                    {u.role === 'admin'
                      ? tCommon('adminUsers.protectedAdmin', 'Admin protégé')
                      : tCommon('adminUsers.delete', 'Supprimer')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleUserRole(u.id, u.role)}
                  className="bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded transition"
                >
                  <Text className="text-slate-700 dark:text-white text-xs">
                    {u.role === 'admin'
                      ? tCommon('adminUsers.btnDemote', 'Rétrograder')
                      : tCommon('adminUsers.btnPromote', 'Promouvoir')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleToggleUserStatus(u.id, u.status)}
                  className={`px-2.5 py-1 rounded text-white transition font-black ${
                    u.status === 'active'
                      ? 'bg-rose-600 hover:bg-rose-700'
                      : 'bg-emerald-600 hover:bg-emerald-700'
                  }`}
                >
                  <Text className="text-white text-xs font-black">
                    {u.status === 'active'
                      ? tCommon('adminUsers.btnBlock', 'Bloquer')
                      : tCommon('adminUsers.btnActivate', 'Activer')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      {showDeleteConfirm && userToDelete && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                {tCommon('admin.confirmDelete', 'Confirmer la suppression')}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {tCommon(
                  'adminUsers.confirmDeleteUser',
                  'Voulez-vous supprimer définitivement cet utilisateur ?',
                )}
              </Text>
            </View>
            <View className="flex gap-3">
              <TouchableOpacity
                onPress={cancelDeleteUser}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                {tCommon('admin.cancelButton', 'Annuler')}
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDeleteUser}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                {tCommon('adminUsers.delete', 'Supprimer')}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};
export default AdminUsers;
