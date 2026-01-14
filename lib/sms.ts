export async function sendSMS(to: string, message: string) {
    if (!process.env.SMS_API_KEY) {
        console.log(`[MOCK SMS] To: ${to}, Message: ${message}`)
        return { success: true, mock: true }
    }

    try {
        // Implementation for real SMS gateway would go here
        // const response = await fetch('https://sms-gateway.com/api', { ... })
        console.log(`[REAL SMS Attempt] To: ${to}, Message: ${message}`)
        return { success: true }
    } catch (error) {
        console.error('Failed to send SMS:', error)
        return { success: false, error }
    }
}
