import { StrictMode } from "react";
import ReactDOM from "react-dom";

import CarbonProvider from "carbon-react/lib/components/carbon-provider";
import sageTheme from "carbon-react/lib/style/themes/sage";
import GlobalStyle from "carbon-react/lib/style/global-style";
import "carbon-react/lib/style/fonts.css";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    {/* <GlobalStyle /> */}
    <CarbonProvider theme={sageTheme} validationRedesignOptIn>
      <App />
    </CarbonProvider>
  </StrictMode>,
  rootElement
);
