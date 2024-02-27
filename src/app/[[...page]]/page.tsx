import "./page.css";

import dynamic from "next/dynamic";

import Content from "@/components/Content";
import { Loading } from "@/components/Loading";

const Scene = dynamic(() => import("@/components/Scene"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function Home({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  if (typeof searchParams.tv === "undefined") {
    return <Content />;
  }

  return (
    <Scene>
      <Content tv />
    </Scene>
  );
}
