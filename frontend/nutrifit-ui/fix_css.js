const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const stylesPagesDir = path.join(srcDir, 'styles', 'pages');
const stylesComponentsDir = path.join(srcDir, 'styles', 'components');

fs.mkdirSync(stylesPagesDir, { recursive: true });
fs.mkdirSync(stylesComponentsDir, { recursive: true });

// Move files
const cssPages = ['Admin.css', 'Auth.css', 'Profile.css', 'Progress.css'];
cssPages.forEach(file => {
    const oldPath = path.join(srcDir, 'pages', file);
    const newPath = path.join(stylesPagesDir, file);
    if (fs.existsSync(oldPath)) fs.renameSync(oldPath, newPath, err => { if (err) console.error(err) });
});

const cssComponents = ['Navbar.css'];
cssComponents.forEach(file => {
    const oldPath = path.join(srcDir, 'components', file);
    const newPath = path.join(stylesComponentsDir, file);
    if (fs.existsSync(oldPath)) fs.renameSync(oldPath, newPath, err => { if (err) console.error(err) });
});

// Update pages imports
const pagesDir = path.join(srcDir, 'pages');
fs.readdirSync(pagesDir).forEach(file => {
    if (file.endsWith('.js')) {
        let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
        content = content.replace(/import\s+["']\.\/Admin\.css["'];/g, 'import "../styles/pages/Admin.css";');
        content = content.replace(/import\s+["']\.\/Auth\.css["'];/g, 'import "../styles/pages/Auth.css";');
        content = content.replace(/import\s+["']\.\/Profile\.css["'];/g, 'import "../styles/pages/Profile.css";');
        content = content.replace(/import\s+["']\.\/Progress\.css["'];/g, 'import "../styles/pages/Progress.css";');
        fs.writeFileSync(path.join(pagesDir, file), content);
    }
});

// Update components imports
const componentsDir = path.join(srcDir, 'components');
fs.readdirSync(componentsDir).forEach(file => {
    if (file.endsWith('.js')) {
        let content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
        if (file === 'Navbar.js' && !content.includes('Navbar.css')) {
            content = 'import "../styles/components/Navbar.css";\n' + content;
            fs.writeFileSync(path.join(componentsDir, file), content);
        }
    }
});
console.log("Done refactoring css files");
