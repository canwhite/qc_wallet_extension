import { createContext } from "react";
//provider and consumer
const ChainInfoContext = createContext<string>("0x1");
export default ChainInfoContext;
