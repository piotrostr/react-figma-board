export default async function loadComponents() {
  const context = import.meta.globEager("./components/**/*.@(jsx|tsx)");
  const components = [];

  for (const path in context) {
    const componentName = path.match(/\.\/components\/(.*).(jsx|tsx)$/)[1];
    const name = componentName.split("/").pop();
    const module = context[path];

    if (module[name] && module[name].$$typeof !== "Symbol(react.forward_ref)") {
      components.push({
        name: name,
        module: module[name],
      });
    }
  }

  return components;
}
