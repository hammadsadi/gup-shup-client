import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";
import { LoadingOverlay } from "./pages/LoadingOverlay/LoadingOverlay";

const HomePage = () => {
  return (
    <div>
      <Provider store={store}>
        <PersistGate loading={<LoadingOverlay />} persistor={persistor}>
          <RouterProvider router={routes} />
        </PersistGate>
        <Toaster richColors position="top-center" />
      </Provider>
    </div>
  );
};

export default HomePage;
