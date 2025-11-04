import { NextRequest, NextResponse } from "next/server";

const DEFAULT_AUTH_ERROR = NextResponse.json(
  { success: false, error: 'Unauthorized - Invalid credentials' },
  {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Admin Area"'
    }
  }
);

export function basicAuth(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return DEFAULT_AUTH_ERROR
  }

  const base64Credentials = authHeader.slice(6);
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username !== adminUsername || password !== adminPassword) {

    return DEFAULT_AUTH_ERROR;
  };
}