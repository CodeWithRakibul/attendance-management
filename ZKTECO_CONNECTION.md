# ZKTeco Connection Component

This document describes the ZKTeco connection functionality added to the attendance management system.

## Features

- **Device Connection Interface**: A clean, user-friendly interface to connect to ZKTeco attendance devices
- **IP and Port Configuration**: Input fields for device IP address and port number
- **Connection Status**: Real-time connection status with visual indicators
- **Database Storage**: All device connections are stored in a local SQLite database
- **Automatic Navigation**: Redirects to dashboard upon successful connection

## Components

### ZKTecoConnection Component (`components/zkteco-connection.tsx`)

The main connection interface with the following features:
- Device name input field
- IP address input field (defaults to 192.168.0.162)
- Port input field (defaults to 4370)
- Connect/Disconnect button with loading states
- Error handling and success messages
- Automatic redirect to dashboard on successful connection

### Database Schema

The system uses SQLite with the following tables:

#### `devices` table
- `id`: Primary key
- `name`: Device name
- `ip`: Device IP address
- `port`: Device port number
- `status`: Connection status (disconnected, connected, failed, error)
- `last_connected`: Timestamp of last successful connection
- `created_at`: Device creation timestamp
- `updated_at`: Last update timestamp

#### `device_connections` table
- `id`: Primary key
- `device_id`: Foreign key to devices table
- `connected_at`: Connection attempt timestamp
- `disconnected_at`: Disconnection timestamp
- `status`: Connection attempt status
- `error_message`: Error message if connection failed

## API Endpoints

### `/api/devices`
- `GET`: Retrieve all devices
- `POST`: Create a new device

### `/api/devices/[id]`
- `GET`: Get device by ID
- `PUT`: Update device information
- `DELETE`: Delete device

### `/api/devices/[id]/connect`
- `POST`: Attempt to connect to a device

## Usage

1. Navigate to the home page (`/`)
2. Enter device name, IP address, and port
3. Click "Connect" button
4. System will attempt to connect to the ZKTeco device
5. On successful connection, user is redirected to dashboard
6. Connection details are saved to the local database

## Database Location

The SQLite database is stored at: `data/attendance.db`

## Dependencies

- `better-sqlite3`: SQLite database driver
- `zkteco-js`: ZKTeco device communication library
- `@types/better-sqlite3`: TypeScript definitions

## Error Handling

The system handles various error scenarios:
- Invalid IP/port format
- Network connection failures
- Device timeout errors
- Database operation failures

All errors are logged and displayed to the user with appropriate error messages.
