import os
import re

files_to_check = [
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
    "src/navigation/webScreenMap.tsx",
    "src/features/plombier/components/WebSplashScreen.tsx"
]

base_path = "/Users/mohamedbenkhedher/Documents/GitHub/Plombier"
components_to_check = ['View', 'Text', 'TouchableOpacity', 'TextInput', 'Platform']

for file_rel in files_to_check:
    file_path = os.path.join(base_path, file_rel)
    if not os.path.exists(file_path):
        continue
        
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # Find react-native import statement
    rn_import_match = re.search(r"import\s+({[^}]+})\s+from\s+['\"]react-native['\"];?", content)
    if not rn_import_match:
        continue
        
    import_stmt = rn_import_match.group(0)
    imported_list_str = rn_import_match.group(1)
    imported_components = [c.strip() for c in imported_list_str.replace('{', '').replace('}', '').split(',')]
    
    # Strip the import statement from the code content to check usages in the rest of the file
    content_without_import = content.replace(import_stmt, "")
    
    used_components = []
    for comp in imported_components:
        # Check if the component is used as a JSX tag (e.g. <View or </View>) or referenced in code (e.g. Platform.OS)
        # Using a word-boundary match for general code reference
        pattern = rf"\b{comp}\b"
        if re.search(pattern, content_without_import):
            used_components.append(comp)
            
    if len(used_components) != len(imported_components):
        if used_components:
            new_import_stmt = f"import {{ {', '.join(used_components)} }} from 'react-native';"
            new_content = content.replace(import_stmt, new_import_stmt)
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated imports for {file_rel}: {used_components}")
        else:
            new_content = content.replace(import_stmt, "")
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Removed unused react-native import from {file_rel}")
