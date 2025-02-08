import { cookies, headers } from "next/headers"
import Image from "next/image"

import { accounts } from "@/lib/data"
import { Unleashed } from "@/components/unleashed"
import { Company } from "@/lib/company"

async function getCompanies(): Promise<Company[]> {
  try {
    // Get the host header to construct the absolute URL
    const headersList = headers();
    const host = (await headersList).get('host') || 'localhost:3000';
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    
    const baseUrl = `${protocol}://${host}`;
    console.log('Fetching companies from:', `${baseUrl}/api/allCompany`);
    
    const response = await fetch(`${baseUrl}/api/allCompany`, {
      cache: 'no-store'  // Disable caching to always get fresh data
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw new Error(`Failed to fetch companies: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export default async function MailPage() {
  const layout = (await cookies()).get("react-resizable-panels:layout:mail")
  const collapsed = (await cookies()).get("react-resizable-panels:collapsed")
  const companies = await getCompanies();

  const defaultLayout = layout ? JSON.parse(layout.value) : undefined
  const defaultCollapsed = collapsed ? JSON.parse(collapsed.value) : undefined

  return (
    <>
      <div className="md:hidden">
        <Image
          src="/examples/mail-dark.png"
          width={1280}
          height={727}
          alt="Mail"
          className="hidden dark:block"
        />
        <Image
          src="/examples/mail-light.png"
          width={1280}
          height={727}
          alt="Mail"
          className="block dark:hidden"
        />
      </div>
      <div className="hidden flex-col md:flex">
        <Unleashed
          accounts={accounts}
          companies={companies}
          defaultLayout={defaultLayout}
          defaultCollapsed={defaultCollapsed}
          navCollapsedSize={4}
        />
      </div>
    </>
  )
}