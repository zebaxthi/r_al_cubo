import NetInfo from "@react-native-community/netinfo";
import { useEffect, useState } from "react";

export function useOnlineStatus(): boolean {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const sub = NetInfo.addEventListener((state) => {
      setOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
    NetInfo.fetch().then((state) => {
      setOnline(state.isConnected === true && state.isInternetReachable !== false);
    });
    return () => sub();
  }, []);

  return online;
}
