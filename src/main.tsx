import React, {Profiler} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import {QueryClient, QueryClientProvider} from "react-query";



async function enableMocking() {
    if(!import.meta.env.DEV){
        return
    }

    const { worker } = await import('./msw/browser')

    // `worker.start()` returns a Promise that resolves
    // once the Service Worker is up and ready to intercept requests.
    return worker.start()
}


const queryClient = new QueryClient();
enableMocking().then(()=>{

    ReactDOM.createRoot(document.getElementById('root')!).render(
        <React.StrictMode>
            <Profiler id='root'
                      onRender={(id, phase, actualDuration, baseDuration, startTime, commitTime, interactions) => console.info({
                          'root profiler':id,
                          'phase':phase,
                          'actualDuration':actualDuration,
                          'baseDuration':baseDuration,
                          'startTime':startTime,
                          'commitTime':commitTime,
                          'interactions':interactions
                      })
            }>
                <QueryClientProvider client={queryClient}>
                    <App/>
                </QueryClientProvider>
            </Profiler>
        </React.StrictMode>,
    )

})