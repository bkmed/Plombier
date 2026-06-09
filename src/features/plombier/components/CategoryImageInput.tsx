import React, { useRef } from 'react';
import { Platform, View, Image, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';

interface Props {
  imageUri?: string | null;
  onImageSelected: (uri: string | null) => void;
  accept?: string;
}

const CategoryImageInput = ({
  imageUri,
  onImageSelected,
  accept = 'image/*',
}: Props) => {
  const { t } = useTranslation();
  const tCommon = (key: string) => t(key, { defaultValue: key });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return onImageSelected(null);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      onImageSelected(result);
    };
    reader.readAsDataURL(file);
  };

  const handleChooseImage = () => {
    if (Platform.OS === 'web') {
      inputRef.current?.click();
      return;
    }

    alert(tCommon('categoryImageInput.unavailableMobile'));
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {Platform.OS === 'web' && (
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      )}

      <TouchableOpacity
        onPress={handleChooseImage}
        style={{
          paddingHorizontal: 14,
          paddingVertical: 12,
          backgroundColor: '#e5e7eb',
          borderRadius: 12,
          marginRight: 12,
          minWidth: 140,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text className="text-slate-900 dark:text-slate-100 font-semibold text-xs uppercase tracking-wider">
          {tCommon('categoryImageInput.chooseImage')}
        </Text>
      </TouchableOpacity>

      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            resizeMode: 'cover',
          }}
        />
      ) : (
        <View
          style={{
            width: 64,
            height: 64,
            backgroundColor: '#f3f4f6',
            borderRadius: 8,
          }}
        />
      )}
    </View>
  );
};

export default CategoryImageInput;
