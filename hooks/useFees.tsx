import {
  getMarketIndexBySymbol,
  PerpMarket,
} from '@blockworks-foundation/mango-client'
import useSrmAccount from '../hooks/useSrmAccount'
import useMangoStore from '../stores/useMangoStore'

export default function useFees(isBasisTrade = false) {
  const { rates } = useSrmAccount()
  const mangoGroup = useMangoStore((s) => s.selectedMangoGroup.current)
  const mangoGroupConfig = useMangoStore((s) => s.selectedMangoGroup.config)
  const marketConfig = useMangoStore((s) => s.selectedMarket.config)
  const market = useMangoStore((s) => s.selectedMarket.current)
  const marketIndex = getMarketIndexBySymbol(
    mangoGroupConfig,
    marketConfig.baseSymbol
  )

  if (!mangoGroup) return {}

  let takerFee, makerFee
  if (market instanceof PerpMarket) {
    takerFee = parseFloat(
      mangoGroup.perpMarkets[marketIndex].takerFee.toFixed()
    )
    makerFee = parseFloat(
      mangoGroup.perpMarkets[marketIndex].makerFee.toFixed()
    )
    if (isBasisTrade) {
      takerFee = takerFee + rates.takerWithRebate
      makerFee = makerFee + rates.maker
     }
  } else {
    takerFee = rates.takerWithRebate
    makerFee = rates.maker
  }

  return { makerFee, takerFee }
}
