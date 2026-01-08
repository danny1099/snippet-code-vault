import { GTProvider } from "gt-next";

export const I18nProvider = ({ children }: Children) => {
  return <GTProvider>{children}</GTProvider>;
};
