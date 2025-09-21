'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Loader2, Wifi, WifiOff } from 'lucide-react';

interface ConnectionState {
  isConnecting: boolean;
  isConnected: boolean;
  error: string | null;
  deviceId: number | null;
}

export default function ZKTecoConnection() {
  const router = useRouter();
  const [ip, setIp] = useState('192.168.0.162');
  const [port, setPort] = useState('4370');
  const [deviceName, setDeviceName] = useState('ZKTeco Device');
  const [connectionState, setConnectionState] = useState<ConnectionState>({
    isConnecting: false,
    isConnected: false,
    error: null,
    deviceId: null
  });

  const handleConnect = async () => {
    if (!ip || !port || !deviceName) {
      setConnectionState(prev => ({
        ...prev,
        error: 'Please fill in all fields'
      }));
      return;
    }

    setConnectionState({
      isConnecting: true,
      isConnected: false,
      error: null,
      deviceId: null
    });

    try {
      // First, create or get the device
      const deviceResponse = await fetch('/api/devices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: deviceName,
          ip: ip,
          port: parseInt(port)
        }),
      });

      const deviceResult = await deviceResponse.json();

      if (!deviceResult.success) {
        throw new Error(deviceResult.error || 'Failed to create device');
      }

      const deviceId = deviceResult.data.id;

      // Now attempt to connect
      const connectResponse = await fetch(`/api/devices/${deviceId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ip: ip,
          port: parseInt(port)
        }),
      });

      const connectResult = await connectResponse.json();

      if (connectResult.success) {
        setConnectionState({
          isConnecting: false,
          isConnected: true,
          error: null,
          deviceId: deviceId
        });

        // Navigate to dashboard after successful connection
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
      } else {
        setConnectionState({
          isConnecting: false,
          isConnected: false,
          error: connectResult.error || 'Connection failed',
          deviceId: deviceId
        });
      }
    } catch (error) {
      setConnectionState({
        isConnecting: false,
        isConnected: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred',
        deviceId: null
      });
    }
  };

  const handleDisconnect = () => {
    setConnectionState({
      isConnecting: false,
      isConnected: false,
      error: null,
      deviceId: null
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            {connectionState.isConnected ? (
              <Wifi className="h-6 w-6 text-blue-600" />
            ) : (
              <WifiOff className="h-6 w-6 text-gray-400" />
            )}
          </div>
          <CardTitle className="text-2xl">ZKTeco Connection</CardTitle>
          <CardDescription>
            Connect to your ZKTeco attendance device
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deviceName">Device Name</Label>
            <Input
              id="deviceName"
              type="text"
              placeholder="Enter device name"
              value={deviceName}
              onChange={(e) => setDeviceName(e.target.value)}
              disabled={connectionState.isConnecting || connectionState.isConnected}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ip">IP Address</Label>
            <Input
              id="ip"
              type="text"
              placeholder="192.168.0.162"
              value={ip}
              onChange={(e) => setIp(e.target.value)}
              disabled={connectionState.isConnecting || connectionState.isConnected}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="port">Port</Label>
            <Input
              id="port"
              type="number"
              placeholder="4370"
              value={port}
              onChange={(e) => setPort(e.target.value)}
              disabled={connectionState.isConnecting || connectionState.isConnected}
            />
          </div>

          {connectionState.error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600">{connectionState.error}</p>
            </div>
          )}

          {connectionState.isConnected && (
            <div className="rounded-md bg-green-50 p-3">
              <p className="text-sm text-green-600">
                Successfully connected! Redirecting to dashboard...
              </p>
            </div>
          )}

          <div className="flex gap-2">
            {!connectionState.isConnected ? (
              <Button
                onClick={handleConnect}
                disabled={connectionState.isConnecting}
                className="flex-1"
              >
                {connectionState.isConnecting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  'Connect'
                )}
              </Button>
            ) : (
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="flex-1"
              >
                Disconnect
              </Button>
            )}
          </div>

          <div className="text-center">
            <Button
              variant="link"
              onClick={() => router.push('/dashboard')}
              className="text-sm text-gray-500"
            >
              Skip to Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
