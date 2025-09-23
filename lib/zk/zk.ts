
import Zkteco from "zkteco-js";

// ZKLib instance configuration
const ZK_CONFIG = {
  ip: '192.168.0.162',
  port: 4370,
  inport: 5000,
  timeout: 5200,
};

// Create and export ZKLib instance
export const zkInstance = new Zkteco(
  ZK_CONFIG.ip,
  ZK_CONFIG.port,
  ZK_CONFIG.inport,
  ZK_CONFIG.timeout,
);

// Export configuration for reference
export { ZK_CONFIG };

// Connect function
export async function connect(): Promise<boolean> {
  try {
    return await zkInstance.createSocket();
  } catch (error) {
    console.error('Failed to connect to ZK device:', error);
    return false;
  }
}

// Create a new ZK instance with custom IP and port
export function createZKInstance(ip: string, port: number, inport: number = 5000, timeout: number = 5200) {
  return new Zkteco(ip, port, inport, timeout);
}

// Connect to a specific device
export async function connectToDevice(ip: string, port: number): Promise<boolean> {
  try {
    const zk = createZKInstance(ip, port);
    return await zk.createSocket();
  } catch (error) {
    console.error('Failed to connect to ZK device:', error);
    return false;
  }
}