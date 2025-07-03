import { RouterProvider } from "react-router-dom";
import routes from "./routes/routes";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { Toaster } from "sonner";

const HomePage = () => {
  return (
    <div>
      <Provider store={store}>
        <RouterProvider router={routes} />
        <Toaster richColors position="top-center" />
      </Provider>
    </div>
  );
};

export default HomePage;
