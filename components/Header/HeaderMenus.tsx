import HeaderMenu, { HeaderMenuItem } from 'components/Header/HeaderMenu'
import React from 'react'
import { classes, dungeons } from 'utils/warcraft'

const makeLink = (type: string, category?: string) => {
  let link = `/search?refinementList[type][0]=${type}`
  if (category) link += `&refinementList[categoryNames][0]=${category}`
  return link
}

const weakAuraItems: HeaderMenuItem[] = classes.map((klass) => ({
  label: klass,
  href: makeLink('weakaura', klass),
}))

const routeItems: HeaderMenuItem[] = dungeons.map((dungeon) => ({
  label: dungeon,
  href: makeLink('mdt', dungeon),
}))

const elvuiItems: HeaderMenuItem[] = classes.map((klass) => ({
  label: klass,
  href: makeLink('elvui', klass),
}))

const HeaderMenus = () => {
  return (
    <>
      <HeaderMenu
        title='WeakAuras'
        link={makeLink('weakaura')}
        items={weakAuraItems}
      />
      <HeaderMenu title='Routes' link={makeLink('mdt')} items={routeItems} />
      <HeaderMenu title='ElvUI' link={makeLink('elvui')} items={elvuiItems} />
    </>
  )
}

export default HeaderMenus
