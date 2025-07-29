import { Socket } from 'socket.io';

class ConnectedAgents {
    private agents: Map<string, Map<string, Socket>> = new Map();

    add(token: string, agentId: string, socket: Socket) {
        if (!this.agents.has(token)) {
            this.agents.set(token, new Map());
        }
        this.agents.get(token)?.set(agentId, socket);
    }

    remove(token: string, agentId: string) {
        this.agents.get(token)?.delete(agentId);
    }

    get(token: string, agentId: string): Socket | undefined {
        return this.agents.get(token)?.get(agentId);
    }

    getAll(token: string): Socket[] {
        return Array.from(this.agents.get(token)?.values() || []);
    }

    has(token: string, agentId: string): boolean {
        return this.agents.get(token)?.has(agentId) || false;
    }
}

export const connectedAgents = new ConnectedAgents();