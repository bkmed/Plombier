import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  addService,
  updateService,
  deleteService,
  selectServices,
  Service,
} from '../../../store/slices/servicesSlice';

const SERVICE_TRANSLATION_PREFIX = 'services_local.';

const AdminServicesEditor = () => {
  const { t: translate } = useTranslation();
  const dispatch = useDispatch();
  const services = useSelector(selectServices) as Service[];
  const [nameKey, setNameKey] = useState('plomberie_generale');
  const [icon, setIcon] = useState('plumbing');
  const [descKey, setDescKey] = useState('plomberie_desc_long');
  const [ptsKeys, setPtsKeys] = useState(
    'plomberie_desc_1,plomberie_desc_2,plomberie_desc_3',
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const translateServiceField = (key?: string) => {
    const trimmedKey = key?.trim();
    if (!trimmedKey) return '';

    const namespacedKey = trimmedKey.startsWith(SERVICE_TRANSLATION_PREFIX)
      ? trimmedKey
      : `${SERVICE_TRANSLATION_PREFIX}${trimmedKey}`;

    return translate(namespacedKey, {
      defaultValue: translate(trimmedKey, { defaultValue: trimmedKey }),
    });
  };

  const reset = ({ clearStatus = true }: { clearStatus?: boolean } = {}) => {
    setNameKey('plomberie_generale');
    setIcon('plumbing');
    setDescKey('plomberie_desc_long');
    setPtsKeys('plomberie_desc_1,plomberie_desc_2,plomberie_desc_3');
    setEditingId(null);
    if (clearStatus) {
      setStatusMessage(null);
    }
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawName = nameKey.trim();
    const normalizedName = rawName.startsWith(SERVICE_TRANSLATION_PREFIX)
      ? rawName
      : `${SERVICE_TRANSLATION_PREFIX}${rawName}`;

    const payload: Service = {
      id:
        editingId || `srv-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
      name: normalizedName,
      icon: icon.trim(),
      desc: descKey.trim(),
      pts: ptsKeys
        .split(',')
        .map(s => s.trim())
        .filter(Boolean),
      whatsappText: 'devis_msg',
      createdAt:
        services.find(service => service.id === editingId)?.createdAt ||
        new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (editingId) {
      dispatch(updateService(payload));
      setStatusMessage(
        translate('admin.serviceUpdated', {
          defaultValue: 'Service mis à jour.',
        }),
      );
    } else {
      dispatch(addService(payload));
      setStatusMessage(
        translate('admin.serviceAdded', { defaultValue: 'Service ajouté.' }),
      );
    }
    reset({ clearStatus: false });
  };

  const handleEdit = (s: Service) => {
    setEditingId(s.id);
    setNameKey(s.name);
    setIcon(s.icon);
    setDescKey(s.desc || '');
    setPtsKeys((s.pts || []).join(','));
    setStatusMessage(null);
    setShowModal(true);
  };

  const handleDeleteClick = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (!serviceToDelete) return;
    dispatch(deleteService(serviceToDelete.id));
    setStatusMessage(
      translate('admin.serviceDeleted', { defaultValue: 'Service supprimé.' }),
    );
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setServiceToDelete(null);
  };

  return (
    <View className="space-y-8">
      <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <View className="flex items-center justify-between mb-6">
          <View>
            <Text className="font-black text-3xl">
              {translate('admin.servicesTitle', {
                defaultValue: 'Gérer les services',
              })}
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              {translate('admin.servicesDescription', {
                defaultValue:
                  'Ajoutez, modifiez ou supprimez les services disponibles aux utilisateurs.',
              })}
            </Text>
          </View>
        </View>

        {statusMessage && (
          <View className="mt-6 text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-3xl px-4 py-3 text-sm">
            {statusMessage}
          </View>
        )}

        <View className="flex items-center justify-end mt-6">
          <TouchableOpacity
            onPress={() => {
              reset();
              setShowModal(true);
            }}
            className="bg-[#F97316] text-white px-4 py-2 rounded-2xl font-black hover:bg-[#e0630b] transition"
          >
            {translate('admin.addServiceButton', {
              defaultValue: '+ Ajouter un service',
            })}
          </TouchableOpacity>
        </View>
      </View>

      <View className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <Text className="text-xl font-black mb-4">
          {translate('admin.servicesListTitle', {
            defaultValue: 'Liste des services',
          })}
        </Text>
        {services.length === 0 ? (
          <View>
            {translate('admin.noServices', {
              defaultValue: 'Aucun service défini.',
            })}
          </View>
        ) : (
          <View className="space-y-4">
            {services.map(s => (
              <View
                key={s.id}
                className="flex items-center justify-between border p-3 rounded-2xl"
              >
                <View>
                  <View className="font-black">
                    {translateServiceField(s.name)}
                  </View>
                  <Text className="text-sm text-slate-500">
                    {translateServiceField(s.desc)}
                  </Text>
                </View>
                <View className="flex flex-row gap-2">
                  <TouchableOpacity
                    onPress={() => handleEdit(s)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-xl"
                  >
                    <Text className="text-white text-xs">
                      {translate('admin.editButton', {
                        defaultValue: 'Modifier',
                      })}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteClick(s)}
                    className="px-3 py-1 bg-rose-600 text-white rounded-xl"
                  >
                    <Text className="text-white text-xs">
                      {translate('admin.deleteButton', {
                        defaultValue: 'Supprimer',
                      })}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      {showDeleteConfirm && serviceToDelete && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-sm w-full shadow-2xl p-6 text-center space-y-6">
            <View>
              <Text className="text-xl font-black text-slate-900 dark:text-white">
                {translate('admin.confirmDelete', {
                  defaultValue: 'Confirmer la suppression',
                })}
              </Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {translate('admin.confirmDeleteService', {
                  defaultValue:
                    'Êtes-vous sûr de vouloir supprimer ce service ? Cette action est irréversible.',
                })}
              </Text>
            </View>
            <View className="flex flex-row gap-3">
              <TouchableOpacity
                onPress={cancelDelete}
                className="flex-1 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl px-4 py-3 font-black hover:bg-slate-300 dark:hover:bg-slate-600 transition"
              >
                <Text className="text-center font-bold">
                  {translate('admin.cancelButton', {
                    defaultValue: 'Annuler',
                  })}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmDelete}
                className="flex-1 bg-rose-600 text-white rounded-xl px-4 py-3 font-black hover:bg-rose-700 transition"
              >
                <Text className="text-white text-center font-bold">
                  {translate('admin.deleteButton', {
                    defaultValue: 'Supprimer',
                  })}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {showModal && (
        <View className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <View className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-3xl w-full shadow-2xl overflow-hidden relative">
            <TouchableOpacity
              onPress={() => {
                setShowModal(false);
                reset();
              }}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              <Text>✕</Text>
            </TouchableOpacity>

            <View className="p-6 sm:p-8 space-y-6">
              <Text className="text-xl font-black text-slate-800 dark:text-white">
                {editingId
                  ? translate('admin.editServiceTitle', {
                      defaultValue: 'Modifier le service',
                    })
                  : translate('admin.addServiceTitle', {
                      defaultValue: 'Ajouter un service',
                    })}
              </Text>

              <View className="grid gap-4 mt-2 md:grid-cols-2">
                <TextInput
                  value={nameKey}
                  onChangeText={setNameKey}
                  placeholder={translate('admin.placeholder.nameKey', {
                    defaultValue: 'clé nom (ex: plomberie_generale)',
                  })}
                  className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
                <TextInput
                  value={icon}
                  onChangeText={setIcon}
                  placeholder={translate('admin.placeholder.icon', {
                    defaultValue: 'icone (plumbing|ac|gas|heater)',
                  })}
                  className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
                <TextInput
                  value={descKey}
                  onChangeText={setDescKey}
                  placeholder={translate('admin.placeholder.descKey', {
                    defaultValue: 'clé description (ex: plomberie_desc_long)',
                  })}
                  className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />
                <TextInput
                  value={ptsKeys}
                  onChangeText={setPtsKeys}
                  placeholder={translate('admin.placeholder.ptsKeys', {
                    defaultValue: 'clés bullets séparées par ,',
                  })}
                  className="w-full px-4 py-3 rounded-3xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#F97316]"
                />

                <View className="flex flex-row gap-3 items-center justify-end md:col-span-2 pt-4">
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      reset();
                    }}
                    className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-200 text-xs font-black px-5 py-3 rounded-xl transition"
                  >
                    {translate('admin.cancelButton', {
                      defaultValue: 'Annuler',
                    })}
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleSubmit({} as any)}
                    className="bg-[#F97316] text-white px-4 py-2 rounded-2xl"
                  >
                    {editingId
                      ? translate('admin.saveButton', {
                          defaultValue: 'Enregistrer',
                        })
                      : translate('admin.addServiceModalButton', {
                          defaultValue: '+ Ajouter le service',
                        })}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default AdminServicesEditor;
