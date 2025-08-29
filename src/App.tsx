import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';
import {DataProvider} from "./components/modules/DataContext.tsx";

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <div className="min-h-screen bg-gray-50">
          <Dashboard />
        </div>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;