import os
import re

files_to_migrate = [
    "src/features/plombier/screens/AdminAnnonces.tsx",
    "src/features/plombier/screens/AdminCategories.tsx",
    "src/features/plombier/screens/AdminDashboard.tsx",
    "src/features/plombier/screens/AdminGalleryEditor.tsx",
    "src/features/plombier/screens/AdminProfileScreen.tsx",
    "src/features/plombier/screens/AdminServicesEditor.tsx",
    "src/features/plombier/screens/AdminUsers.tsx",
    "src/features/plombier/screens/GalleryScreen.tsx",
    "src/features/plombier/screens/HomeScreen.tsx",
    "src/features/plombier/screens/LegalPages.tsx",
    "src/features/plombier/screens/MarketplaceScreen.tsx",
    "src/features/plombier/screens/ProfileScreen.tsx",
    "src/features/plombier/screens/ServicesScreen.tsx",
    "src/features/plombier/screens/WebAuthScreen.tsx",
    "src/features/plombier/screens/ZonesScreen.tsx",
    "src/navigation/AppNavigator.web.tsx",
    "src/navigation/WebAppNavigator.tsx",
    "src/navigation/webScreenMap.tsx"
]

base_path = "/Users/mohamedbenkhedher/Documents/GitHub/Plombier"

replacements = [
    (r'<div\b', '<View'),
    (r'</div>', '</View>'),
    (r'<span\b', '<Text'),
    (r'</span>', '</Text>'),
    (r'<p\b', '<Text'),
    (r'</p>', '</Text>'),
    (r'<h1\b', '<Text'),
    (r'</h1>', '</Text>'),
    (r'<h2\b', '<Text'),
    (r'</h2>', '</Text>'),
    (r'<h3\b', '<Text'),
    (r'</h3>', '</Text>'),
    (r'<h4\b', '<Text'),
    (r'</h4>', '</Text>'),
    (r'<h5\b', '<Text'),
    (r'</h5>', '</Text>'),
    (r'<h6\b', '<Text'),
    (r'</h6>', '</Text>'),
    (r'<button\b', '<TouchableOpacity'),
    (r'</button>', '</TouchableOpacity>'),
    (r'<input\b', '<TextInput'),
    (r'</input>', '</TextInput>'),
    (r'<textarea\b', '<TextInput multiline={true}'),
    (r'</textarea>', '</TextInput>'),
    (r'<label\b', '<Text'),
    (r'</label>', '</Text>'),
    (r'<a\b', '<TouchableOpacity'),
    (r'</a>', '</TouchableOpacity>'),
    (r'onClick={', 'onPress={'),
    (r'onClick\s*=\s*([\'"{])', r'onPress=\1')
]

react_native_components = ['View', 'Text', 'TouchableOpacity', 'TextInput']

for file_rel in files_to_migrate:
    file_path = os.path.join(base_path, file_rel)
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        continue
    
    print(f"Migrating: {file_rel}")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if any replacement applies
    modified_content = content
    for pattern, repl in replacements:
        modified_content = re.sub(pattern, repl, modified_content)
    
    if modified_content != content:
        # Check if we need to add react-native imports
        # Find if react-native is already imported
        rn_import_match = re.search(r"import\s+{[^}]+}\s+from\s+['\"]react-native['\"];?", modified_content)
        
        if rn_import_match:
            # We need to ensure View, Text, TouchableOpacity, TextInput are in the import list
            import_statement = rn_import_match.group(0)
            # Extract components
            components_match = re.search(r"{(.*)}", import_statement)
            if components_match:
                existing_components = [c.strip() for c in components_match.group(1).split(',')]
                for comp in react_native_components:
                    if comp not in existing_components:
                        existing_components.append(comp)
                new_import = f"import {{ {', '.join(existing_components)} }} from 'react-native';"
                modified_content = modified_content.replace(import_statement, new_import)
        else:
            # Add new import statement after React import or at the very beginning
            react_import_match = re.search(r"import\s+React\b[^;]*;", modified_content)
            new_import_stmt = "import { View, Text, TouchableOpacity, TextInput } from 'react-native';"
            if react_import_match:
                end_pos = react_import_match.end()
                modified_content = modified_content[:end_pos] + "\n" + new_import_stmt + modified_content[end_pos:]
            else:
                modified_content = new_import_stmt + "\n" + modified_content
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(modified_content)
        print(f"Successfully migrated {file_rel}")
    else:
        print(f"No changes needed for {file_rel}")
