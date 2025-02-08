import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');
    
    if (!companyId) {
        return NextResponse.json({ error: 'Company ID is required' }, { status: 400 });
    }
    
    try {
        const response = await fetch('https://jsonblob.com/api/jsonBlob/1336569655342587904/');
        if (!response.ok) {
            throw new Error('Failed to fetch data from JSONBlob');
        }
        
        const data = await response.json();
        
        if (!data[companyId]) {
            return NextResponse.json({ error: 'Company ID not found' }, { status: 404 });
        }
        
        return NextResponse.json(data[companyId]);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        return NextResponse.json({ error: errorMessage }, { status: 500 });
    }
}
