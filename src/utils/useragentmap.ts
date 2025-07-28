class UserAgentMap {
    private userToAgent = new Map<string, string>();

    assign(userPhone: string, agentId: string) {
        this.userToAgent.set(userPhone, agentId);
    }

    getAgentId(userPhone: string): string | undefined {
        return this.userToAgent.get(userPhone);
    }

    remove(userPhone: string) {
        this.userToAgent.delete(userPhone);
    }
}

export const userAgentMap = new UserAgentMap();