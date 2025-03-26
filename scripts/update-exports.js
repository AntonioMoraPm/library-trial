import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const packageJsonPath = path.resolve(__dirname, "../package.json");
const distPath = path.resolve(__dirname, "../dist/components");

function updateExports() {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));

  // Asegurar que "exports" existe
  if (!packageJson.exports) {
    packageJson.exports = {};
  }

  // Buscar todos los componentes en dist/components
  const components = fs.readdirSync(distPath).filter((file) =>
    fs.statSync(path.join(distPath, file)).isDirectory()
  );

  // Agregar automáticamente cada componente a "exports"
  components.forEach((component) => {
    packageJson.exports[`./components/${component}`] = {
      import: `./dist/components/${component}/index.js`,
      types: `./dist/components/${component}/index.d.ts`,
    };
  });

  // Guardar el archivo actualizado
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log("✅ package.json actualizado con exports dinámicos.");
}

// Ejecutar la función
updateExports();
