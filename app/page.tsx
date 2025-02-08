import { cookies } from "next/headers"
import Image from "next/image"

import { accounts } from "@/lib/data"
import { Unleashed } from "@/components/unleashed"
import { Company } from "@/lib/company"

async function getCompanies(): Promise<Company[]> {
  const response = await fetch('http://localhost:3000/api/allCompany', {
    cache: 'no-store'  // Disable caching to always get fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch companies');
  }
  
  return response.json();
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