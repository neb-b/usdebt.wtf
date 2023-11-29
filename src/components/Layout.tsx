import React from 'react'
import axios from 'axios'
import GithubLogo from './GithubLogo'

type Props = {
  children: React.ReactNode
}

const Layout: React.FC<Props> = ({ children }) => {
  const [visitors, setVisitors] = React.useState<number | null>(null)

  React.useEffect(() => {
    axios.get('/api/visitors').then((res) => {
      setVisitors(res.data.visitors)
    })
  })

  return (
    <div className="relative text-white bg-zinc-900 px-6 py-6">
      <div className="text-3xl font-extrabold text-orange-500">wtf?</div>

      <div className="flex flex-col max-w-3xl mx-auto">
        <div className="mx-auto mt-6">{children}</div>

        <div className="flex flex-col md:flex-row items-start md:items-center mt-auto w-full font-normal">
          <a href="https://github.com/neb-b/debtclock" className="text-orange-500 mb-2 md:mb-0">
            <div className="flex items-center">
              <GithubLogo />
              <span className="ml-2">Github</span>
            </div>
          </a>

          <div className="ml-0 md:ml-4">
            <span className="mr-1 inline-block">Inspired by</span>
            <a href="https://usdebtclock.org" className="text-orange-500">
              usdebtclock.org
            </a>
          </div>

          {visitors && (
            <span className="ml-0 md:ml-auto text-xs mt-4 md:mt-0">{visitors.toLocaleString()} visitors</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default Layout
