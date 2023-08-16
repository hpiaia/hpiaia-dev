import { Suspense, useState } from "react";

import Content from "./components/Content";
import Loading from "./components/Loading";
import Scene from "./components/Scene";

export default function App() {
  const [tv, setTv] = useState(false);

  if (!tv) return <Content toggleTv={() => setTv(true)} />;

  return (
    <Suspense fallback={<Loading />}>
      <Scene>
        <Content tv toggleTv={() => setTv(false)} />
      </Scene>
    </Suspense>
  );
}
