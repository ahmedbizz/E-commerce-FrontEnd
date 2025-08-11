import React, { useEffect, useState } from "react";
import AppRouter from './routes/AppRouter';
import Cookies from "js-cookie";
import './styles/global.css';
import i18n from './utils/i18n'; 

function App() {
  const [language, setLanguage] = useState(Cookies.get("language") || "1");
  const [direction, setDirection] = useState("");

  useEffect(() => {
    if (language === '0') {
      setDirection("rtl");
      i18n.changeLanguage("ar");
    } else {
      setDirection("ltr");
      i18n.changeLanguage("en");
    }
    // وأيضا يحدث الكوكيز هنا لضمان التزامن
    Cookies.set("language", language, { expires: 7, secure: true });
  }, [language]);

  return (
    <div dir={direction}>
      <AppRouter setLanguage={setLanguage} />
    </div>
  );
}


export default App;
