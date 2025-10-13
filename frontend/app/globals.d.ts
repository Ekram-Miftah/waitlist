// globals.d.ts
declare module "*.css" {
  // This line tells TypeScript that importing a .css file is okay
  // and treats it as a module without requiring specific type definitions.
  type IStyles = {
    [key: string]: string;
  };
  const styles: IStyles;
  export default styles;
}
