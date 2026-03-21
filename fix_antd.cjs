const fs = require('fs');
const files = [
  'resources/js/public/pages/SystemSettings/components/tabProgram.jsx',
  'resources/js/public/pages/SystemSettings/components/tabBranding.jsx',
  'resources/js/public/pages/Profile/viewProfileHeader.jsx',
  'resources/js/public/pages/Profile/viewEducationalBackground.jsx',
  'resources/js/public/pages/Profile/modalAccountSettings.jsx',
  'resources/js/public/pages/Profile/formPersonalInfo.jsx',
  'resources/js/public/pages/Profile/formEducationalBackground.jsx'
];

files.forEach(f => {
  if (!fs.existsSync(f)) return;
  let code = fs.readFileSync(f, 'utf8');
  code = code.replace(/\bmessage\s*,\s*/g, '');
  code = code.replace(/,\s*message\b/g, '');
  
  if (!code.includes(' App ') && !code.includes(' App,')) {
      code = code.replace(/import {([^}]+)} from 'antd';/, "import {$1, App } from 'antd';");
  }
  
  code = code.replace(/(export default function \w+\s*\([^)]*\)\s*\{)/, "$1\n    const { message } = App.useApp();");
  code = code.replace(/(const \w+\s*=\s*\([^)]*\)\s*=>\s*\{)/g, "$1\n    const { message } = App.useApp();");
  
  fs.writeFileSync(f, code);
});
console.log('Done');
