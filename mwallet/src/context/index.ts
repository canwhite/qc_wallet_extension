import { createContext } from "react";
//然后ChainInfoContext又分为两部分，一个是provider，一个是
const ChainInfoContext = createContext<string>("0x1");
export default ChainInfoContext;
