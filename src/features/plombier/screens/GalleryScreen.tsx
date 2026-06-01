import React from 'react';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import {
  selectGalleryItems,
  GalleryItem,
} from '../../../store/slices/gallerySlice';

const GalleryScreen = () => {
  const items = useSelector(selectGalleryItems) as GalleryItem[];

  return (
    <View className="p-4 sm:p-6 lg:p-8">
      <View className="max-w-4xl mx-auto mb-10 text-center">
        <Text className="text-xs font-black uppercase tracking-[0.25em] text-[#F97316]">
          Galerie Réalisations
        </Text>
        <Text className="mt-4 text-4xl sm:text-5xl font-black text-slate-900 dark:text-slate-100">
          Photos réelles des interventions
        </Text>
        <Text className="mt-4 text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Retrouvez ici les dernières réalisations ajoutées par
          l'administrateur, avec titre, sous-titre et description pour chaque
          projet.
        </Text>
      </View>

      {items.length === 0 ? (
        <View className="max-w-2xl mx-auto rounded-3xl border border-dashed border-slate-300 bg-slate-50 dark:bg-slate-900 p-10 text-center text-slate-500 dark:text-slate-400">
          Aucune photo disponible pour le moment. Revenez bientôt pour découvrir
          nos réalisations récentes.
        </View>
      ) : (
        <View className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item: GalleryItem) => (
            <View
              key={item.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <View className="h-56 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={item.imageUri}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </View>
              <View className="p-5">
                <View className="font-black text-lg text-slate-900 dark:text-slate-100">
                  {item.title}
                </View>
                {item.subtitle && (
                  <View className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                    {item.subtitle}
                  </View>
                )}
                {item.description && (
                  <View className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {item.description}
                  </View>
                )}
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

export default GalleryScreen;
