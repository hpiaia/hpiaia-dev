import { Suspense, useState } from "react";

import Content from "./components/Content";
import Scene from "./components/Scene";

export default function App() {
  const [tvMode, setTvMode] = useState(false);

  if (tvMode) {
    return (
      <Suspense fallback={<div className="text-white flex items-center justify-center h-full">Loading...</div>}>
        <Scene>
          <Content tvMode toggleTvMode={() => setTvMode(false)} />
        </Scene>
      </Suspense>
    );
  }

  return <Content toggleTvMode={() => setTvMode(true)} />;
}
