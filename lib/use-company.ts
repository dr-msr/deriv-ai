import { atom, useAtom } from "jotai"
import { Company } from "./company"

type Config = {
  selected: Company["symbol"] | null
  companies: Company[]
}

const configAtom = atom<Config>({
  selected: null,
  companies: []
})

export function useCompany() {
  const [config, setConfig] = useAtom(configAtom)

  return {
    selected: config.companies.find((company) => company.symbol === config.selected),
    companies: config.companies,
    select: (id: string | null) => {
      setConfig((config) => ({
        ...config,
        selected: id,
      }))
    },
    setCompanies: (companies: Company[]) => {
      setConfig((config) => ({
        ...config,
        companies,
        selected: config.selected || companies[0]?.symbol || null
      }))
    }
  }
}