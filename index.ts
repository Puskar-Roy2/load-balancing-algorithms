interface Server {
    name: string;
    weight: number;
    healthCheck(): boolean;
}

class LoadBalancer {
    private servers: Server[];
    private currentIndex: number;

    constructor(servers: Server[]) {
        this.servers = servers;
        this.currentIndex = 0;
    }

    public getNextServer(): string {
        let serverIndex = this.currentIndex;
        let totalWeight = this.servers.reduce((acc, server) => acc + server.weight, 0);

        while (true) {
            const server = this.servers[serverIndex];
            if (server.healthCheck()) {
                return server.name;
            }

            serverIndex = (serverIndex + 1) % this.servers.length;
            if (serverIndex === this.currentIndex) {
                throw new Error('All servers are unhealthy');
            }
        }
    }
}

const servers: Server[] = [
    { name: 'server1', weight: 2, healthCheck: () => Math.random() < 0.9 },
    { name: 'server2', weight: 1, healthCheck: () => Math.random() < 0.8 },
    { name: 'server3', weight: 3, healthCheck: () => Math.random() < 0.7 }
];
const loadBalancer = new LoadBalancer(servers);

for (let i = 0; i < 10; i++) {
    try {
        const nextServer = loadBalancer.getNextServer();
        console.log(`Request ${i + 1} goes to ${nextServer}`);
    } catch (error) {
        console.error(error.message);
    }
}
