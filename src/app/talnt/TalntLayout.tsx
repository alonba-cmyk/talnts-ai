import { Outlet } from 'react-router-dom';
import { TalntAuthProvider } from './TalntAuthContext';
import { AgentSearchProvider } from './AgentSearchContext';
import { AgentWizardProvider } from './AgentWizardContext';
import { AgentChatProvider } from './AgentChatContext';
import { TalntThemeProvider, useTalntTheme } from './TalntThemeContext';
import TalntNavbar from '../components/talnt/TalntNavbar';
import TalntFooter from '../components/talnt/TalntFooter';
import AgentSearchOverlay from '../components/talnt/AgentSearchOverlay';
import AgentMatchWizard from '../components/talnt/AgentMatchWizard';
import AgentChatDrawer from '../components/talnt/AgentChatDrawer';

function TalntLayoutInner() {
  const { tokens } = useTalntTheme();
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: tokens.bgPage, fontFamily: 'Figtree, sans-serif', transition: 'background 0.3s' }}
    >
      <TalntNavbar />
      <main className="flex-1 pt-16">
        <Outlet />
      </main>
      <TalntFooter />
      <AgentSearchOverlay />
      <AgentMatchWizard />
      <AgentChatDrawer />
    </div>
  );
}

export default function TalntLayout() {
  return (
    <TalntThemeProvider>
      <TalntAuthProvider>
        <AgentSearchProvider>
          <AgentWizardProvider>
            <AgentChatProvider>
              <TalntLayoutInner />
            </AgentChatProvider>
          </AgentWizardProvider>
        </AgentSearchProvider>
      </TalntAuthProvider>
    </TalntThemeProvider>
  );
}
