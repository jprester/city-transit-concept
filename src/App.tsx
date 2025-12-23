import Map from "./components/Map";
import { LanguageProvider } from "./i18n/LanguageContext";

function App() {
  return (
    <LanguageProvider>
      <Map />
    </LanguageProvider>
  );
}

export default App
