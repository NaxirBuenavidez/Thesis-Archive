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
  
  // Safely remove 'message' only from antd import
  let importRx = /import\s+\{([^}]+)\}\s+from\s+['"]antd['"]/;
  let m = code.match(importRx);
  if (m && m[1].includes('message')) {
      let newImports = m[1].split(',').map(s=>s.trim()).filter(s=>s!=='message' && s!=='');
      if (!newImports.includes('App')) newImports.push('App');
      code = code.replace(importRx, `import { ${newImports.join(', ')} } from 'antd'`);
  }
  
  // Inject exactly once at the first component definition
  if (!code.includes('App.useApp()')) {
      if (code.includes('export default function')) {
          code = code.replace(/(export default function \w+\s*\([^)]*\)\s*\{)/, "$1\n    const { message } = App.useApp();");
      } else {
          code = code.replace(/(const \w+\s*=\s*\([^)]*\)\s*=>\s*\{(?!\s*return))/, "$1\n    const { message } = App.useApp();");
      }
  }

  fs.writeFileSync(f, code);
  console.log('Fixed Safely:', f);
});
