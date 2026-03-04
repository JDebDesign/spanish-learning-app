import { ChorusPlayer } from '@/pages/chorus/ChorusPlayer'
import { WakeLockProvider } from '@/shared/contexts/WakeLockContext'

function App() {
  return (
    <WakeLockProvider>
      <ChorusPlayer />
    </WakeLockProvider>
  )
}

export default App
