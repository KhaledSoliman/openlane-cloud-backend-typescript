import { Connections, constants } from "./index";

export default () => Connections.get(constants.CONNECTIONS.SQLITE);
