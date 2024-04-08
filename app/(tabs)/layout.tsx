import {ReactNode} from "react";
import TabBar from "@/components/tab-bar";

export default function TabLayout({ children }: { children: ReactNode }) {
    return <div>
        {children}
        <TabBar />
    </div>
}