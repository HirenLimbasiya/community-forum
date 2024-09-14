// ReduxProvider.tsx
"use client";

import { Provider } from "react-redux";
import store from "./store/store";

const ReduxProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <Provider store={store}>{children}</Provider>;
};

export default ReduxProvider;
