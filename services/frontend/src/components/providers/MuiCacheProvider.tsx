import React from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";

type Props = {
    children: React.ReactNode;
};

export default function MuiCacheProvider({ children }: Props) {
    return <AppRouterCacheProvider>{children}</AppRouterCacheProvider>;
}
