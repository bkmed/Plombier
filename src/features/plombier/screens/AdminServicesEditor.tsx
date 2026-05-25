import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addService,
  updateService,
  deleteService,
  selectServices,
  Service,
} from '../../../store/slices/servicesSlice';
import { RootState } from '../../../store';

const AdminServicesEditor = () => {
  const dispatch = useDispatch();
  const services = useSelector((state: RootState) =>
    selectServices(state),
  ) as Service[];
  const [nameKey, setNameKey] = useState('plomberie_generale');
  const [icon, setIcon] = useState('plumbing');
  const [descKey, setDescKey] = useState('plomberie_desc_long');
  const [ptsKeys, setPtsKeys] = useState(
    'plomberie_desc_1,plomberie_desc_2,plomberie_desc_3',
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const reset = () => {
    setNameKey('plomberie_generale');
    setIcon('plumbing');
    setDescKey('plomberie_desc_long');
    setPtsKeys('plomberie_desc_1,plomberie_desc_2,plomberie_desc_3');
    setEditingId(null);
    setStatusMessage(null);
    setShowModal(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Service = {
      id: editingId || `srv-${Date.now()}`,
      name: nameKey,
      icon,
      desc: descKey,
      pts: ptsKeys.split(',').map(s => s.trim()),
      whatsappText: 'devis_msg',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (editingId) {
      dispatch(updateService(payload));
      setStatusMessage('Service mis à jour.');
    } else {
      dispatch(addService(payload));
      setStatusMessage('Service ajouté.');
    }
    reset();
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

  const handleDelete = (id: string) => {
    dispatch(deleteService(id));
    setStatusMessage('Service supprimé.');
  };

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-black text-3xl">Gérer les services</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Ajoutez, modifiez ou supprimez les services disponibles aux
              utilisateurs.
            </p>
          </div>
        </div>

        {statusMessage && (
          <div className="mt-6 text-emerald-700 bg-emerald-100 border border-emerald-200 rounded-3xl px-4 py-3 text-sm">
            {statusMessage}
          </div>
        )}

        <div className="flex items-center justify-end mt-6">
          <button
            type="button"
            onClick={() => {
              reset();
              setShowModal(true);
            }}
            className="bg-[#F97316] text-white px-4 py-2 rounded-2xl font-black hover:bg-[#e0630b] transition"
          >
            + Ajouter un service
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-sm">
        <h4 className="text-xl font-black mb-4">Liste des services</h4>
        {services.length === 0 ? (
          <div>Aucun service défini.</div>
        ) : (
          <div className="space-y-4">
            {services.map(s => (
              <div
                key={s.id}
                className="flex items-center justify-between border p-3 rounded-2xl"
              >
                <div>
                  <div className="font-black">{s.name}</div>
                  <div className="text-sm text-slate-500">{s.desc}</div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-xl"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="px-3 py-1 bg-rose-600 text-white rounded-xl"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in text-left">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[28px] max-w-3xl w-full shadow-2xl overflow-hidden relative">
            <button
              type="button"
              onClick={() => {
                setShowModal(false);
                reset();
              }}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-750 text-slate-500 hover:text-slate-850 dark:hover:text-slate-100 flex items-center justify-center font-bold"
            >
              ✕
            </button>

            <div className="p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-black text-slate-850 dark:text-white">
                {editingId ? 'Modifier le service' : 'Ajouter un service'}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid gap-4 mt-2 md:grid-cols-2"
              >
                <input
                  value={nameKey}
                  onChange={e => setNameKey(e.target.value)}
                  placeholder="clé nom (ex: plomberie_generale)"
                  className="w-full px-4 py-3 rounded-3xl border"
                />
                <input
                  value={icon}
                  onChange={e => setIcon(e.target.value)}
                  placeholder="icone (plumbing|ac|gas|heater)"
                  className="w-full px-4 py-3 rounded-3xl border"
                />
                <input
                  value={descKey}
                  onChange={e => setDescKey(e.target.value)}
                  placeholder="clé description (ex: plomberie_desc_long)"
                  className="w-full px-4 py-3 rounded-3xl border"
                />
                <input
                  value={ptsKeys}
                  onChange={e => setPtsKeys(e.target.value)}
                  placeholder="clés bullets séparées par ,"
                  className="w-full px-4 py-3 rounded-3xl border"
                />

                <div className="flex gap-3 items-center justify-end md:col-span-2 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      reset();
                    }}
                    className="bg-slate-200 px-4 py-2 rounded-2xl"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="bg-[#F97316] text-white px-4 py-2 rounded-2xl"
                  >
                    {editingId ? 'Enregistrer' : '+ Ajouter le service'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServicesEditor;
