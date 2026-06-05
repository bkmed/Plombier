import json
import os

locales_dir = '/Users/mohamedbenkhedher/Documents/GitHub/Plombier/src/i18n/locales'

translations = {
    'fr': {
        'categories': {
            'robinetterie': 'Robinetterie',
            'chauffe_eau': 'Chauffe-eau',
            'canalisation': 'Canalisation',
            'climatisation': 'Climatisation',
            'radiateurs': 'Radiateurs',
            'vannes': 'Vannes',
            'autre': 'Autre'
        },
        'web': {
            'conditions': {
                'comme_neuf': 'Comme neuf',
                'bon_etat': 'Bon état',
                'pour_pieces': 'Pour pièces'
            }
        }
    },
    'en': {
        'categories': {
            'robinetterie': 'Faucets',
            'chauffe_eau': 'Water Heaters',
            'canalisation': 'Piping',
            'climatisation': 'Air Conditioning',
            'radiateurs': 'Radiators',
            'vannes': 'Valves',
            'autre': 'Other'
        },
        'web': {
            'conditions': {
                'comme_neuf': 'Like new',
                'bon_etat': 'Good condition',
                'pour_pieces': 'For parts'
            }
        }
    },
    'ar': {
        'categories': {
            'robinetterie': 'الحنفيات',
            'chauffe_eau': 'سخانات المياه',
            'canalisation': 'الأنابيب',
            'climatisation': 'تكييف الهواء',
            'radiateurs': 'المبردات',
            'vannes': 'الصمامات',
            'autre': 'أخرى'
        },
        'web': {
            'conditions': {
                'comme_neuf': 'كالجديد',
                'bon_etat': 'حالة جيدة',
                'pour_pieces': 'قطع غيار'
            }
        }
    }
}

def deep_update(d, u):
    for k, v in u.items():
        if isinstance(v, dict):
            d[k] = deep_update(d.get(k, {}), v)
        else:
            d[k] = v
    return d

for lang, data in translations.items():
    file_path = os.path.join(locales_dir, f'{lang}.json')
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        content = deep_update(content, data)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(content, f, ensure_ascii=False, indent=2)
        print(f"Updated {lang}.json")

