import React, { useEffect, useState } from "react";
import AppRouter from './routes/AppRouter';
import Cookies from "js-cookie";
import './styles/global.css';
import i18n from './utils/i18n'; 

function App() {

  const language = Cookies.get("language");

  const [direction, setDirection] = useState("ltr");

  useEffect(() => {
    if (language === '0') {
      setDirection("rtl");
      i18n.changeLanguage("ar");
    } else {
      setDirection("ltr");
      i18n.changeLanguage("en");
    }
  }, [i18n, language]);

  return (
    <div dir={direction}>
      <AppRouter />
    </div>
  );
}

export default App;
